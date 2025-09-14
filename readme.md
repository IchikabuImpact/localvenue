# LocalVenue — 地方競馬（サラ系）予想用・開催情報スクレイパ＆API

NAR（月間開催情報）をスクレイピングして MySQL に保存し、\
指定日（または**本日〈Asia/Tokyo〉**）の開催会場コードを返す REST API（`/api-venue`）を提供します。

---

## ✅ 動作要件

- **Node.js 20+**（開発環境は v22 系）  
- **MySQL 8+**
- **Google Chrome**（Selenium が自動でドライバを解決します）
- Windows PowerShell（FW 設定・スケジューラ用）

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
    host: 'localhost',      // ← 必須
    user: 'youruser',
    password: 'yourpass',
    database: 'localkeiba'
  }
};
```

---

## 🗄️ MySQL 準備

### データベースとユーザー
```sql
CREATE DATABASE localkeiba CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
CREATE USER 'localkeiba'@'localhost' IDENTIFIED BY '強いパスワード';
GRANT ALL PRIVILEGES ON localkeiba.* TO 'localkeiba'@'localhost';
```

### テーブル（必要最低限のスキーマ）
```sql
CREATE TABLE IF NOT EXISTS calendar (
  race_date DATE NOT NULL,
  venucode  INT  NOT NULL,
  venue     VARCHAR(255),
  PRIMARY KEY (race_date, venucode)
);
CREATE INDEX idx_calendar_race_date ON calendar(race_date);
```
> 既に `localkeiba.sql` がある場合は、そちらを `SOURCE localkeiba.sql;` で読み込んで OK。

---

## 🧹 依存関係（package.json）

プロジェクトの `package.json` 例：
```json
{
  "name": "localvenue",
  "version": "0.1.0",
  "private": true,
  "type": "commonjs",
  "description": "LocalVenue: NAR monthly scraper + simple REST API (/api-venue)",
  "main": "api-todays-venue.js",
  "engines": { "node": ">=20.0.0" },
  "scripts": {
    "start": "node api-todays-venue.js",
    "api:start": "node api-todays-venue.js",
    "api:pm2": "pm2 start api-todays-venue.js --name localvenue-api",
    "api:reload": "pm2 reload localvenue-api",
    "api:stop": "pm2 stop localvenue-api && pm2 delete localvenue-api",
    "api:logs": "pm2 logs localvenue-api --lines 50",
    "pm2:save": "pm2 save",
    "pm2:resurrect": "pm2 resurrect",
    "scrape:month": "node Kaisai-info.js"
  },
  "dependencies": {
    "axios": "^1.10.0",
    "cheerio": "^1.1.0",
    "express": "^5.1.0",
    "jsdoc": "^4.0.4",
    "moment": "^2.30.1",
    "moment-timezone": "^0.5.45",
    "mysql2": "^3.14.5",
    "node-html-parser": "^7.0.1",
    "nth-check": "^2.1.1",
    "puppeteer": "^24.12.1",
    "redis": "^5.6.0",
    "selenium-webdriver": "^4.34.0"
  }
}
```

---

## 🧭 スクレイパ（NAR 月間開催の取得 → DB 保存）

```bash
# 今月
node Kaisai-info.js

# 2025年9月
node Kaisai-info.js 2025 09

# 6桁 YYYYMM
node Kaisai-info.js 202509
```

- 指定月の月間開催ページから **開催シンボル（●/Ｄ/☆）** を検出し、
  `calendar(race_date, venucode, venue)` に **UPSERT** します。
- `venucode` の例：盛岡=10 / 水沢=11 / 浦和=18 / 船橋=19 / 大井=20 / 川崎=21 / 金沢=22 / 笠松=23 / 名古屋=24 / 園田=27 / 姫路=28 / 高知=31 / 佐賀=32 / 門別=36

> 中止対応は**別プロセス**での運用を想定。将来的には「中止ワード検知→DELETE→再UPSERT」の疎結合ジョブを追加してください。

---

## 🌐 REST API（/api-venue）

サーバ起動：
```bash
node api-todays-venue.js
# PM2運用なら: pm2 start api-todays-venue.js --name localvenue-api
```

### エンドポイント
- `GET /healthz` … ヘルスチェック
- `GET /api-venue` … **本日（Asia/Tokyo）の開催**一覧
- `GET /api-venue/:date` … 指定日の開催（`YYYY-MM-DD`）

例：
```
GET http://localhost:3000/api-venue/2025-09-14
→ 200 OK
{
  "date":"2025-09-14",
  "count":3,
  "venues":[
    {"venucode":22,"venue":"金沢"},
    {"venucode":31,"venue":"高知"},
    {"venucode":32,"venue":"佐賀"}
  ]
}
```

> 既定では **0.0.0.0:3000** で待受（LAN から到達可）。ローカル専用にしたい場合は `app.listen(PORT, '127.0.0.1')` に変更。

---

## 🔥 Windows Firewall（PowerShell/管理者）

**LAN のみ許可（推奨）**
```powershell
New-NetFirewallRule -DisplayName "LocalVenue API 3000 TCP (LocalSubnet)" `
  -Direction Inbound -Action Allow -Protocol TCP -LocalPort 3000 `
  -RemoteAddress LocalSubnet
```

**すべて許可（検証のみ）**
```powershell
New-NetFirewallRule -DisplayName "LocalVenue API 3000 TCP (Any)" `
  -Direction Inbound -Action Allow -Protocol TCP -LocalPort 3000
```

**確認 / 削除**
```powershell
Get-NetFirewallRule -DisplayName "*LocalVenue*"
Remove-NetFirewallRule -DisplayName "LocalVenue API 3000 TCP (Any)"
```

---

## ♻️ 常駐運用（PM2 + タスクスケジューラで自動復元）

### PM2（プロセス管理）
```powershell
npm i -g pm2
pm2 start api-todays-venue.js --name localvenue-api
pm2 status
pm2 logs localvenue-api --lines 50
pm2 reload localvenue-api
pm2 save --force
```

### Windows 起動時に自動復元（タスクスケジューラ）
```powershell
# 管理者 PowerShell で実行
$node   = (Get-Command node).Source
$pm2bin = Join-Path $env:APPDATA "npm\node_modules\pm2\bin\pm2"

pm2 save --force
Unregister-ScheduledTask -TaskName "PM2 Resurrect" -Confirm:$false -ErrorAction SilentlyContinue
$action    = New-ScheduledTaskAction -Execute $node -Argument "`"$pm2bin`" resurrect"
$trigger1  = New-ScheduledTaskTrigger -AtStartup
$trigger2  = New-ScheduledTaskTrigger -AtLogOn
$principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -RunLevel Highest
Register-ScheduledTask -TaskName "PM2 Resurrect" -Action $action -Trigger @($trigger1,$trigger2) -Principal $principal

# 手動テスト
schtasks /run /TN "PM2 Resurrect"
```

---

## 🧪 デバッグ & 動作確認

**API**
```powershell
Invoke-WebRequest http://localhost:3000/healthz | Select -Expand Content
Invoke-WebRequest http://localhost:3000/api-venue | Select -Expand Content
Invoke-WebRequest http://localhost:3000/api-venue/2025-09-14 | Select -Expand Content
```

**MySQL クイック確認**
```sql
-- 2025-09 の件数
SELECT venue, COUNT(*) cnt
FROM calendar
WHERE race_date >= '2025-09-01' AND race_date < '2025-10-01'
GROUP BY venue ORDER BY cnt DESC;

-- 日別の開催一覧
SELECT race_date,
       GROUP_CONCAT(CONCAT(venue,'(',venucode,')') ORDER BY venucode) AS venues
FROM calendar
WHERE race_date BETWEEN '2025-09-01' AND '2025-09-30'
GROUP BY race_date ORDER BY race_date;

-- PK 重複チェック（0件が正常）
SELECT race_date, venucode, COUNT(*) c
FROM calendar
GROUP BY race_date, venucode
HAVING c > 1;
```

**トラブルシュート**
- `ER_NOT_SUPPORTED_AUTH_MODE` → **mysql2** を使用（本プロジェクトは対応済み）。
- `PathError: Unexpected ?`（Express のパス） → ルートを `/api-venue` と `/api-venue/:date` の2本に分割、オプション `?` を使わない。
- 列名 `code` で挿入エラー → テーブルは **`venucode`** 列名。スクリプトは対応済み。

---

## 📝 ライセンス
本リポジトリのコードは私的利用を想定しています。再配布や公開運用時は各サイトの利用規約と法令を遵守してください。
