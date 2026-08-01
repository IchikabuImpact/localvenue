# ブログ機能 設計

最終更新: 2026-08-01
前提: `docs/BLOG_REQUIREMENTS.md`（R1〜R11、確定済み）
状態: 設計フェーズ（実装は未着手）

## 実装言語

Node.jsで統一する（既存の `scripts/lib/pagegen/html-renderer.js`・`scripts/lib/seo/sitemap-generator.js`・`scripts/lib/pagegen/page-utils.js` をそのまま再利用し、npm依存管理・`node --test` によるテストも一本化するため）。PHP等の別言語は導入しない。

## ディレクトリ構成

```
content/
  blog/
    2026-07-nar-sire-natsu.md        # 記事本体（frontmatter + Markdown本文）
    images/
      2026-07-nar-sire-natsu/
        chart1.png                    # 記事ごとのサブディレクトリに画像を置く

scripts/
  generate-blog-pages.js              # エントリポイント（既存 generate-daily-pages.js と対の構成）
  lib/
    blog/
      blog-taxonomy.js                # カテゴリ4つ・タグ3つの固定列挙（R8）
      blog-frontmatter.js             # frontmatter抽出・バリデーション
      blog-markdown.js                # Markdown本文 -> HTML変換（見出し階層チェック含む）
      blog-post-loader.js             # content/blog/*.md を読み込みPost[]を構築
      blog-html-renderer.js           # 記事詳細/一覧/カテゴリ/タグページのHTML生成
      blog-feed-generator.js          # feed.xml (RSS 2.0) 生成（R10）

public/
  blog/
    index.html                        # 全記事一覧（新着順）
    2026-07-nar-sire-natsu.html        # 記事詳細（R7のURL命名）
    category/
      keito.html
      jockey-trainer.html
      roi.html
      venue-season.html
    tag/
      monthly-report.html             # noindex（R8）
      deep-dive.html
      quick-take.html
    images/
      2026-07-nar-sire-natsu/
        chart1.png
    feed.xml
```

`content/` と `public/blog/images/` を分けない理由: R3で「記事画像はリポジトリにcommitし `public/blog/images/` に配置」と確定済みなので、画像は最初から `public/blog/images/<slug>/` に置き、ビルド時のコピー処理は不要にする（Markdown側は `/blog/images/<slug>/chart1.png` を直接参照する）。

## データモデル（frontmatter）

```yaml
---
title: "7月のNAR種牡馬成績、夏に強いのは？"
date: "2026-08-02"          # 公開日（記事一覧のソート・feed.xml用。URLには含めない = R7）
period: "2026-07"           # 対象期間（年月）。スラッグ生成の元にもなる
slug: "nar-sire-natsu"       # 内容キーワード部分（英数字・ハイフンのみ）
category: "keito"            # blog-taxonomy.js のCATEGORIESキーのいずれか1つ（必須）
tags: ["monthly-report"]     # blog-taxonomy.js のTAGSキーの0〜1個（R8）
description: "2026年7月のNAR実績から..."   # meta description / OGP descriptionに使用（必須）
image: "/blog/images/2026-07-nar-sire-natsu/chart1.png"  # OGP画像（任意）
draft: false                 # true の間はビルド対象外（下書き保存用）
---

本文はMarkdown。h1は使わない（記事タイトルはfrontmatterのtitleから自動生成）。h2から開始。
```

- 出力ファイル名（R7）: `{period}-{slug}.html` を `blog-post-loader.js` が機械生成する。例 `period: "2026-07"`, `slug: "nar-sire-natsu"` → `public/blog/2026-07-nar-sire-natsu.html`。手打ちミスを防ぐため、frontmatterに最終ファイル名を直接書かせない。
- `category`・`tags` は `blog-taxonomy.js` の固定列挙に無い値だとビルドを失敗させる（バリデーション、typo増殖防止）。
- `draft: true` の記事は一覧・カテゴリ・タグ・feed.xml・sitemapのいずれにも出さない（土日に書きかけをcommitしても公開されない安全弁）。

## モジュール責務

### `blog-taxonomy.js`
```js
const CATEGORIES = {
  keito:           { label: '血統・種牡馬',   path: 'category/keito.html' },
  'jockey-trainer': { label: '騎手・調教師',   path: 'category/jockey-trainer.html' },
  roi:             { label: '回収率・万馬券', path: 'category/roi.html' },
  'venue-season':  { label: '会場・季節',     path: 'category/venue-season.html' },
};
const TAGS = {
  'monthly-report': { label: '月次定例レポート', path: 'tag/monthly-report.html' },
  'deep-dive':      { label: '掘り下げ考察',     path: 'tag/deep-dive.html' },
  'quick-take':     { label: '小ネタ・速報',     path: 'tag/quick-take.html' },
};
module.exports = { CATEGORIES, TAGS };
```
単なるデータ定義。5つ目のカテゴリ追加をしない方針（R11）を守るため、ここへの追加はレビュー対象として目立たせる。

### `blog-frontmatter.js`
- `---`で囲まれた先頭ブロックを抽出し、`key: value` / `key: ["a","b"]` 程度の単純なYAMLサブセットのみをパースする（フルのYAML文法は不要なので `js-yaml` 等の依存は追加しない）。
- 必須項目（title/date/period/slug/category/description）の欠落、`category`/`tags`が`blog-taxonomy.js`に無い値、`slug`が`^[a-z0-9-]+$`に一致しない、を検知して例外を投げる。
- 例外はファイル名付きでthrowし、`generate-blog-pages.js`側で「どの記事が壊れているか」が一目で分かるようにする。

### `blog-markdown.js`
- Markdown本文をHTMLに変換する。依存として **`markdown-it`を新規追加**する（見出し・表・リスト・強調・リンクをカバーする必要があり、自前実装は割に合わない。プラグイン無しのコア機能のみ使用）。
- 変換後、`h1`が含まれていたらビルドエラーにする（R5: 見出し階層は`h1`=記事タイトルのみ、本文は`h2`から）。
- 出力HTMLの見出し(`h2`)からトップ内リンク用の`id`スラッグを自動付与（任意の目次生成に将来使える程度の下準備、実装は最小限）。

### `blog-post-loader.js`
- `content/blog/*.md` を全走査し、`blog-frontmatter.js` + `blog-markdown.js` を通してPostオブジェクト配列を構築する。
```ts
Post = {
  slug: string,            // "2026-07-nar-sire-natsu"（period+slug結合済み、ファイル名の元）
  title: string,
  date: string,            // "2026-08-02"
  period: string,          // "2026-07"
  category: string,        // CATEGORIESのキー
  tags: string[],
  description: string,
  image: string | null,
  bodyHtml: string,
  sourcePath: string,      // エラー表示用
}
```
- `draft: true` は除外。`date`降順でソート済みの配列を返す。
- 出力ファイル名の衝突（同じ `period+slug`）はビルドエラーにする。

### `blog-html-renderer.js`
- 既存 `html-renderer.js` の `htmlHead` / `htmlFoot` をそのまま`require`して使う（レイアウト・ヘッダーnav・フッターを共通化 = R9のnav変更は`html-renderer.js`側の1箇所修正で全ページに反映される設計）。
- 提供する関数:
  - `renderBlogIndexPage({ posts })` — 全記事一覧（新着順、カード表示）
  - `renderBlogPostPage({ post, relatedPosts })` — 記事詳細。JSON-LD(`BlogPosting`)・OGP・canonical・meta descriptionをここで埋め込む（R5）
  - `renderBlogCategoryPage({ category, posts })` — カテゴリ別一覧（index対象）
  - `renderBlogTagPage({ tag, posts })` — タグ別一覧（`<meta name="robots" content="noindex">`付与、R8）
- 予想一覧ページ（`renderIndexPage`、既存）への「最新ブログ」ティザー追加もここから小さい関数（`renderBlogTeaser({ latestPost })`）としてexportし、`generate-daily-pages.js`側で呼び出す形にする（R9後半の要件）。

### `blog-feed-generator.js`
- 全公開記事（`draft`除く）から RSS 2.0 の `feed.xml` を生成する（R10）。`config.siteUrl` を使って絶対URLを組み立てる（既存の `sitemap-generator.js` の `normalizeBaseUrl` を再利用）。

### `generate-blog-pages.js`（エントリポイント）
既存 `generate-daily-pages.js` と対になる構成。DBアクセスなし・純粋にファイルI/Oのみ（R1/R6と整合）。

```js
#!/usr/bin/env node
/**
 * @file generate-blog-pages.js
 * Usage: node scripts/generate-blog-pages.js
 * 自宅の執筆セッション内でその場で実行し、public/blog以下をcommit・pushする（R6）。
 */
'use strict';
const config = require('../config/config.js');
const { loadPosts } = require('./lib/blog/blog-post-loader');
const {
  renderBlogIndexPage, renderBlogPostPage,
  renderBlogCategoryPage, renderBlogTagPage,
} = require('./lib/blog/blog-html-renderer');
const { writeFeed } = require('./lib/blog/blog-feed-generator');
const { CATEGORIES, TAGS } = require('./lib/blog/blog-taxonomy');
const { writeSitemap } = require('./lib/seo/sitemap-generator');

// 1. content/blog/*.md を読み込み・検証・HTML化
// 2. public/blog/{slug}.html を書き出し
// 3. public/blog/index.html を書き出し
// 4. public/blog/category/*.html を CATEGORIES 全件分書き出し
// 5. public/blog/tag/*.html を TAGS 全件分書き出し
// 6. public/blog/feed.xml を書き出し
// 7. writeSitemap() を呼び直して sitemap.xml にブログURLも反映
```

## `sitemap-generator.js` への統合

`STATIC_HTML_PRIORITIES` はファイル走査ベース（`collectHtmlFiles`が`publicDir`配下を再帰walkする既存実装）なので、`public/blog/`配下も自動的に拾われる。追加で必要な変更は最小限:
- `priorityFor()` に `^blog/index\.html$` → `0.8`、`^blog/category/.+\.html$` → `0.6`、`^blog/[\w-]+\.html$`（記事詳細）→ `0.6`、`^blog/tag/.+\.html$` → 除外 or `0.3`（noindexだが念のためsitemapからは外す）を追加。
- 既存のロジックを拡張するだけで、`generate-blog-pages.js`側で`writeSitemap`を呼び直す形と整合する。

## ヘッダーnav / フッターの変更（`html-renderer.js`）

```diff
     <nav>
-      <a href="/index.html">一覧</a>
+      <a href="/index.html">予想一覧</a>
+      <a href="/blog/index.html">ブログ</a>
       <a href="/recovery.html">回収率</a>
```
R9で確定した通りラベルは`予想一覧`のまま、追加は「ブログ」1項目のみ。フッターの規約/プライバシー/お問い合わせ行は変更なし。

## CSSの追加

`public/css/style.css` に既存の `.card` / `.container` トークン（`--panel`, `--border`, `--muted`等のCSS変数）をそのまま使い回す形で、`.blog-card` / `.blog-post` / `.blog-taxonomy-badge` 程度の最小クラスを追加する（新しいデザイントークン体系は作らない）。

## package.json の変更

- 依存追加: `markdown-it`（Markdown→HTML変換。frontmatterパーサーは自前の軽量実装で依存追加なし）
- npm script追加: `"blog": "node scripts/generate-blog-pages.js"`

## テスト方針（`node --test`、既存規約に合わせる）

```
tests/unit/blog/
  blog-frontmatter.test.js      # 必須項目欠落・不正category/tag・不正slugでエラーになること
  blog-markdown.test.js         # h1混入でエラー、見出し/表/リンクが変換されること
  blog-post-loader.test.js      # draft除外、date降順ソート、ファイル名衝突検知
  blog-html-renderer.test.js    # JSON-LD/OGP/canonicalが出力に含まれること、tagページにnoindexが付くこと
  blog-feed-generator.test.js   # feed.xmlの必須要素（title/link/pubDate等）
```
既存の `tests/unit/seo/sitemap-generator.test.js` と同様、一時ディレクトリ（`fs.mkdtempSync`）を使ったファイルベースのテストにする。

## 未実装項目・確認したい点

1. `markdown-it` の追加（新規npm依存）— 実行はローカルのみでVPSには影響しないが、`npm install`が必要になる旨は明記しておく。
2. 予想一覧ページへの「最新ブログ」ティザーの具体的な表示位置（ROIサマリーの上/下どちらか）は未確定。
3. 記事詳細ページのJSON-LD `BlogPosting` の `author` フィールドをどう書くか（個人運営なので実名を出すか、サイト名義にするか）は要確認。CLAUDE.mdの「個人情報を書かない」方針とも関わるため、サイト名義（`けんちゃん馬券☆WEB`）での統一を推奨。

この設計で良ければ、次は実装（`blog-taxonomy.js`から順にボトムアップで作成）に進みます。
