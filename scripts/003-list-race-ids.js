#!/usr/bin/env node
/**
 * @file    003-list-race-ids.js
 * @pipeline [3/5 朝バッチ / 夜バッチ共通] race_id 一覧を標準出力へ出力
 * @role    `race_count_by_date` から指定日の全 race_id を生成し、
 *          1行1件で stdout へ出す。バッチ間のパイプ連携専用スクリプト。
 *          race_id = YYYYMMDD(8) + RR(2桁レースNo) + BB(2桁NARコード) = 12桁
 *
 * @input   DB: race_count_by_date
 * @output  stdout: YYYYMMDDRRBB を1行1件（ファイルへの書き込みなし）
 * @calledby daily-yosou-batch.js [3] / daily-result-batch.js [1]
 *
 * Usage:
 *   node 003-list-race-ids.js YYYYMMDD
 *
 * @copyright © 2026 IchikabuImpact
 * @license Commercial use prohibited without permission.
 */

const mysql = require("mysql2/promise");

(async () => {
  const ymd = process.argv[2];

  if (!/^\d{8}$/.test(ymd || "")) {
    console.error("Usage: node 003-list-race-ids.js YYYYMMDD");
    process.exit(1);
  }

  const config = require("../config/config.js");
  let conn;

  try {
    conn = await mysql.createConnection({
      host: config.mysql.host,
      user: config.mysql.user,
      password: config.mysql.password,
      database: config.mysql.database,
      port: config.mysql.port,
    });

    // race_count_by_date から対象日の会場別レース数を取得
    const [rows] = await conn.execute(
      `
      SELECT venue_code, total_races
      FROM race_count_by_date
      WHERE ymd = ?
      ORDER BY venue_code
      `,
      [ymd]
    );

    if (rows.length === 0) {
      console.error(`(warn) race_count_by_date に ${ymd} のデータがありません。`);
      // ここで終了しても daily-yosou-batch 側は「0件」で止まるので問題なし
      return;
    }

    // race_id 生成: YYYYMMDD + RR(2桁) + venue_code(2桁)
    for (const row of rows) {
      const vc = String(row.venue_code).padStart(2, "0");
      const maxR = Number(row.total_races) || 0;
      for (let rr = 1; rr <= maxR; rr++) {
        const rr2 = String(rr).padStart(2, "0");
        const raceId = `${ymd}${rr2}${vc}`;
        console.log(raceId);
      }
    }
  } catch (e) {
    console.error("[fatal] 003-list-race-ids:", e.message || e);
    process.exit(1);
  } finally {
    if (conn) {
      try { await conn.end(); } catch { }
    }
  }
})();
