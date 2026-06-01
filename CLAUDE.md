# CLAUDE.md — けんちゃん馬券☆WEB（地方競馬）

> Claude Code がセッション開始時に自動読み込みするプロジェクトコンテキスト。
> 新しいセッションでもここを読めば即座に作業を再開できる。

---

## プロジェクト概要

**けんちゃん馬券☆WEB（地方競馬）**
- NAR（日本地方競馬）の出馬表・レース結果をスクレイピングし、スコアリングで予想を生成して静的HTMLとして公開するシステム
- ZendFramework1（PHP）からNode.jsへ完全リライト済み（2026年）
- スクレイピングは **axios + cheerio**（SSRサイトのみ対象、Selenium/Chrome は不使用）
- オーナー: **IchikabuImpact** (kenchanbaken@gmail.com)
- リポジトリ: `https://github.com/IchikabuImpact/localvenue.git`（**プライベート**）

---

## 技術スタック

| 要素 | 内容 |
|------|------|
| ランタイム | Node.js v22.x（engines: >=22.20.0） |
| DB | MySQL 8.x、データベース名: `localvenue` |
| スクレイピング | axios + cheerio（SSRのみ） |
| HTMLテンプレート | generate-daily-pages.js（テンプレートリテラル） |
| デプロイ | git push → VPS側で `git pull`（`public/` をgit管理） |
| 開発環境 | WSL2 Ubuntu 24.04 on Windows 11 Pro |
| バッチ実行機 | AK1PLUS（LAN内ミニPC、24時間稼働、モニターなし） |
| 公開サーバー | VPS (Rocky Linux 9.7)、nginx静的配信、Node.js不要 |

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
│   ├── 001-save-monthly-calendar.js          ← 月間開催カレンダー取得→DB（keiba.go.jp）
│   ├── 001-save-monthly-calendar-rakuten.js  ← 月間開催カレンダー取得→DB（楽天競馬版）
│   ├── 002-save-race-count-by-date.js        ← 日別レース数取得→DB
│   ├── 003-list-race-ids.js                  ← 当日race_id一覧を標準出力
│   ├── 004-racing-form-to-db.js              ← 出馬表スクレイピング→DB
│   ├── 005-predict-race.js                   ← スコアリング予想生成→DB（yosou-v1）
│   ├── 101-save-result-db.js                 ← レース結果取得→DB（exit 2=未確定）
│   ├── 102-eval-prediction.js                ← 予想評価→prediction_eval（単勝・複勝）
│   ├── 103-eval-roi.js                       ← ROI集計→prediction_roi
│   ├── 104-aggregate-roi-daily.js            ← 日次ROI集計→prediction_roi_daily
│   ├── daily-yosou-batch.js                  ← 予想バッチ オーケストレーター
│   ├── daily-result-batch.js                 ← 結果バッチ オーケストレーター→HTML生成
│   ├── generate-daily-pages.js               ← 静的HTML生成 + 古いファイル削除
│   ├── fetch-jockey-ranking.js               ← 騎手ランキング取得（JBIS、月次）
│   ├── fetch-sire-ranking.js                 ← 種牡馬ランキング取得（JBIS、月次）
│   ├── fetch-trainer-ranking.js              ← 調教師ランキング取得（JBIS、月次）
│   ├── lib/
│   │   └── jbis-throttle.js                 ← JBIS HTTPレート制御（7〜9秒間隔、external_request_logに記録）
│   ├── dump-db-context.js                    ← DB_CONTEXT.md自動生成
│   ├── server.js                             ← ローカルプレビュー用サーバー
│   └── ops/
│       ├── monthly-fetch-jockey-ranking.sh
│       ├── monthly-fetch-sire-ranking.sh
│       └── gen-schema.sh
├── cron/
│   ├── yosou.sh       ← 予想バッチラッパー（daily-yosou-batch → HTML生成 → autoupdate）
│   ├── result.sh      ← 結果バッチラッパー（daily-result-batch → autoupdate）
│   ├── monthly.sh     ← 月次マスター更新（external_request_logクリーンアップ → 騎手・種牡馬ランキング）
│   └── autoupdate.sh  ← git pull --rebase -X ours → add → commit → push
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
│   ├── spec.md             ← 仕様書（As-Is）
│   └── ARCHITECTURE.md     ← アーキテクチャ概要
├── logs/
│   ├── yosou.log      ← 予想バッチログ（cron/yosou.sh が追記）
│   ├── result.log     ← 結果バッチログ（cron/result.sh が追記）
│   ├── autoupdate.log ← git push ログ
│   └── monthly.log    ← 月次バッチログ
└── public/            ← 静的HTML（git管理・VPSにgit pullで配信）
    ├── index.html
    ├── recovery.html
    ├── contact.html
    ├── terms.html
    ├── privacy-policy.html
    ├── YYYYMMDDRRBB.html   ← 個別レースページ（ルート直置き・最新用）
    ├── daily/
    │   └── YYYYMMDD/       ← 日別アーカイブフォルダ
    └── css/
        └── style.css
```

---

## データベース

### 接続情報（config/config.js）
```javascript
module.exports = {
  mysql: {
    host: 'localhost',
    user: 'localvenue',
    password: '331155',
    database: 'localvenue',
    port: 3306
  },
  htmlRetentionDays: 30
};
```

### 主要テーブル

| テーブル | 用途 |
|---------|------|
| `calendar` | 月間開催スケジュール（race_date, venucode） |
| `race_count_by_date` | 日別・会場別レース数 |
| `racing_form` | 出馬表（race_id + horse_number がPK） |
| `prediction` | 予想結果（model_version, memo JSON に best + items を格納） |
| `race_results` | レース結果（着順・タイム等） |
| `race_payouts` | 払戻金（単勝・複勝・馬連等） |
| `prediction_eval` | 予想評価（単勝・複勝の的中フラグ・払戻額） |
| `prediction_roi` | ROI集計（strategy別: single / place） |
| `prediction_roi_daily` | 日次ROI集計 |
| `jockey_ranking` | 騎手ランキング（jbis.or.jp） |
| `sire_ranking` | 種牡馬ランキング（jbis.or.jp） |
| `venue_master` | 会場マスター（NAR↔楽天競馬コード対応） |
| `baba` | NAR会場マスター（39会場） |
| `external_request_log` | JBIS外部リクエスト監査ログ（monthly.shで月次クリーンアップ） |

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
| keiba.go.jp | カレンダー・出馬表 | SSR、axios+cheerio |
| jbis.or.jp | 騎手・種牡馬ランキング | SSR、7〜9秒スロットル（jbis-throttle.js） |
| keiba.rakuten.co.jp | レース結果・払戻 | SSR |

**重要**: いずれもSSRサイト（JSレンダリング不要）。Selenium/Chrome は完全不使用。

---

## 予想ロジック（005-predict-race.js / モデル: yosou-v1）

スコアリングは以下の要素の合計点：
1. **騎手スコア**: jockey_ranking と頭3文字前方一致で照合
2. **調教師スコア**: trainer_ranking と前方一致
3. **種牡馬スコア**: sire_ranking と前方一致
4. **偶数馬番ボーナス**: 馬番の値をそのまま加算
5. **年齢ボーナス**: 2歳+40 / 3歳+30 / 4歳+20

最高得点1頭を `best`（◎）として選出、全頭スコアを `memo.items` JSON に格納。

---

## 日次バッチの流れ

### 朝バッチ（出馬表＋予想）— yosou.sh
```
cron → daily-yosou-batch.js YYYYMMDD
  [1] 001: 月間開催カレンダー更新
  [2] 002: 当日レース数取得
  [3] 003: race_id一覧取得
  [4] 004+005: 出馬表取得＋予想生成（並列 PARALLEL=2）
↓
generate-daily-pages.js（HTML生成）
↓
autoupdate.sh（git pull --rebase -X ours → commit → push）
```

### 夜バッチ（結果＋HTML再生成）— result.sh
```
cron → daily-result-batch.js YYYYMMDD
  [1] 003: race_id一覧取得
  [2] 101: レース結果保存（exit 2=未確定→skip）
      102: 予想評価（exit 2=予想なし, 3=結果なし→skip）
  [3] 103: ROI集計（--from --to で日付範囲）
  [4] 104: 日次ROI集計
  [5] generate-daily-pages: HTML生成＋古ファイル削除
↓
autoupdate.sh（git pull --rebase -X ours → commit → push）
```

### 月次バッチ — monthly.sh（毎月1日 3:00 自動実行）
```
[0] external_request_log クリーンアップ（当月以前を削除）
[1] fetch-jockey-ranking.js --division=3（地方騎手 top100）
[2] fetch-sire-ranking.js（距離別 800〜2200m、各7〜9秒スロットル）
```

---

## crontab（AK1PLUS）

```cron
CRON_TZ=Asia/Tokyo

# 早朝初回（動作確認 + 出馬表初取得）
55 7 * * * /home/ichikabu/projects/localvenue/cron/yosou.sh
0  8 * * * /home/ichikabu/projects/localvenue/cron/yosou.sh

# 予想バッチ: 10:00〜20:40（20分おき）
# ※ 馬場状態は1レース直前に発表・天候変化にも追従するため20分間隔に短縮（2026-06-01〜）
0,20,40 10-20 * * * /home/ichikabu/projects/localvenue/cron/yosou.sh

# 集計バッチ: 予想バッチの10分後、10:10〜21:00（20分おき）
10,30,50 10-20 * * * /home/ichikabu/projects/localvenue/cron/result.sh
0 21 * * * /home/ichikabu/projects/localvenue/cron/result.sh

# 月次マスターデータ更新（毎月1日 3:00）
0 3 1 * * /home/ichikabu/projects/localvenue/cron/monthly.sh
```

## crontab（VPS: Rocky Linux 9.7 / /var/www/localvenue）

```cron
CRON_TZ=Asia/Tokyo

# git pull: 10:20〜21:00（20分おき、予想バッチの20分後に合わせる）
20,40 10-20 * * * cd /var/www/localvenue && /usr/bin/git pull origin main >> /var/www/localvenue/logs/git-pull.log 2>&1
0     21    * * * cd /var/www/localvenue && /usr/bin/git pull origin main >> /var/www/localvenue/logs/git-pull.log 2>&1
```

---

## VPS デプロイ構成

```
[AK1PLUS（自宅LAN）]              [GitHub]          [VPS（公開サーバー）]
  cron で自動バッチ実行              プライベートリポジトリ   nginx 静的配信
  MySQL（DB）                       ↑ git push          ↓ git pull（cron）
  autoupdate.sh ───────────────→  main ──────────→  public/ 自動更新
  （pull --rebase -X ours → push）

  緊急時: VPS側でも手動バッチ実行→push可能
  ※ VPS push後はAK1PLUSのautoupdate.shが次回 pull --rebase で自動吸収
```

---

## サイト情報

- **公開URL**: https://kenchanbaken.pinkgold.space/
- **H1タイトル**: けんちゃん馬券☆WEB（地方競馬）
- **サブタイトル**: - 恥ずかしい馬券 - 矛盾にあふれる人間の発想とロジカルなAIがぶつかり合ったものです
- **コピーライト**: © けんちゃん馬券☆WEB （地方競馬）2026
- **ナビ**: 一覧 / 回収率 / ご利用規約 / プライバシーポリシー / お問い合わせ

---

## よく使うコマンド

```bash
# スモークテスト
node tests/test-db.js
node tests/test-http.js

# 手動で特定日のバッチを実行
node scripts/daily-yosou-batch.js 20260528
node scripts/daily-result-batch.js 20260528

# 特定レースのみ
node scripts/004-racing-form-to-db.js 202605280131
node scripts/005-predict-race.js 202605280131
node scripts/101-save-result-db.js 202605280131

# HTML再生成
node scripts/generate-daily-pages.js 20260528

# cronシェル直接実行（動作確認）
bash cron/yosou.sh
bash cron/result.sh

# ログ確認
tail -f logs/yosou.log
tail -f logs/result.log
tail -f logs/autoupdate.log

# DBダンプ
mysqldump -u localvenue -p331155 --single-transaction --routines --triggers --no-tablespaces localvenue > data/dumps/localvenue_$(date +%Y%m%d).sql
```

---

## 未完了・今後のタスク

- [x] crontab 設定（AK1PLUS・VPS）← 完了（2026-05-28）
- [x] `daily-result-batch.js` の通しテスト ← 完了（2026-05-28 動作確認済み）
- [x] autoupdate.sh の push 競合対策（git pull --rebase -X ours）← 完了（2026-05-28）
- [ ] 月次ランキング取得の実動確認（fetch-jockey-ranking.js / fetch-sire-ranking.js）
- [ ] **馬複5頭ボックス予想の追加**（次セッション予定）
  - prediction.memo.items 上位5頭で馬複ボックス10点購入
  - 102-eval-prediction.js に馬複的中判定を追加
  - 103/104 の ROI集計に `quinella` strategy を追加
  - generate-daily-pages.js に馬複結果表示を追加

---

## .gitignore のポイント

```
config/config.js       # DB接続情報（要手動作成）
node_modules/
.env
```

> ⚠️ `data/dumps/` はリポジトリに含めています（プライベートリポジトリのため）。
> パブリックに変更する場合は `.gitignore` に追加してください。

---

*最終更新: 2026-05-28 by Claude Sonnet 4.6*
