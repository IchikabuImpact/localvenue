# LocalVenue — 地方競馬（サラ系）開催情報スクレイパ & API

NAR（月間開催情報）をスクレイピングして **MySQL** に保存し、
指定日（または **本日〈Asia/Tokyo〉**）の開催会場コードや出馬表・レース結果を扱う疎結合スクリプト群と REST API を提供します。

---

## ✅ 動作要件
- **Node.js 20+**（開発環境は v22 系）  
- **MySQL 8+**  
- **Google Chrome**（Selenium が自動でドライバを解決）  
- Windows PowerShell / Linux シェル（FW 設定・スケジューラ用）

---

## 📦 セットアップ（初回）
```bash
git clone https://github.com/kenchanbaken/localvenue.git
cd localvenue
npm i
```

### `config.js` を作成
```js
// config.js （コミットしない。代わりに config.sample.js を参照）
module.exports = {
  mysql: {
    host: 'localhost',
    user: 'youruser',
    password: 'yourpass',
    database: 'localkeiba'
  }
};
```

---

## 🚀 Usage — 全体の作り
```bash
node kaisai-info.js 2025 09          # 月間開催カレンダー → calendar へ登録
node api-todays-venue.js & http://localhost:3000/api-venue/2025-09-21  # 指定日/当日の会場コードを返すAPI。
node save-race-count-by-date.js 20250921   # 各会場のレース数を収集し race_count テーブルへ保存します。
node racing-form-to-db.js 202509211131     # 出馬表を DB に保存します (yyyymmdd+race番号+baba)
node guess.js 202509211131                 # 予想して DB に保存します (yyyymmdd+race番号+baba)
node save-race-results.js 202509141131     # レース結果を DB に保存します (yyyymmdd+race番号+baba)
node daily-guess.js 20250921               # デイリーバッチ: 指定日分の開催情報を取得し予想を実行
node daily-save-race-results.js 20250921   # デイリーバッチ: 指定日分のレース結果を処理
node generate-web.js 20250921              # 指定日分のWEBページを生成 (予想・予想結果ページ)
```

---

## 🧩 スクリプト概要
- **kaisai-info.js**: 月間開催スケジュール → `calendar`
- **api-todays-venue.js**: 指定日/当日の会場コードを返す REST API
- **save-race-count-by-date.js**: 会場ごとのレース数を収集 → `race_count`
- **racing-form-to-db.js**: 出馬表を保存
- **guess.js**: 予想を保存
- **save-race-results.js**: レース結果を保存
- **daily-guess.js**: 日次で全レースの予想を実行
- **daily-save-race-results.js**: 日次で全レース結果を保存
- **generate-web.js**: 指定日分の予想・予想結果ページを生成

---

## 🔁 データフロー（ざっくり）
```mermaid
graph TD
  A[kaisai-info.js\n(月間開催スクレイプ)] -->|calendar更新| B[(MySQL)]
  B --> C[api-todays-venue.js\n(REST API)]
  D[save-race-count-by-date.js\n(レース数収集)] --> B
  E[racing-form-to-db.js\n(出馬表保存)] --> B
  F[guess.js\n(予想保存)] --> B
  G[save-race-results.js\n(結果保存)] --> B
  H[daily-guess.js\n(日次予想)] --> B
  I[daily-save-race-results.js\n(日次結果保存)] --> B
  J[generate-web.js\n(Webページ生成)] --> B
```

---

## 🗄️ テーブル例
```sql
CREATE TABLE IF NOT EXISTS calendar (
  race_date DATE NOT NULL,
  venucode  INT  NOT NULL,
  venue     VARCHAR(255),
  PRIMARY KEY (race_date, venucode)
);
CREATE INDEX idx_calendar_race_date ON calendar(race_date);

CREATE TABLE IF NOT EXISTS race_count (
  race_date  DATE NOT NULL,
  venucode   INT  NOT NULL,
  race_total INT  NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (race_date, venucode)
);
```

---

## ⏰ スケジューリング例
- **月初**: `kaisai-info.js` を 6:00 に実行  
- **毎日**: `save-race-count-by-date.js %YYYY%%MM%%DD%` → 6:10 実行  
- **毎日**: `daily-guess.js %YYYY%%MM%%DD%` / `daily-save-race-results.js %YYYY%%MM%%DD%` → 6:20 実行  
- **毎日**: `generate-web.js %YYYY%%MM%%DD%` → 6:30 実行  

---

## 📝 ライセンス
本リポジトリのコードは私的利用を想定しています。再配布や公開運用時は各サイトの利用規約と法令を遵守してください。
