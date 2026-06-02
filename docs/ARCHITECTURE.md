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
| `fetch-*` | 月次手動 | 月1回手動実行 |
| `daily-*-batch.js` | オーケストレーター | 上記をまとめて呼ぶ親スクリプト |

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
                    公開サーバー: 静的HTMLを配信
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
- **役割**: `racing_form` + `jockey_ranking` + `sire_ranking` からスコアリングして予想生成
- **入力**: `racing_form`, `jockey_ranking`, `sire_ranking` テーブル
- **出力**: `prediction`（best horse_number + 全頭スコアのJSON memo）
- **引数**: `YYYYMMDDRRBB`（必須）
- **モデル名**: `yosou-v1`（`MODEL_VERSION` 定数）
- **スコアロジック**:
  - 騎手スコア（jockey_ranking を頭3文字前方一致）
  - 種牡馬スコア（sire_ranking を前方一致）
  - 偶数馬番ボーナス（馬番値そのまま加算）
  - 年齢ボーナス（2歳+40, 3歳+30, 4歳+20）

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
- **注意**: NAR の baba_code → 楽天の8桁場コードへの変換テーブルを内部に持つ

#### `102-eval-prediction.js`
- **役割**: `prediction.memo.best.horse_number` を `race_payouts` と照合して的中判定・払戻計算
- **入力**: `prediction`, `race_payouts`
- **出力**: `prediction_eval`（的中フラグ・払戻額）, `prediction_roi`（strategy別ROI）
- **引数**: `YYYYMMDDRRBB [--stake-win 100] [--stake-place 100]`
- **重要な exit code**:
  - `0` = 正常
  - `2` = 予想データなし
  - `3` = 結果データなし

#### `103-eval-roi.js`
- **役割**: `prediction_roi` を集計して ROI（回収率）を計算・更新
- **入力**: `prediction`, `race_payouts`
- **出力**: `prediction_roi`（strategy 別: `single` / `place`）
- **引数**: `--from YYYY-MM-DD --to YYYY-MM-DD [--model] [--stake] [--mode] [--threshold]`
- **注意**: ソフトパワー正規化（疑似ソフトマックス）でベット比率を計算

#### `104-aggregate-roi-daily.js`
- **役割**: `prediction_roi` を日次で集計して `prediction_roi_daily` を更新
- **入力**: `prediction_roi` テーブル
- **出力**: `prediction_roi_daily`（ymd, strategy, roi_percent）
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
- **サイト名**: `けんちゃん馬券☆WEB（地方競馬）`

---

### オーケストレーター

#### `daily-yosou-batch.js`
- **役割**: 朝バッチ（001→002→003→[004+005]）を順番に実行する親スクリプト
- **並列度**: `PARALLEL` 環境変数（デフォルト2）
- **引数**: `YYYYMMDD`（省略=今日）

#### `daily-result-batch.js`
- **役割**: 夜バッチ（003→[101+102]→103→104→generate）を実行する親スクリプト
- **exit code の扱い**: 101が2→skip、102が2/3→skip（その他は例外）
- **賭け金**: `STAKE_WIN` / `STAKE_PLACE` 環境変数で上書き可（デフォルト各100円）
- **引数**: `YYYYMMDD`（省略=今日）

---

### 月次手動系

#### `fetch-jockey-ranking.js` / `fetch-sire-ranking.js`
- **役割**: jbis.or.jp から騎手・種牡馬ランキングを取得して DB 保存
- **出力**: `jockey_ranking`, `sire_ranking` テーブル
- **実行**: バッチから除外済み → 月1回手動
  ```bash
  bash scripts/ops/monthly-fetch-jockey-ranking.sh
  bash scripts/ops/monthly-fetch-sire-ranking.sh
  ```

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
`101-save-result-db.js` 内の `RAKUTEN_BABA_CODE` ハッシュで NAR 2桁 → 楽天8桁に変換。
会場の新設・廃止で複数コードを持つ場合がある（配列で候補を列挙し順番に試行）。

### public/ を git 管理する理由
公開サーバーのメモリ節約のため、静的 HTML を生成物として配信できる構成。
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
```
`daily-result-batch.js` は exit 2/3 を `skip` として処理し、バッチ全体を止めない。

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
  htmlRetentionDays: 30
};
```

---

## 9. テストの実行

```bash
node tests/test-db.js    # DB接続 + 全テーブル存在 + 最新データ確認
node tests/test-http.js  # 外部5エンドポイントへの疎通確認
```

---

*最終更新: 2026-05-24 by Claude Sonnet 4.6*
