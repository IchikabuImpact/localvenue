/**
 * @file scripts/setup-phase1.js
 * @description Creates the prediction_roi_daily table for Phase 1.
 */

const mysql = require('mysql2/promise');
const config = require('../config/config.js');

(async () => {
    let conn;
    try {
        conn = await mysql.createConnection(config.mysql);
        console.log('Connected to database.');

        const sql = `
      CREATE TABLE IF NOT EXISTS prediction_roi_daily (
        ymd DATE NOT NULL,
        model_version VARCHAR(32) NOT NULL,
        strategy VARCHAR(32) NOT NULL,
        races INT NOT NULL DEFAULT 0,
        invest_yen INT NOT NULL DEFAULT 0,
        return_yen INT NOT NULL DEFAULT 0,
        roi_percent DECIMAL(7,2) NOT NULL DEFAULT 0.00,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (ymd, model_version, strategy)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;

        await conn.execute(sql);
        console.log('[OK] Created/Verified table: prediction_roi_daily');

    } catch (e) {
        console.error('[ERROR]', e);
        process.exit(1);
    } finally {
        if (conn) await conn.end();
    }
})();
