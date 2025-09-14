
/**
 * LocalVenue API - /api-venue
 * 機能: 指定日(YYYY-MM-DD) または 本日(Asia/Tokyo) の地方競馬開催会場コード(venucode, venue)を返す。
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * 0) 事前準備（依存パッケージ）
 *    npm i express mysql2 moment-timezone
 *
 * 1) 起動 / 停止 / 確認
 *    node api-todays-venue.js
 *    Ctrl+C で停止（安全に HTTP → MySQL の順にクローズ）
 *    健康チェック:  http://localhost:3000/healthz
 *    API（今日）:   http://localhost:3000/api-venue
 *    API（日付）:   http://localhost:3000/api-venue/2025-09-14
 *
 * 2) Windows ファイアウォール（PowerShell を管理者で）
 *    # LAN だけ許可（推奨）
 *    New-NetFirewallRule -DisplayName "LocalVenue API 3000 TCP (LocalSubnet)" `
 *      -Direction Inbound -Action Allow -Protocol TCP -LocalPort 3000 `
 *      -RemoteAddress LocalSubnet
 *
 *    # すべて許可（検証用途のみ）
 *    New-NetFirewallRule -DisplayName "LocalVenue API 3000 TCP (Any)" `
 *      -Direction Inbound -Action Allow -Protocol TCP -LocalPort 3000
 *
 *    # 確認 / 削除
 *    Get-NetFirewallRule -DisplayName "*LocalVenue*"
 *    Remove-NetFirewallRule -DisplayName "LocalVenue API 3000 TCP (Any)"
 *
 * 3) PM2 で常駐運用（推奨）
 *    npm i -g pm2
 *    pm2 start api-todays-venue.js --name localvenue-api
 *    pm2 status
 *    pm2 logs localvenue-api --lines 50
 *    pm2 reload localvenue-api    # ゼロダウン更新
 *    pm2 save                     # 構成を保存（復元用）
 *
 * 4) Windows 起動時に自動復元（タスク スケジューラ; 管理者 PowerShell）
 *    $node   = (Get-Command node).Source
 *    $pm2bin = Join-Path $env:APPDATA "npm\node_modules\pm2\bin\pm2"
 *    pm2 save
 *    Unregister-ScheduledTask -TaskName "PM2 Resurrect" -Confirm:$false -ErrorAction SilentlyContinue
 *    $action    = New-ScheduledTaskAction -Execute $node -Argument "`"$pm2bin`" resurrect"
 *    $trigger1  = New-ScheduledTaskTrigger -AtStartup
 *    $trigger2  = New-ScheduledTaskTrigger -AtLogOn
 *    $principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -RunLevel Highest
 *    Register-ScheduledTask -TaskName "PM2 Resurrect" -Action $action -Trigger @($trigger1,$trigger2) -Principal $principal
 *    # 手動実行テスト:
 *    schtasks /run /TN "PM2 Resurrect"
 *
 * 5) MySQL（前提）
 *    - テーブル: calendar (race_date DATE NOT NULL, venucode INT NOT NULL, venue VARCHAR(255), PRIMARY KEY (race_date, venucode))
 *    - 認証: MySQL 8 の caching_sha2_password に対応するため、Node は mysql2 を使用（本ファイルは mysql2/promise）
 *
 * 6) ネットワーク注意
 *    - 既定で 0.0.0.0:3000 で待受（LANからアクセス可）。ローカル専用なら app.listen(PORT, '127.0.0.1') に変更。
 *
 * 7) レスポンス例
 *    GET /api-venue/2025-09-14 →
 *    {
 *      "date": "2025-09-14",
 *      "count": 3,
 *      "venues": [
 *        {"venucode":22,"venue":"金沢"},
 *        {"venucode":31,"venue":"高知"},
 *        {"venucode":32,"venue":"佐賀"}
 *      ]
 *    }
 * ─────────────────────────────────────────────────────────────────────────────
 */
const express = require('express');
const mysql = require('mysql2/promise');   // ← ここを mysql2 に
const moment = require('moment');
const app = express();
const config = require('./config.js');

// MySQLプール
 const pool = mysql.createPool({
   host: config.mysql.host,
   user: config.mysql.user,
   password: config.mysql.password,
   database: config.mysql.database,
   waitForConnections: true,
   connectionLimit: 8,
 });

// MySQL接続確認
// 起動時に疎通チェック（プール経由）
(async () => {
  try {
    await pool.query('SELECT 1');
    console.log('Connected to MySQL');
  } catch (error) {
    console.error('MySQL connection error:', error);
    process.exit(1);
  }
})();

// ヘルスチェック
app.get('/healthz', (_req, res) => res.json({ ok: true }));

// 今日
app.get('/api-venue', async (_req, res) => {
  try {
    const d = moment().tz('Asia/Tokyo').format('YYYY-MM-DD');
    const [rows] = await pool.execute(
      'SELECT venucode, venue FROM calendar WHERE race_date = ? ORDER BY venucode',
      [d]
    );
    res.json({ date: d, count: rows.length, venues: rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Database error' });
  }
});

// 日付指定（YYYY-MM-DD）
app.get('/api-venue/:date', async (req, res) => {
  const dateStr = req.params.date;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
  }
  const target = moment(dateStr, 'YYYY-MM-DD', true);
  if (!target.isValid()) {
    return res.status(400).json({ error: 'Invalid date value. Use YYYY-MM-DD.' });
  }
  try {
    const d = target.format('YYYY-MM-DD');
    const [rows] = await pool.execute(
      'SELECT venucode, venue FROM calendar WHERE race_date = ? ORDER BY venucode',
      [d]
    );
    res.json({ date: d, count: rows.length, venues: rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Database error' });
  }
});



// 起動（ローカルだけにしたいなら '127.0.0.1' を第2引数で指定）
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// きれいに終了
function shutdown(sig) {
  console.log(`Received ${sig}. Closing server...`);
  server.close(async () => {
    console.log('HTTP server closed');
    try { await pool.end(); } catch {}
    process.exit(0);
  });
}
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
