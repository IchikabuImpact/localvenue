#!/usr/bin/env node

/**
 * list-race-ids.js
 *
 * Usage:
 *   node list-race-ids.js 20251116
 *
 * race_count_by_date から対象日の RACE_ID 一覧を生成し、
 * 1行1レコードで標準出力へ出す。
 * daily-yosou-batch.js はこの標準出力を配列化して利用する。
 */

const mysql = require("mysql2/promise");

(async () => {
  const ymd = process.argv[2];

  if (!/^\d{8}$/.test(ymd || "")) {
    console.error("Usage: node list-race-ids.js YYYYMMDD");
    process.exit(1);
  }

  const config = require("./config.js");
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
    console.error("[fatal] list-race-ids:", e.message || e);
    process.exit(1);
  } finally {
    if (conn) {
      try { await conn.end(); } catch {}
    }
  }
})();
