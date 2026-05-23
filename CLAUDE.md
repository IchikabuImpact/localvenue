# CLAUDE.md — けんちゃん馬券☆WEB（地方競馬）

> Claude Code がセッション開始時に自動読み込みするプロジェクトコンテキスト。
> 新しいセッションでもここを読めば即座に作業を再開できる。

---

## プロジェクト概要

**けんちゃん馬券☆WEB（地方競馬）**
- NAR（日本地方競馬）の出馬表・レース結果をスクレイピングし、AIで予想を生成して静的HTMLとして公開するシステム
- ZendFramework1（PHP）からNode.jsへ完全リライト済み（2026年）
- スクレイピングは **axios + cheerio**（SSRサイトのみ対象、Selenium/Chrome は不使用）
- オーナー: **IchikabuImpact** (kenchanbaken@gmail.com)
- リポジトリ: `https://github.com/IchikabuImpact/localvenue.git`（**プライベート**）

---

## 技術スタック

| 要素 | 内容 |
|------|------|
| ランタイム | Node.js v20.20.2（推奨: >=22） |
| DB | MySQL 8.x、データベース名: `localvenue` |
| スクレイピング | axios + cheerio（SSRのみ） |
| HTMLテンプレート | generate-daily-pages.js（テンプレートリテラル） |
| デプロイ | git push → VPS側で `git pull`（`public/` をgit管理） |
| 開発環境 | WSL2 Ubuntu 24.04 on Windows 11 Pro |
| 本番/バッチ機 | AK1PLUS（LAN内ミニPC、24時間稼働） |

---

## ディレクトリ構成

```
localvenue/
├── CLAUDE.md              ← このファイル
├── README.md              ← 人間向けセットアップガイド
├── create-database.sh     ← MySQL初期構築スクリプト
├── package.json
├── config/
│   ├── config.js          ← 本番設定（gitignore済み・要手動作成）
│   └── config.sample.js   ← テンプレート
├── scripts/
│   ├── 001-save-monthly-calendar.js   ← 月間開催カレンダー取得→DB
│   ├── 002-save-race-count-by-date.js ← 日別レース数取得→DB
│   ├── 003-list-race-ids.js           ← 当日race_id一覧を標準出力
│   ├── 004-racing-form-to-db.js       ← 出馬表スクレイピング→DB
│   ├── 005-predict-race.js            ← AI予想生成→DB
│   ├── 101-save-result-db.js          ← レース結果取得→DB（exit 2=未確定）
│   ├── 102-eval-prediction.js         ← 予想評価→prediction_eval
│   ├── 103-eval-roi.js                ← ROI集計→prediction_roi
│   ├── 104-aggregate-roi-daily.js     ← 日次ROI集計→prediction_roi_daily
│   ├── daily-yosou-batch.js           ← 予想バッチ（朝実行）
│   ├── daily-result-batch.js          ← 結果バッチ（夜実行）→HTML生成→git push
│   ├── generate-daily-pages.js        ← 静的HTML生成 + 古いファイル削除
│   ├── fetch-jockey-ranking.js        ← 騎手ランキング取得（月次手動）
│   ├── fetch-sire-ranking.js          ← 種牡馬ランキング取得（月次手動）
│   └── ops/
│       ├── monthly-fetch-jockey-ranking.sh  ← 月次騎手ランキング手動実行用
│       ├── monthly-fetch-sire-ranking.sh    ← 月次種牡馬ランキング手動実行用
│       └── gen-schema.sh
├── data/
│   ├── schema.sql          ← 全テーブルDDL
│   ├── seed-master.sql     ← venue_master等マスターデータ
│   ├── data_reset.js       ← データリセット用
│   └── dumps/              ← mysqldumpバックアップ（localvenue_YYYYMMDD.sql）
├── tests/
│   ├── test-db.js          ← DB接続・テーブル存在・最新データ確認
│   └── test-http.js        ← 外部HTTP疎通確認（keiba.go.jp / jbis.or.jp / 楽天競馬）
├── docs/
│   ├── VENUE_CODES.md      ← 会場コード対応表（NAR↔楽天競馬）
│   ├── DB_CONTEXT.md       ← DB全テーブルのスキーマ＋データ（自動生成）
│   └── spec.md             ← 仕様書
├── public/                 ← 静的HTML（git管理・VPSにgit pullで配信）
│   ├── index.html          ← トップページ
│   ├── recovery.html       ← 回収率ページ
│   ├── YYYYMMDDRRBB.html   ← 個別レースページ（ルート直置き）
│   ├── daily/
│   │   └── YYYYMMDD/       ← 日別フォルダ（index.html + レースページ）
│   └── css/
│       └── style.css       ← 全ページ共通スタイル
└── lib/                    ← （現在未使用、Selenium時代の名残）
```

---

## データベース

### 接続情報（config/config.js）
```javascript
module.exports = {
  mysql: {
    host: 'localhost',
    user: 'localvenue',
    password: '331155',       // 本番と同じ値
    database: 'localvenue',
    port: 3306
  },
  htmlRetentionDays: 30       // 静的HTMLの保持日数
};
```

### 主要テーブル

| テーブル | 用途 |
|---------|------|
| `calendar` | 月間開催スケジュール（race_date, venucode） |
| `race_count_by_date` | 日別・会場別レース数 |
| `racing_form` | 出馬表（race_id + horse_number がPK） |
| `prediction` | AI予想結果 |
| `race_results` | レース結果（着順・タイム等） |
| `race_payouts` | 払戻金（単勝・複勝・馬連等） |
| `prediction_eval` | 予想評価（的中・回収額） |
| `prediction_roi` | ROI集計（strategy別） |
| `prediction_roi_daily` | 日次ROI集計 |
| `jockey_ranking` | 騎手ランキング（jbis.or.jp） |
| `sire_ranking` | 種牡馬ランキング（jbis.or.jp） |
| `venue_master` | 会場マスター（NAR↔楽天競馬コード対応） |
| `baba` | NAR会場マスター（39会場） |

### race_id フォーマット
```
YYYYMMDDRRBB  (12桁)
  YYYYMMDD: 開催日
  RR: レース番号（2桁、01〜12）
  BB: 会場コード（2桁 NAR baba_code、例: 31=高知）
```

### スクレイピング対象サイト

| サイト | 用途 | 備考 |
|-------|------|------|
| keiba.go.jp | カレンダー・出馬表・結果 | SSR、axios+cheerio |
| jbis.or.jp | 騎手・種牡馬ランキング | SSR、axios+cheerio |
| keiba.rakuten.co.jp | レース結果・払戻 | SSR |

**重要**: いずれもSSRサイト（JSレンダリング不要）。Selenium/Chrome は完全不使用。

---

## 日次バッチの流れ

### 朝バッチ（出馬表＋予想）
```
cron → daily-yosou-batch.js YYYYMMDD
  [1] 001: 月間開催カレンダー更新
  [2] 002: 当日レース数取得
  [3] 003: race_id一覧取得
  [4] 004+005: 出馬表取得＋予想生成（並列PARALLEL=2）
```

### 夜バッチ（結果＋HTML生成＋git push）
```
cron → daily-result-batch.js YYYYMMDD
  [1] 003: race_id一覧取得
  [2] 101: レース結果保存（exit 2=未確定→skip）
  [3] 102: 予想評価（exit 2=予想なし, 3=結果なし→skip）
  [4] 103: ROI集計（--from --to で日付範囲）
  [5] 104: 日次ROI集計
  [6] generate-daily-pages: HTML生成＋古ファイル削除
  ↓
  git add -A && git commit && git push origin main
  ↓
  VPS: git pull（公開反映）
```

### 月次手動（ランキング更新）
```bash
bash scripts/ops/monthly-fetch-jockey-ranking.sh
bash scripts/ops/monthly-fetch-sire-ranking.sh
```

---

## サイト情報

- **H1タイトル**: けんちゃん馬券☆WEB（地方競馬）
- **サブタイトル**: - 恥ずかしい馬券 - 矛盾にあふれる人間の発想とロジカルなAIがぶつかり合ったものです
- **コピーライト**: © けんちゃん馬券☆WEB （地方競馬）2026
- **フッター**: `<p>&copy; けんちゃん馬券☆WEB （地方競馬）2026</p>`

---

## よく使うコマンド

```bash
# スモークテスト
node tests/test-db.js
node tests/test-http.js

# 手動で特定日のバッチを実行
node scripts/daily-yosou-batch.js 20260523
node scripts/daily-result-batch.js 20260523

# 特定レースのみ
node scripts/004-racing-form-to-db.js 202605230131
node scripts/005-predict-race.js 202605230131
node scripts/101-save-result-db.js 202605230131

# HTML再生成
node scripts/generate-daily-pages.js 20260523

# DBダンプ
mysqldump -u localvenue -p331155 --single-transaction --routines --triggers --no-tablespaces localvenue > data/dumps/localvenue_$(date +%Y%m%d).sql
```

---

## VPS デプロイ構成

```
[AK1PLUS（自宅LAN）]          [VPS（公開サーバー）]
  バッチ実行                      nginx
  DB（MySQL）                     public/ ← git pull で更新
  git push origin main  ────→    git pull origin main
```

- `public/` は git 管理（静的HTMLをリポジトリに含める）
- VPS では Node.js・MySQL 不要（nginxだけでOK）
- `config/config.js` は gitignore 済み（DB情報保護）

---

## 環境構築（新マシン）

```bash
# 1. リポジトリ取得
git clone https://github.com/IchikabuImpact/localvenue.git
cd localvenue

# 2. MySQL構築
bash create-database.sh

# 3. 設定ファイル作成
cp config/config.sample.js config/config.js
# config.js を編集: user/password/database を設定

# 4. 依存インストール
npm install

# 5. スキーマ＋マスターデータ投入
mysql -u localvenue -p localvenue < data/schema.sql
mysql -u localvenue -p localvenue < data/seed-master.sql

# 6. 動作確認
node tests/test-db.js
node tests/test-http.js
```

---

## 未完了・今後のタスク

- [ ] **crontab 設定**（AK1PLUS用 .sh ラッパーの作成）
  - 朝バッチ: 例 `0 7 * * * /home/user/localvenue/cron/yosou.sh`
  - 夜バッチ: 例 `30 22 * * * /home/user/localvenue/cron/result.sh`
  - 夜バッチ内に `git add -A && git commit && git push` を含める
- [ ] `daily-result-batch.js` の通しテスト（実データで確認）
- [ ] 月次ランキング取得の実動確認（fetch-jockey-ranking.js / fetch-sire-ranking.js）

---

## .gitignore のポイント

```
config/config.js       # DB接続情報（要手動作成）
node_modules/
data/dumps/            # ダンプはリポジトリ管理外 ← ※現在は含めている
.env
```

> ⚠️ リポジトリはプライベートに設定済みのため `data/dumps/` を含めていますが、
> パブリックに変更する場合は `.gitignore` に追加してください。

---

*最終更新: 2026-05-24 by Claude Sonnet 4.6*
