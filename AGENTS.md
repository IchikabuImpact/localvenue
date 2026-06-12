# AGENTS.md — localvenue public-safe project context

このファイルは、公開リポジトリに置ける範囲の作業メモです。個人情報、実ドメイン、サーバー名、ユーザー名、絶対パス、パスワード、DBダンプの内容は書かないでください。

## プロジェクト概要

- NAR（日本地方競馬）の開催情報、出馬表、レース結果を取得し、予想・評価・ROI集計を行う Node.js ベースのバッチシステムです。
- 公開面は `public/` 配下に生成される静的HTMLです。
- DB接続情報は `config/config.js` にローカル作成し、リポジトリにはコミットしません。

## 主要ディレクトリ

| パス | 役割 |
| --- | --- |
| `config/` | `config.sample.js` とローカル専用設定ファイル |
| `data/` | スキーマ、シード、初期化スクリプト |
| `docs/` | 公開しても問題ない設計・仕様ドキュメント |
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
