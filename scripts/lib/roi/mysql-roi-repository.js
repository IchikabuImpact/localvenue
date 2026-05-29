'use strict';
const mysql = require('mysql2/promise');
const { createPool } = require('../db/pool-factory');

class MySqlRoiRepository {
  constructor({ pool, mysqlConfig, mysqlClient = mysql }) {
    this._pool = pool ?? createPool(mysqlConfig, mysqlClient);
  }

  async connect() {}
  async close() {}

  async findTargetRaces({ from, to, model }) {
    const where = [], params = [];
    if (from && to) {
      where.push('LEFT(CAST(p.race_id AS CHAR), 8) BETWEEN ? AND ?');
      params.push(from.replace(/-/g, ''), to.replace(/-/g, ''));
    }
    if (model) { where.push('p.model_version = ?'); params.push(model); }
    const [rows] = await this._pool.execute(
      `SELECT DISTINCT p.race_id FROM prediction p ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY p.race_id`,
      params
    );
    return rows;
  }

  async findLatestPrediction({ raceId, model }) {
    const params = model ? [raceId, model] : [raceId];
    const [rows] = await this._pool.execute(
      `SELECT model_version, memo, created_at FROM prediction WHERE race_id = ? ${model ? 'AND model_version=?' : ''} ORDER BY created_at DESC LIMIT 1`,
      params
    );
    return rows[0] ?? null;
  }

  async findPayoutRows(raceId) {
    const [rows] = await this._pool.execute(
      `SELECT bet_type, horse_number, payout FROM race_payouts WHERE race_id=? AND bet_type IN ('WIN','PLACE')`,
      [raceId]
    );
    return rows;
  }

  async upsertROI(row) {
    await this._pool.execute(
      `INSERT INTO prediction_roi (race_id, model_version, strategy, stake, returned, roi_pct)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE stake=VALUES(stake), returned=VALUES(returned), roi_pct=VALUES(roi_pct), updated_at=CURRENT_TIMESTAMP`,
      [row.race_id, row.model_version, row.strategy, row.stake, row.returned, row.roi_pct]
    );
  }

  async aggregateDaily(targetYmd) {
    const [rows] = await this._pool.execute(
      `SELECT LEFT(race_id, 8) as ymd_str, model_version, strategy,
              COUNT(*) AS races,
              COALESCE(SUM(stake), 0) AS invest_yen,
              COALESCE(SUM(returned), 0) AS return_yen,
              ROUND((SUM(returned) / NULLIF(SUM(stake), 0)) * 100, 2) AS roi_percent
       FROM prediction_roi
       WHERE LEFT(race_id, 8) = ? AND strategy IN ('single', 'place', 'quinella')
       GROUP BY ymd_str, model_version, strategy`,
      [targetYmd]
    );
    return rows;
  }

  async upsertDaily({ isoDate, row }) {
    const roi = row.roi_percent === null ? 0.00 : row.roi_percent;
    await this._pool.execute(
      `INSERT INTO prediction_roi_daily (ymd, model_version, strategy, races, invest_yen, return_yen, roi_percent)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE races=VALUES(races), invest_yen=VALUES(invest_yen), return_yen=VALUES(return_yen), roi_percent=VALUES(roi_percent)`,
      [isoDate, row.model_version, row.strategy, row.races, row.invest_yen, row.return_yen, roi]
    );
  }

  async findDailyRows(isoDate) {
    const [rows] = await this._pool.execute(
      `SELECT * FROM prediction_roi_daily WHERE ymd = ? ORDER BY model_version, strategy`,
      [isoDate]
    );
    return rows;
  }
}

module.exports = { MySqlRoiRepository };
