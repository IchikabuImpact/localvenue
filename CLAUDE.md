# CLAUDE.md — localvenue public-safe project context

このファイルは、公開リポジトリに置ける範囲の作業メモです。個人情報、実ドメイン、サーバー名、ユーザー名、絶対パス、パスワード、DBダンプの内容は書かないでください。

## ⚠️ この環境について（開発環境）

**このディレクトリは本番環境の複製（開発環境）です。** 本番は別ディレクトリ（同じホスト上の兄弟ディレクトリ、ディレクトリ名の末尾に`-dev`が付かない方）にあります。作業前に必ず以下を把握してください。

- **DBは本番とは別（`config/config.js`の`database`参照）**。専用ユーザーで、本番DBへの権限は一切ありません。
- **重要: DBは毎晩21:10ごろ、本番DBの内容で自動的に上書き同期されます。** devで書き込んだテストデータ・投入したレコードは翌朝には消えている前提で使ってください。恒久的に残したいデータはDBに置かず、別ファイルに退避してください。
- **gitブランチは`dev`固定です。`main`に直接pushしないでください。** 本番の`main`ブランチはVPSが`git pull`で追随しており、誤ってpushすると本番に即座に反映されます。このディレクトリ専用の自動push用スクリプト（`~/bin/`配下、リポジトリ非追跡）には、現在のブランチが`main`だと自動で処理を中止する安全装置がありますが、`git push origin main`のような直接操作は防げないため、コマンド実行前に`git branch`で現在のブランチを必ず確認してください。
- **本番への反映方法（2026-09-23時点）**: 自動マージの仕組みはまだありません。変更を本番に反映したい場合は、対象ファイル（ソースコードやコンテンツのMarkdown等）を本番ディレクトリ側に個別に取り込み（`git checkout origin/dev -- <path>`等）、本番のDB・環境で改めてテスト・ビルドしてからコミット・pushしてください。`public/`配下の生成物はdev環境のスナップショットに基づくため、本番へは持ち込まずに本番側で生成し直してください。
- `config/config.js`は`debug: true`（締め切りチェックなしで予想を常に上書きできるモード）になっています。本番相当の挙動を確認したい場合は一時的に`false`にしてください。

## プロジェクト概要

- NAR（日本地方競馬）の開催情報、出馬表、レース結果を取得し、予想・評価・ROI集計を行う Node.js ベースのバッチシステムです。
- 公開面は `public/` 配下に生成される静的HTMLです。
- DB接続情報は `config/config.js` にローカル作成し、リポジトリにはコミットしません。

## 主要ディレクトリ

| パス | 役割 |
| --- | --- |
| `config/` | `config.sample.js` とローカル専用設定ファイル |
| `data/` | スキーマ、シード、初期化スクリプト |
| `docs/` | 公開しても問題ない設計・仕様ドキュメント（予想スコア設計は `docs/PREDICTION_SCORING.md`、馬別加点ルールは `docs/HORSE_PATTERN_RULES.md`） |
| `scripts/` | Node.js バッチ・ライブラリ |
| `cron/` | 運用ラッパースクリプト |
| `public/` | 静的HTML生成先 |
| `tests/` | 単体テスト・疎通テスト |

## 日次バッチ

```bash
node scripts/daily-yosou-batch.js [YYYYMMDD]
node scripts/daily-result-batch.js [YYYYMMDD]
node scripts/generate-daily-pages.js [YYYYMMDD]
```

- 日付未指定時は当日分を処理します。
- 生成物は `public/` と `public/daily/YYYYMMDD/` に出力されます。
- 環境固有の cron 設定、実サーバーのパス、デプロイ先は公開ドキュメントに書かず、各環境で管理してください。

## DB と設定

```javascript
// config/config.js（gitignore済み・要手動作成）
module.exports = {
  mysql: {
    host: 'localhost',
    user: 'localvenue',
    password: 'YOUR_PASSWORD',
    database: 'localvenue',
    port: 3306
  },
  htmlRetentionDays: 30
};
```

- スキーマ共有は `data/schema.sql` を使ってください。
- DBダンプや実データの出力はローカル専用とし、`data/dumps/` はコミット対象外です。

## よく使うコマンド

```bash
npm test
npm run serve
node data/data_reset.js
node scripts/daily-yosou-batch.js 20260523
node scripts/daily-result-batch.js 20260523
```

## 公開前チェック

- `git status --short` で DBダンプ、ログ、`.env`、`config/config.js` が含まれていないこと。
- `rg -n "(password|secret|token|api[_-]?key|\.env|data/dumps|実ドメイン|メールアドレス)"` などで公開不可情報が残っていないこと。
- 脆弱性診断メモは `README.md` に公開可能な要約のみを残してください。
