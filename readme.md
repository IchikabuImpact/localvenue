# LocalVenue — 地方競馬（サラ系）開催情報スクレイパ & API

NAR（地方競馬全国協会）の情報を収集・蓄積し、レース予想や結果分析を行うための基盤システムです。
設計思想として「疎結合」を採用しており、各工程（開催日取得、出馬表取得、予想、結果収集、集計）が独立したスクリプトとして動作します。

---

## 🚀 Cheat Sheet (作業再開用)

久しぶりに作業するときは、まずここを見てください。
基本的な日次運用フローは以下の通りです。

### 1. 予想バッチ (Daily Prediction)
指定日の予想を実行します（開催情報収集、出馬表保存、予想計算を一括実行）。
```bash
# 本日分を実行
node daily-yosou-batch.js

# 指定日を実行 (例: 2025年10月13日)
node daily-yosou-batch.js 20251013
```

### 2. 結果収集 (Daily Result Collection)
⚠ **注意**: 日次一括収集スクリプト (`daily-save-race-results.js`) は現在リポジトリに見当たりません。
単発で収集する場合は以下を使用します。
```bash
# 指定レースの結果収集 (YYYYMMDDRRBB)
node save-result-db.js 202510130101
```

### 3. Webページ生成 (Web Generation)
⚠ **注意**: Web生成スクリプト (`generate-web.js`) は現在リポジトリに見当たりません。
`public/` ディレクトリ配下に PHP ファイル等が存在するため、Webサーバー経由での閲覧を想定している可能性があります。

---

## 🧩 Component Reference (プログラム一覧)

どのスクリプトに何を渡すとどうなるかのリファレンスです。

### 🔮 Prediction Phase (予想フェーズ)

| スクリプト名 | 入力 (引数) | 出力 (DB) | 役割 |
| :--- | :--- | :--- | :--- |
| **`daily-yosou-batch.js`** | `[YYYYMMDD]` (省略時は当日) | (一連のテーブル) | **【メイン】** 以下の収集・予想処理を一括で行うラッパーです。 |
| `kaisai-info.js` | `YYYY MM` | `calendar` | 指定月の開催スケジュールを取得します。 |
| `save-race-count-by-date.js` | `YYYYMMDD` | `race_count` | その日の各会場のレース数を取得します。 |
| `list-race-ids.js` | `YYYYMMDD` | (標準出力) | その日の全レースID (12桁) をリストアップします。 |
| `racing-form-to-db.js` | `YYYYMMDDRRBB` | `race_card` 等 | 指定レースの出馬表を取得・保存します。 |
| `predict-race.js` | `YYYYMMDDRRBB` | `prediction` | モデルを使って予想を作成し、JSON形式で保存します。 |

### 📊 Result & Analysis Phase (結果・集計フェーズ)

| スクリプト名 | 入力 (引数) | 出力 (DB) | 役割 |
| :--- | :--- | :--- | :--- |
| **`save-result-db.js`** | `YYYYMMDDRRBB` | `race_results`<br>`race_payouts` | 楽天競馬から結果と払戻を取得・保存します。 |
| `eval-prediction.js` | `YYYYMMDDRRBB` | `prediction_eval` | 予想と結果を突き合わせ、的中有無を判定して保存します。 |
| `eval-roi.js` | `--from` `--to` 等 | (標準出力)<br>`prediction_roi` | 期間を指定して回収率 (ROI) をシミュレーション・集計します。<br>例: `node eval-roi.js --from 2025-10-01 --to 2025-10-31` |

---

## 🔁 Data Flow (データフロー)

```mermaid
graph TD
    subgraph DailyBatch [Daily Prediction Batch]
        A[kaisai-info.js] -->|Calendar| DB[(MySQL)]
        B[save-race-count] -->|Race Counts| DB
        C[racing-form-to-db] -->|Race Card| DB
        D[predict-race] -->|Prediction (JSON)| DB
    end

    subgraph ResultFlow [Result Collection]
        E[save-result-db] -->|Race Results/Payouts| DB
    end

    subgraph AnalysisFlow [Analysis]
        D & E --> F[eval-prediction]
        F -->|Hit/Miss| DB
        DB --> G[eval-roi]
        G -->|ROI Stats| Console/DB
    end
```

---

## ⚠️ Missing / Known Issues (確認事項)

以下のスクリプトは旧ドキュメントに記載がありましたが、現在のルートディレクトリに見当たりません。
これらが必要な場合は、バックアップからの復旧や再実装が必要です。

*   `daily-save-race-results.js` (日次で全レース結果を保存するバッチ)
*   `generate-web.js` (静的Webページジェネレータ)
*   `daily-guess.js` (これは `daily-yosou-batch.js` にリネームされた可能性が高いです)

---

## ✅ Prerequisites (動作要件)

*   **Node.js v22.20.0 (LTS)**
*   **MySQL 8+**
*   **Google Chrome** (Selenium用)

### Setup
```bash
git clone https://github.com/kenchanbaken/localvenue.git
cd localvenue
npm i
# config.sample.js を config.js にコピーしてDB設定を記述
cp config.sample.js config.js
```
