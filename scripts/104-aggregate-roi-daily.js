#!/usr/bin/env node
/**
 * @copyright © 2026 IchikabuImpact
 * @license Commercial use prohibited without permission.
 */

/**
 * 104-aggregate-roi-daily.js
 * 
 * prediction_roi テーブルを集計し、prediction_roi_daily テーブルを更新する。
 * 
 * Usage:
 *   node scripts/104-aggregate-roi-daily.js [YYYYMMDD]
 *   (省略時はJSTの今日)
 */

const mysql = require('mysql2/promise');
const config = require('../config/config.js');

// JST今日
const jstTodayYmd = () => {
    const jst = new Date(Date.now() + 9 * 3600 * 1000); // UTC+9
    const y = jst.getUTCFullYear();
    const m = String(jst.getUTCMonth() + 1).padStart(2, '0');
    const d = String(jst.getUTCDate()).padStart(2, '0');
    return `${y}${m}${d}`;
};

const targetYmd = process.argv[2] || jstTodayYmd();
if (!/^\d{8}$/.test(targetYmd)) {
    console.error('Usage: node 104-aggregate-roi-daily.js [YYYYMMDD]');
    process.exit(1);
}

// YYYYMMDD -> YYYY-MM-DD
const isoDate = `${targetYmd.slice(0, 4)}-${targetYmd.slice(4, 6)}-${targetYmd.slice(6, 8)}`;

(async () => {
    let conn;
    try {
        conn = await mysql.createConnection(config.mysql);

        console.log(`[info] Aggregating ROI for ${isoDate} (race_id prefix: ${targetYmd})...`);

        // 1. 集計
        // prediction_roi から対象日のデータを集計
        const [rows] = await conn.execute(`
      SELECT
        LEFT(race_id, 8) as ymd_str,
        model_version,
        strategy,
        COUNT(*) AS races,
        COALESCE(SUM(stake), 0) AS invest_yen,
        COALESCE(SUM(returned), 0) AS return_yen,
        ROUND((SUM(returned) / NULLIF(SUM(stake), 0)) * 100, 2) AS roi_percent
      FROM prediction_roi
      WHERE LEFT(race_id, 8) = ?
        AND strategy IN ('single', 'place')
      GROUP BY ymd_str, model_version, strategy
    `, [targetYmd]);

        if (rows.length === 0) {
            console.warn(`[WARN] No ROI data found in prediction_roi for date ${targetYmd}`);
        }

        // 2. UPSERT
        // 各行を prediction_roi_daily に反映
        for (const r of rows) {
            const roi = r.roi_percent === null ? 0.00 : r.roi_percent; // stake=0 の場合などNULLになるケア

            await conn.execute(`
        INSERT INTO prediction_roi_daily
          (ymd, model_version, strategy, races, invest_yen, return_yen, roi_percent)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          races = VALUES(races),
          invest_yen = VALUES(invest_yen),
          return_yen = VALUES(return_yen),
          roi_percent = VALUES(roi_percent),
          updated_at = CURRENT_TIMESTAMP
      `, [isoDate, r.model_version, r.strategy, r.races, r.invest_yen, r.return_yen, roi]);
        }

        // 3. データ確認 & ログ出力
        const [dailyRows] = await conn.execute(`
      SELECT * FROM prediction_roi_daily
      WHERE ymd = ?
      ORDER BY model_version, strategy
    `, [isoDate]);

        console.log(`--- Daily ROI Setup Report for ${isoDate} ---`);
        if (dailyRows.length === 0) {
            console.log('No data in prediction_roi_daily (Result not ready?)');
        } else {
            // モデルごとにチェック
            const models = [...new Set(dailyRows.map(d => d.model_version))];
            for (const ver of models) {
                const entry = dailyRows.filter(d => d.model_version === ver);
                const hasSingle = entry.some(d => d.strategy === 'single');
                const hasPlace = entry.some(d => d.strategy === 'place');

                console.log(`[Model: ${ver}]`);
                entry.forEach(d => {
                    console.log(`  - ${d.strategy.padEnd(6)}: ${d.races} races, invest ${d.invest_yen}, return ${d.return_yen}, ROI ${d.roi_percent}%`);
                });

                if (!hasSingle) console.warn(`  [WARN] Missing 'single' strategy for ${ver}`);
                if (!hasPlace) console.warn(`  [WARN] Missing 'place' strategy for ${ver}`);
            }
        }
        console.log('[OK] Aggregation completed.');

    } catch (e) {
        console.error('[ERROR]', e);
        process.exit(1);
    } finally {
        if (conn) await conn.end();
    }
})();
