'use strict';
const mysql = require('mysql2/promise');
const { createPool } = require('../db/pool-factory');

class MySqlEvaluationRepository {
  constructor({ pool, mysqlConfig, mysqlClient = mysql }) {
    this._pool = pool ?? createPool(mysqlConfig, mysqlClient);
  }

  async connect() {}
  async close() {}

  async findLatestPrediction(raceId) {
    const [rows] = await this._pool.execute(
      `SELECT model_version, memo, created_at FROM prediction WHERE race_id = ? ORDER BY created_at DESC LIMIT 1`,
      [raceId]
    );
    return rows[0] ?? null;
  }

  async findResultRows(raceId) {
    const [rows] = await this._pool.execute(
      `SELECT horse_number, horse_name, official_finish_position, dead_heat_group, dead_heat_order_in_group FROM race_results WHERE race_id = ?`,
      [raceId]
    );
    return rows;
  }

  async findPayoutRows(raceId) {
    const [rows] = await this._pool.execute(
      `SELECT bet_type, horse_number, payout FROM race_payouts WHERE race_id = ? AND bet_type IN ('WIN','PLACE','QUINELLA')`,
      [raceId]
    );
    return rows;
  }

  async upsertPredictionEval(row) {
    await this._pool.execute(
      `INSERT INTO prediction_eval
         (race_id, model_version, predicted_horse_number, win_hit, win_payout, place_hit, place_payout, quinella_hit, quinella_payout)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         predicted_horse_number = VALUES(predicted_horse_number),
         win_hit       = VALUES(win_hit),
         win_payout    = VALUES(win_payout),
         place_hit     = VALUES(place_hit),
         place_payout  = VALUES(place_payout),
         quinella_hit  = VALUES(quinella_hit),
         quinella_payout = VALUES(quinella_payout),
         updated_at    = CURRENT_TIMESTAMP`,
      [row.race_id, row.model_version, row.predicted_horse_number ?? null,
       row.win_hit ? 1 : 0, row.win_payout ?? null,
       row.place_hit ? 1 : 0, row.place_payout ?? null,
       row.quinella_hit ? 1 : 0, row.quinella_payout ?? null]
    );
  }

  async upsertPredictionROI(row) {
    await this._pool.execute(
      `INSERT INTO prediction_roi (race_id, model_version, strategy, stake, returned, roi_pct)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE stake = VALUES(stake), returned = VALUES(returned), roi_pct = VALUES(roi_pct), updated_at = CURRENT_TIMESTAMP`,
      [row.race_id, row.model_version, row.strategy, row.stake, row.returned, row.roi_pct]
    );
  }
}

module.exports = { MySqlEvaluationRepository };
