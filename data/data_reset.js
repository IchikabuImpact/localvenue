#!/usr/bin/env node
/**
 * @copyright © 2026 IchikabuImpact
 * @license Commercial use prohibited without permission.
 */

/**
 * data_reset.js
 * Usage: node data/data_reset.js
 *
 * config/config.js を読み込み、
 * schema.sql と seed-master.sql を MySQL に流し込んで初期化する。
 */

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const config = require('../config/config.js');

const BASE = __dirname;
const SCHEMA = path.join(BASE, 'schema.sql');
const SEED = path.join(BASE, 'seed-master.sql');

function readSql(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

(async () => {
  let conn;
  try {
    const schemaSql = readSql(SCHEMA);
    const seedSql = readSql(SEED);

    conn = await mysql.createConnection({
      host: config.mysql.host || 'localhost',
      user: config.mysql.user,
      password: config.mysql.password,
      port: config.mysql.port,
      database: config.mysql.database || 'localkeiba',
      charset: 'utf8mb4',
      multipleStatements: true,
    });

    console.log('[data_reset] apply schema.sql');
    await conn.query(schemaSql);

    console.log('[data_reset] apply seed-master.sql');
    await conn.query(seedSql);

    console.log('[data_reset] done');
  } catch (e) {
    console.error('[data_reset][ERROR]', e && e.message ? e.message : e);
    process.exit(1);
  } finally {
    try { await conn?.end(); } catch { }
  }
})();
