# ARCHITECTURE.md — システム設計ドキュメント

> このファイルはAI（Claude / Codex 等）が**5分以内**にコードベースを理解するために書かれています。
> コードを読む前にまずここを読んでください。

---

## 1. システムの目的

NAR（日本地方競馬）のレース情報を毎日自動収集し、スコアリングモデルで予想を生成、
静的HTMLとして公開するパイプラインシステムです。

```
外部サイト → スクレイピング → MySQL → 予想生成 → 静的HTML → 公開環境へ反映
```

---

## 2. ファイル命名規則（最重要）

スクリプトの番号はパイプラインの**実行順序**そのものです。

| 番号帯 | フェーズ | タイミング |
|--------|---------|-----------|
| `001〜005` | 朝バッチ（予想生成） | レース当日の朝 |
| `101〜104` | 夜バッチ（結果集計） | レース終了後の夜 |
| `generate-*` | HTML生成 | 夜バッチの最後 |
| `fetch-*` | 月次 | `cron/monthly.sh`（調教師のみ手動） |
| `daily-*-batch.js` | オーケストレーター | 上記をまとめて呼ぶ親スクリプト |

`scripts/*.js` は引数と依存の組み立てだけを行う薄い CLI で、実処理は `scripts/lib/<領域>/` にあります（use case / repository / client / parser に分離）。

| ディレクトリ | 領域 |
|-------------|------|
| `scripts/lib/calendar/`, `race-count/`, `race-id/`, `racing-form/` | 朝バッチの取得処理 |
| `scripts/lib/prediction/` | スコアリング（`scoring.js`）、サテライト、馬別ルール |
| `scripts/lib/result/`, `evaluation/`, `roi/` | 結果取得、評価、ROI集計 |
| `scripts/lib/pagegen/`, `blog/`, `seo/` | HTML生成、ブログ、サイトマップ |
| `scripts/lib/ranking/` | JBISランキング取得 |
| `scripts/lib/batch/`, `shared/`, `db/`, `ops/`, `server/` | バッチ共通処理、日付/CLI、DB、運用チェック、プレビューサーバ |

---

## 3. データフロー全体図

```
【朝バッチ: daily-yosou-batch.js】
                                        ┌─────────────────────┐
keiba.go.jp                             │   calendar テーブル  │
MonthlyConveneInfo ──→ 001 ────────────→│   (月間開催日程)      │
                                        └─────────────────────┘
keiba.go.jp                             ┌─────────────────────┐
RaceList ──────────→ 002 ──────────────→│ race_count_by_date  │
                                        │ (会場別レース数)      │
                                        └──────────┬──────────┘
                                                   │
                         003 ←─────────────────────┘
                          │  race_id一覧を標準出力へ
                          ↓
               [202605230131, 202605230132, ...] ←─────── race_id = YYYYMMDDRRBB
                          │                                (12桁: 日付+レースNo+会場コード)
                    並列実行(PARALLEL=2)
                    ┌─────┴─────┐
                    ↓           ↓
keiba.go.jp       004         004      ┌─────────────────────┐
DebaTable ────────→ │           │ ────→│   racing_form       │
                    ↓           ↓      │   (出馬表)           │
                  005         005      └──────────┬──────────┘
                    │           │                 │ jockey_ranking
                    │           │                 │ sire_ranking
                    └─────┬─────┘                 │ (月次更新)
                          │                       │
                          └──────────────────────→└→┌─────────────────────┐
                                                     │   prediction        │
                                                     │   (予想結果+スコア) │
                                                     └─────────────────────┘

【夜バッチ: daily-result-batch.js】

楽天競馬                                ┌─────────────────────┐
keiba.rakuten.co.jp ──→ 101 ──────────→│   race_results      │
                                        │   race_payouts      │
                                        └──────────┬──────────┘
                                                   │
                         102 ←─────────────────────┤ ← prediction も参照
                          │                        │
                          ↓                        │
                    ┌─────────────────────┐         │
                    │   prediction_eval   │         │
                    │   prediction_roi    │         │
                    └──────────┬──────────┘         │
                               │                   │
                         103 ←─┘                   │
                          │  ROI集計 (日付範囲指定)  │
                          ↓                        │
                    ┌─────────────────────┐         │
                    │   prediction_roi    │         │
                    │   (strategy別ROI)   │         │
                    └──────────┬──────────┘         │
                               │                   │
                         104 ←─┘                   │
                          │  日次集計               │
                          ↓                        │
                    ┌─────────────────────┐         │
                    │ prediction_roi_daily│         │
                    └──────────┬──────────┘         │
                               │                   │
                    generate-daily-pages.js ←───────┘
                               │
                               ↓
                    public/index.html
                    public/recovery.html
                    public/YYYYMMDDRRBB.html  (個別レース)
                    public/daily/YYYYMMDD/    (日別フォルダ)
                               │
                          git push
                               ↓
                    VPS: git pull → 静的HTMLを配信
```

---

## 4. スクリプト一覧（詳細）

### 朝バッチ系

#### `001-save-monthly-calendar.js`
- **役割**: keiba.go.jp から月間開催スケジュールを取得して `calendar` テーブルへ保存
- **入力**: keiba.go.jp `MonthlyConveneInfoTop`（HTML）
- **出力**: `calendar` テーブル（race_date, venucode, venue）
- **引数**: `YYYYMMDD` | `YYYYMM` | `YYYY MM` | 省略=今月
- **呼び出し元**: `daily-yosou-batch.js [1]`
- **フォールバック**: keiba.go.jp が利用できない場合は `001-save-monthly-calendar-rakuten.js`（楽天競馬カレンダー）を使用

#### `002-save-race-count-by-date.js`
- **役割**: 指定日の会場一覧を `calendar` から取り出し、各会場のレース数（最終R番号）を保存
- **入力**: `calendar` テーブル + keiba.go.jp `RaceList`（HTML）
- **出力**: `race_count_by_date`（race_date, venue_code, race_count）
- **引数**: `YYYYMMDD` | 省略=今日 | `YYYYMMDD BB`（会場コード指定も可）
- **呼び出し元**: `daily-yosou-batch.js [2]`

#### `003-list-race-ids.js`
- **役割**: `race_count_by_date` から当日の全 race_id を生成して**標準出力**へ出す
- **入力**: `race_count_by_date` テーブル
- **出力**: stdout に `YYYYMMDDRRBB` を1行1件（バッチのパイプ連携用）
- **引数**: `YYYYMMDD`（必須）
- **呼び出し元**: `daily-yosou-batch.js [3]`, `daily-result-batch.js [1]`

#### `004-racing-form-to-db.js`
- **役割**: keiba.go.jp の出馬表（DebaTable）を axios+cheerio でパースして DB へ保存
- **入力**: keiba.go.jp `DebaTable`（HTML、SSR）
- **出力**: `racing_form`（馬名・騎手・父・母・斤量等）
- **引数**: `YYYYMMDDRRBB`（必須、12桁）
- **HTML構造**: `section.cardTable table tbody tr.tBorder` = 馬1頭の先頭行、以降4行で1ブロック
- **注意**: GET_LOCK/RELEASE_LOCK でデッドロック対策済み

#### `005-predict-race.js`
- **役割**: `racing_form` + ランキング3本 + サテライトファクターからスコアリングして予想生成
- **入力**: `racing_form`, `race_info`, `jockey_ranking`, `trainer_ranking`, `sire_ranking`, `juvenile_sire_ranking`, `horse_win_pattern_rules`, `race_results`, `config/scoring/default.json`
- **出力**: `prediction`（best horse_number + 全頭スコアのJSON memo）
- **引数**: `YYYYMMDDRRBB`（必須）
- **exit code**: `4` = 発走2分前を過ぎたためスキップ（`config.debug: true` なら締め切りを無視して上書き）
- **モデル名**: `yosou-v1`（`MODEL_VERSION` 定数）
- **スコアロジック詳細**: → `docs/PREDICTION_SCORING.md` 参照
- **概要**:
  - コア: 騎手・調教師（クラス乗数あり）・種牡馬（馬場状態別）・カスタム（馬番+年齢）・若駒レース補正
  - 期間限定の血統/斤量ボーナス（設定ファイル）、馬別ルール（DB）、サテライト、会場別サテライト、夏季馬体重補正を加味
  - 全頭スコアを `prediction.memo.items` JSON に格納、最高得点を `best`（◎）に選出

---

### 夜バッチ系

#### `101-save-result-db.js`
- **役割**: 楽天競馬から結果・払戻を取得して DB 保存
- **入力**: keiba.rakuten.co.jp 結果ページ（HTML）
- **出力**: `race_results`, `race_payouts`
- **引数**: `YYYYMMDDRRBB`（必須）
- **重要な exit code**:
  - `0` = 正常保存
  - `2` = 未確定（"確定" 文字列なし）→ `daily-result-batch.js` がスキップ
- **注意**: NAR の baba_code → 楽天の8桁場コードへの変換は `scripts/lib/result/rakuten-race-code.js`

#### `102-eval-prediction.js`
- **役割**: `prediction.memo.best.horse_number` を `race_payouts` と照合して的中判定・払戻計算
- **入力**: `prediction`, `race_payouts`
- **出力**: `prediction_eval`（的中フラグ・払戻額）, `prediction_roi`（strategy: `single` / `place` / `quinella`）
- **馬複**: スコア上位4頭のボックス（6点）。1着・2着が両方含まれれば的中
- **引数**: `YYYYMMDDRRBB [--stake-win 100] [--stake-place 100] [--stake-quinella 100]`
- **重要な exit code**:
  - `0` = 正常
  - `2` = 予想データなし
  - `3` = 結果データなし

#### `103-eval-roi.js`
- **役割**: スコアを正規化した推定確率 × 払戻が閾値以上の馬を買う EV 戦略をシミュレーション
- **入力**: `prediction`, `race_payouts`
- **出力**: `prediction_roi`（strategy: `ev_win` / `ev_place`）
- **引数**: `--from YYYY-MM-DD --to YYYY-MM-DD [--model] [--stake] [--mode] [--threshold] [--use-score-for-place] [--place-temp] [--place-mass]`
- **注意**: `ev_place` は `--use-score-for-place` 指定時か memo に `p_place` がある場合のみ出力。`ev_*` は 104 の集計対象外で、公開ページの回収率には使われない

#### `104-aggregate-roi-daily.js`
- **役割**: `prediction_roi` の `single` / `place` / `quinella` を日次で集計し、直近30日サマリーも更新
- **入力**: `prediction_roi` テーブル
- **出力**: `prediction_roi_daily`（ymd, strategy, roi_percent）, `prediction_roi_summary`（summary_ymd, period_days, strategy）
- **引数**: `YYYYMMDD`（省略=今日）

---

### HTML生成

#### `generate-daily-pages.js`
- **役割**: 当日分の全データを DB から読んで静的 HTML を生成＋古ファイルを削除
- **入力**: `prediction`, `race_results`, `prediction_eval`, `prediction_roi_daily` 等
- **出力**:
  - `public/index.html`（トップ）
  - `public/recovery.html`（回収率）
  - `public/YYYYMMDDRRBB.html`（個別レース）
  - `public/daily/YYYYMMDD/`（日別フォルダ）
- **引数**: `YYYYMMDD`（省略=今日）
- **ファイル削除**: `config.htmlRetentionDays` 日以前のファイルを自動削除
- **ルート直下の更新**: `public/index.html` と `public/recovery.html` は対象日が JST の今日のときだけ上書き（過去日の再集計でトップページが変わらないようにするため）
- **サイトマップ**: `SITE_URL` または `config.siteUrl` があれば `sitemap.xml` も更新
- **サイト名**: `scripts/lib/site-config.js` で定義

---

### オーケストレーター

#### `daily-yosou-batch.js`
- **役割**: 朝バッチ（001→002→003→[004+005]）を順番に実行する親スクリプト
- **並列度**: `PARALLEL` 環境変数（デフォルト2）
- **exit code の扱い**: 005が4→skip。004/005のその他の失敗は警告を出して次のレースへ続行
- **引数**: `YYYYMMDD`（省略=今日）

#### `daily-result-batch.js`
- **役割**: 夜バッチ（003→[101+102]→103→104→generate）を実行する親スクリプト
- **exit code の扱い**: 101が2→skip、102が2/3→skip。101/102のその他の失敗も警告を出して次のレースへ続行（103以降の失敗はバッチ全体を異常終了）
- **賭け金**: `STAKE_WIN` / `STAKE_PLACE` 環境変数で上書き可（デフォルト各100円）
- **引数**: `YYYYMMDD`（省略=今日）

---

### 月次系

#### `fetch-jockey-ranking.js` / `fetch-juvenile-sire-ranking.js` / `fetch-sire-ranking.js` / `fetch-trainer-ranking.js`
- **役割**: jbis.or.jp から各ランキングを取得して DB 保存
- **出力**: `jockey_ranking`, `juvenile_sire_ranking`, `sire_ranking`, `trainer_ranking` テーブル
- **実行**: `cron/monthly.sh` が騎手 → 2歳種牡馬 → 種牡馬（距離10種 × 馬場状態5種）の順に取得
- **調教師**: `monthly.sh` に含まれないため手動
  ```bash
  bash scripts/ops/monthly-fetch-trainer-ranking.sh
  ```

---

### 運用系

#### cron ラッパー（`cron/`）
- `yosou.sh`: 朝バッチ → HTML生成 → ヘルスチェック（異常時は復旧）→ 公開
- `result.sh`: 夜バッチ → ヘルスチェック（異常時は復旧）→ 公開
- `monthly.sh`: `external_request_log` の掃除とランキング取得
- `health-check.sh` / `schema-drift-check.sh`: 単体の監視。異常時は `logs/alerts.log` に記録
- `autoupdate.sh`: 変更を commit / push する。VPS はこれを `git pull` して本番に反映する

#### `scripts/ops/daily-health-check.js`
- **役割**: レース数と予想数・生成HTML数の一致、「予想なし」表示の有無、`horse_win_pattern_rules` の存在を確認
- **exit code**: 異常があれば `1`

#### `scripts/ops/recover-daily.js`
- **役割**: 対象日の全レースの予想を上書きし、HTML生成（`--result` なら夜バッチ）のあとで再度ヘルスチェック
- **引数**: `[--date YYYYMMDD] [--result]`
- **注意**: 締め切りチェックを無効にして上書きするため、発走後のレースの予想も書き換わる

#### `scripts/ops/schema-drift-check.js`
- **役割**: `data/schema.sql` にあって実DBに無いテーブル・カラムを検出

---

### ブログ

#### `generate-blog-pages.js`
- **役割**: `content/blog/*.md` を `public/blog/` の静的HTMLへ変換（手動実行、日次バッチには含まれない）
- **設計**: `docs/BLOG_DESIGN.md`, `docs/BLOG_REQUIREMENTS.md`

---

## 5. DBテーブル依存関係

```
calendar ←─── 001
    │
    └──→ race_count_by_date ←─── 002
                │
                └──→ [race_id生成] ←─── 003 (stdout)
                            │
                            ├──→ racing_form ←─── 004
                            │        │
                            │   jockey_ranking ←─── fetch-jockey-ranking.js
                            │   sire_ranking   ←─── fetch-sire-ranking.js
                            │   juvenile_sire_ranking ←─── fetch-juvenile-sire-ranking.js
                            │   trainer_ranking ←─── fetch-trainer-ranking.js
                            │   race_info, horse_win_pattern_rules
                            │        │
                            └──→ prediction ←─── 005
                                     │
                            race_results  ←─── 101
                            race_payouts  ←─── 101
                                     │
                            prediction_eval ←─── 102
                            prediction_roi  ←─── 102, 103
                                     │
                        prediction_roi_daily ←─── 104
                        prediction_roi_summary ←─── 104
                                     │
                             [静的HTML生成] ←─── generate-daily-pages.js
```

---

## 6. 設計上の重要な決定事項

### Selenium を使わない
keiba.go.jp・jbis.or.jp・楽天競馬はすべて**SSR（サーバーサイドレンダリング）**のため、
curl/axios で取得した HTML をそのまま cheerio でパースできます。
`lib/webdriver.js` は削除済み。`selenium-webdriver` パッケージも削除済み。

### race_id の設計
```
YYYYMMDD RR BB
20260523 01 31  → 202605230131（2026年5月23日 第1レース 高知競馬）
```
- `RR` = 2桁レース番号（01〜12）
- `BB` = NARの baba_code（2桁、例: 31=高知, 36=門別, 20=大井）

### 楽天競馬の場コード変換
`scripts/lib/result/rakuten-race-code.js` の `RAKUTEN_BABA_CODE` で NAR 2桁 → 楽天8桁に変換。
会場の新設・廃止で複数コードを持つ場合がある（配列で候補を列挙し順番に試行）。

### public/ を git 管理する理由
公開サーバーのメモリ節約のため、静的 HTML を生成物として配信できる構成。
バッチ実行環境で生成して push し、VPS は cron の `git pull` で HTML / CSS / JS を更新する。VPS の cron は pull だけで、localvenue のバッチは実行しない。
VPS にはリポジトリ全体を clone しているが、Apache の DocumentRoot は `public/` なので、公開されるのは `public/` だけ。
公開先のホスト名・ユーザー名・絶対パスなど、環境固有の運用情報は公開ドキュメントに含めない。

### htmlRetentionDays
`config.htmlRetentionDays`（デフォルト30日）で静的HTMLの保持期間を制御。
`generate-daily-pages.js` 実行時に自動削除される（`purgeOldFiles()` 関数）。

### exit code 規約
```
0  = 正常
1  = 異常終了（例外・接続エラー等）
2  = スキップ可能な状態（101: 未確定, 102: 予想なし）
3  = スキップ可能な状態（102: 結果なし）
4  = スキップ可能な状態（005: 締め切り済み）
```
`daily-result-batch.js` は exit 2/3、`daily-yosou-batch.js` は exit 4 を `skip` として処理する。レース単位の処理はそれ以外の失敗でも警告のみで続行する。

---

## 7. 外部依存サイトと取得方法

| サイト | URL パターン | 取得内容 | 注意 |
|--------|------------|---------|------|
| keiba.go.jp | `MonthlyConveneInfoTop` | 月間開催 | SSR |
| keiba.go.jp | `RaceList?k_raceDate=&k_babaCode=` | レース一覧 | SSR |
| keiba.go.jp | `DebaTable?k_raceDate=&k_raceNo=&k_babaCode=` | 出馬表 | SSR |
| jbis.or.jp | `/ranking/result/?ranking=8...` | 騎手ランキング | SSR、パラメータ多数 |
| jbis.or.jp | `/ranking/result/?ranking=7...` | 種牡馬ランキング | SSR |
| keiba.rakuten.co.jp | `/RaceResult/...` | レース結果・払戻 | SSR |

---

## 8. 設定ファイル

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
  debug: false,                                    // true: 締め切りを無視して予想を上書き（開発用）
  scoringConfigPath: 'config/scoring/default.json', // スコアリング補正設定
  siteUrl: 'https://example.com',                  // sitemap.xml / RSS 用の公開URL
  htmlRetentionDays: 30
};
```

---

## 9. テストの実行

```bash
npm test                 # 単体テスト（tests/unit/、DB・外部サイトへの接続は不要）
node tests/test-db.js    # DB接続 + 全テーブル存在 + 最新データ確認
node tests/test-http.js  # 外部5エンドポイントへの疎通確認
```

---

*最終更新: 2026-11-03*
