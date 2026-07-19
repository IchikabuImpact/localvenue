#!/usr/bin/env node
/**
 * test-db.js
 * DB接続と主要テーブルの存在・件数を確認するスモークテスト。
 *
 * Usage:
 *   node tests/test-db.js
 *
 * @copyright © 2026 IchikabuImpact
 * @license Commercial use prohibited without permission.
 */

'use strict';

const mysql  = require('mysql2/promise');
const config = require('../config/config.js');

// 確認するテーブルと最低期待件数
const TABLES = [
  { name: 'calendar',            min: 0 },
  { name: 'race_count_by_date',  min: 0 },
  { name: 'racing_form',         min: 0 },
  { name: 'prediction',          min: 0 },
  { name: 'race_results',        min: 0 },
  { name: 'race_payouts',        min: 0 },
  { name: 'prediction_eval',     min: 0 },
  { name: 'prediction_roi',      min: 0 },
  { name: 'prediction_roi_daily',min: 0 },
  { name: 'prediction_roi_summary', min: 0 },
  { name: 'jockey_ranking',      min: 0 },
  { name: 'sire_ranking',        min: 0 },
  { name: 'venue_master',        min: 1 },  // マスターは必ず1件以上
];

let passed = 0;
let failed = 0;

function ok(label) {
  console.log(`  ✅ ${label}`);
  passed++;
}
function ng(label, reason) {
  console.error(`  ❌ ${label}${reason ? ` — ${reason}` : ''}`);
  failed++;
}

(async () => {
  let conn;
  try {
    // ---- 1. 接続確認 ----
    console.log('\n[1] DB接続確認');
    conn = await mysql.createConnection({
      host:     config.mysql.host || 'localhost',
      user:     config.mysql.user,
      password: config.mysql.password,
      port:     config.mysql.port,
      database: config.mysql.database,
      charset:  'utf8mb4',
    });
    ok(`接続成功 (${config.mysql.host}:${config.mysql.port} / ${config.mysql.database})`);

    // ---- 2. テーブル存在 & 件数確認 ----
    console.log('\n[2] テーブル確認');
    for (const t of TABLES) {
      try {
        const [[row]] = await conn.execute(`SELECT COUNT(*) AS cnt FROM \`${t.name}\``);
        const cnt = row.cnt;
        if (cnt >= t.min) {
          ok(`${t.name.padEnd(22)} ${cnt} 件`);
        } else {
          ng(`${t.name.padEnd(22)} ${cnt} 件`, `期待: ${t.min}件以上`);
        }
      } catch (e) {
        ng(t.name, e.message);
      }
    }

    // ---- 3. 最新データ確認 ----
    console.log('\n[3] 最新データ確認');
    const [[latestPred]] = await conn.execute(
      `SELECT LEFT(CAST(race_id AS CHAR), 8) AS ymd, COUNT(*) AS cnt
         FROM prediction
        GROUP BY ymd
        ORDER BY ymd DESC LIMIT 1`
    );
    if (latestPred) {
      ok(`prediction 最新: ${latestPred.ymd} (${latestPred.cnt}件)`);
    } else {
      ng('prediction', 'データなし');
    }

    const [[latestRoi]] = await conn.execute(
      `SELECT ymd, strategy, roi_percent
         FROM prediction_roi_daily
        ORDER BY ymd DESC, strategy LIMIT 1`
    );
    if (latestRoi) {
      // ymd は Date オブジェクトで返る場合があるため文字列化
      const ymdStr = latestRoi.ymd instanceof Date
        ? latestRoi.ymd.toISOString().slice(0, 10)
        : String(latestRoi.ymd);
      ok(`prediction_roi_daily 最新: ${ymdStr} ${latestRoi.strategy} ROI=${latestRoi.roi_percent}%`);
    } else {
      ng('prediction_roi_daily', 'データなし');
    }

  } catch (e) {
    ng('DB接続', e.message);
  } finally {
    try { if (conn) await conn.end(); } catch {}
  }

  // ---- 結果サマリー ----
  console.log(`\n${'─'.repeat(40)}`);
  console.log(`結果: ${passed} passed / ${failed} failed`);
  if (failed > 0) process.exit(1);
})();
