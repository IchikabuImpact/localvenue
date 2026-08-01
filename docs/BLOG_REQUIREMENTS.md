# ブログ機能 要件定義

最終更新: 2026-08-01
状態: 要件定義フェーズ（設計・実装は未着手）

## 目的

既存サイト（NAR予想の静的HTMLサイト）にブログ機能を追加する。狙いは「面白いデータ」を紹介してPVを集め、将来的にアフィリエイトで収益化すること。

## 背景・検討経緯

- 実装方式として「自前実装（同一ドメイン `/blog/`）」と「Blogger等の外部サービス」を比較検討した。
- Blogger案は独自ドメイン接続してもパス統合（`/blog/`）ができずサブドメイン扱いになり、既存サイトとドメインオーソリティ・被リンク構造が分離してSEO上不利なため却下。
- 既存の `scripts/lib/pagegen/html-renderer.js` のレイアウト・ヘッダー/フッターを流用し、既存ページと統一デザインで内部リンクを強化できる自前実装（同一ドメイン）を採用する。
- CMS（管理画面）は導入しない。記事はMarkdownで直接リポジトリに書き、Gitで管理する運用（Git-backed）を採用。理由は既存の運用スタイル（Claude Code CLI + Git）にそのまま乗れること、攻撃面を増やさないこと、将来Git-backed CMS（Decap CMS等）を後付けする余地を残せること。

## 執筆ワークフロー（想定）

- 執筆頻度: 土日のみ、自宅でClaude Code / Codexを使いながらネタ出し〜下書き〜仕上げをその場で行う。
- 記事は `content/blog/YYYY-MM-DD-slug.md`（frontmatterに title/date/tags/description 等）で作成しcommit。
- ビルド（`generate-blog-pages.js` 相当）も自宅の執筆セッション内でその場で実行し、生成された `.html` ごとcommit・push。既存の競馬データバッチ（`daily-yosou-batch.js` / `daily-result-batch.js`）とは実行サイクルを完全に独立させる（R6）。

## 確定要件

| ID | 要件 | 備考 |
|----|------|------|
| R1 | 配信はVPS側で `public/` を `git pull` するだけで完結すること。動的処理・DBアクセス・追加cron/プロセスをVPS側に増やさない | 必須制約。全ての派生要件の起点 |
| R2 | PV計測はGoogle Analytics（GA4）タグを埋め込む | 全ページ共通テンプレートの1箇所に仕込む |
| R3 | 記事画像はリポジトリにcommitし `public/blog/images/` に配置する | 外部画像ホスティングは使わない |
| R4 | 執筆はMarkdownで行うが、`public/` 配下に配置する成果物は必ず `.html`。生の `.md` 配信・クライアントサイドMarkdownレンダリングは行わない | ビルド時（`generate-blog-pages.js`）にMarkdown→静的HTML変換を完了させてからcommit |
| R5 | SEO/AI可読性のための共通仕様 | JSON-LD（`BlogPosting`）構造化データ／見出し階層統一（`h1`は記事タイトルのみ、`h2`で節分け）／`meta description`・OGP（`og:title`/`og:description`/`og:image`）必須／`canonical`タグ／既存 `lib/seo/sitemap-generator.js` にブログURLを組み込む |
| R6 | ビルドは自宅の執筆セッション内でその場で実行し、commit・push。競馬データバッチ（daily-yosou/result-batch）とは完全独立 | R1（git pullのみで配信）を満たすための帰結でもある |
| R7 | URL命名規則: `public/blog/YYYY-MM-keyword-slug.html`（年月＋内容キーワード、日次日付は入れない、ASCIIスラッグ） | 月次データレポートは対象期間（年月）が価値の核。公開日（執筆日）まで入れると再編集時に古く見えSEO評価が下がりやすいため除外。ファイル名はASCII/ローマ字ベースとし、日本語の可読性は `<title>`・見出し・meta descriptionで担保する |
| R8 | カテゴリ／タグの持ち方 | カテゴリは「分析対象」軸で固定4つ・増やさない前提：`keito`（血統・種牡馬）／`jockey-trainer`（騎手・調教師）／`roi`（回収率・万馬券）／`venue-season`（会場・季節）。各カテゴリはハブページ（`/blog/category/<id>.html`）を持ちindex対象（ピラーページ）とする。タグは「記事の形式」軸で固定3つ：`monthly-report`（月次定例レポート）／`deep-dive`（掘り下げ考察）／`quick-take`（小ネタ・速報）。タグページは記事数が少ない時期は薄いコンテンツになりやすいため `noindex`（回遊用途に限定）。1記事＝カテゴリ1つ＋タグ0〜1つを想定。カテゴリ・タグは自由入力にせず固定列挙（コード側で定義）としてtypoによる増殖を防ぐ |
| R9 | ヘッダーナビ構成: `予想一覧 \| ブログ \| 回収率 \| ご利用規約 \| プライバシーポリシー \| お問い合わせ`（項目追加なし、ラベルは`予想一覧`のまま確定） | ポータル誘導のための新規HOMEページは作らない（ルートのSEO評価が割れるため）。誘導効果は既存の予想一覧ページ内に「最新ブログ記事」ティザーブロックを追加することで実現する。`horse_win_pattern_rules`（`data/schema.sql`）により「人間+AI予想」という表現も実態を反映しうることが判明したが、ラベルは`予想一覧`のニュートラルな表現のまま据え置くことで確定 |
| R10 | RSSフィードを提供する。`public/blog/feed.xml` をビルド時（`generate-blog-pages.js`）に静的生成する | GitHub Actions等の新規CIは使わず、R6と同じく自宅の執筆セッション内のビルドで一緒に生成してcommit・pushする |
| R11 | 「予想ロジック解説」を5つ目のカテゴリとしては追加しない。R8の4カテゴリ（keito/jockey-trainer/roi/venue-season）で固定を維持する | 該当する舞台裏解説記事は `keito` または `roi` カテゴリ配下で `deep-dive` タグを付けて書く運用でカバーする |

## 未決着の論点

なし（2026-08-01時点で確定要件R1〜R11まで出揃った）。

## 却下した案

- **案2（ポータル的なHOMEページを新設）**: 現在の `index.html` は「今日のレース予想」という毎日更新される実コンテンツであり、実質的にルート `/` のSEO資産（クロール頻度・被リンクの受け皿）になっている。別途「HOME」という集約専用ページを作るとルート直下の役割が分散し、検索エンジンからの評価が薄まるため却下。同様の誘導効果は既存の予想一覧ページへのティザー追加で代替する（R9参照）。

## 次のステップ（未着手）

- `content/blog/` ディレクトリ構成の確定
- `generate-blog-pages.js` の設計（Markdownパーサー選定、`html-renderer.js` との共用方法、カテゴリ/タグページ生成ロジック、`feed.xml`生成ロジック）
- ヘッダーへの「ブログ」リンク追加、予想一覧ページへの最新ブログティザー追加の実装
