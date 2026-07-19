'use strict';

const mysql = require('mysql2/promise');

function predictionRoiDailyTableSql() {
  return `
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
}

function predictionRoiSummaryTableSql() {
  return `
      CREATE TABLE IF NOT EXISTS prediction_roi_summary (
        summary_ymd DATE NOT NULL,
        period_days INT NOT NULL,
        model_version VARCHAR(32) NOT NULL,
        strategy VARCHAR(32) NOT NULL,
        races INT NOT NULL DEFAULT 0,
        invest_yen INT NOT NULL DEFAULT 0,
        return_yen INT NOT NULL DEFAULT 0,
        roi_percent DECIMAL(7,2) NOT NULL DEFAULT 0.00,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (summary_ymd, period_days, model_version, strategy),
        KEY idx_prediction_roi_summary_latest (period_days, summary_ymd)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
}

function getAppConfig() {
  return require('../../../config/config.js');
}

async function setupPhase1({ mysqlClient = mysql, mysqlConfig = getAppConfig().mysql, logger = console } = {}) {
  const conn = await mysqlClient.createConnection(mysqlConfig);
  try {
    logger.log('Connected to database.');
    await conn.execute(predictionRoiDailyTableSql());
    logger.log('[OK] Created/Verified table: prediction_roi_daily');
    await conn.execute(predictionRoiSummaryTableSql());
    logger.log('[OK] Created/Verified table: prediction_roi_summary');
  } finally {
    await conn.end();
  }
}

module.exports = {
  predictionRoiDailyTableSql,
  predictionRoiSummaryTableSql,
  setupPhase1,
};
