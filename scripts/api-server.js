#!/usr/bin/env node
/**
 * api-server.js
 * LAN内から curl で呼び出す出馬表API。出馬表を、小さいローカルモデルが読みやすい日本語の文章にして返す。
 *
 * Usage:
 *   node scripts/api-server.js
 *   curl "http://<このPC>:8132/racecard?date=20261108&baba=32&race=11"
 *
 * 設定は config/api.config.js（git管理外。見本は config/api.config.sample.js）。
 * 予想・結果のバッチとは別のDB（開発用DB）を読むことで、本番DBに負荷をかけない。
 *
 * @copyright © 2026 IchikabuImpact
 * @license Commercial use prohibited without permission.
 */

'use strict';

const path = require('path');
const mysql = require('mysql2/promise');
const { createApiApp } = require('./lib/api/api-app');
const { RacecardRepository } = require('./lib/api/racecard-repository');

const CONFIG_PATH = path.join(__dirname, '../config/api.config.js');

function loadApiConfig() {
  let cfg;
  try {
    cfg = require(CONFIG_PATH);
  } catch (e) {
    throw new Error(`${CONFIG_PATH} を読めません。config/api.config.sample.js をコピーして作ってください（${e.message}）`);
  }
  if (!cfg.mysql || !cfg.mysql.database) throw new Error('config/api.config.js に mysql.database がありません');
  return { host: cfg.host || '0.0.0.0', port: Number(cfg.port) || 8132, mysql: cfg.mysql };
}

function main() {
  const cfg = loadApiConfig();
  const pool = mysql.createPool({ ...cfg.mysql, charset: 'UTF8MB4_UNICODE_CI', connectionLimit: 4, waitForConnections: true });
  const app = createApiApp({ repository: new RacecardRepository({ pool }) });
  const server = app.listen(cfg.port, cfg.host, () => {
    console.log(`[api] listening on http://${cfg.host}:${cfg.port} (db=${cfg.mysql.database})`);
  });
  const stop = () => server.close(() => pool.end().finally(() => process.exit(0)));
  process.on('SIGTERM', stop);
  process.on('SIGINT', stop);
}

if (require.main === module) {
  try {
    main();
  } catch (e) {
    console.error('[FATAL]', e.message || e);
    process.exit(1);
  }
}

module.exports = { loadApiConfig };
