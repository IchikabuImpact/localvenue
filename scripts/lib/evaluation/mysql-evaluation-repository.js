'use strict';
const mysql = require('mysql2/promise');
class MySqlEvaluationRepository {
  constructor({ mysqlConfig, mysqlClient = mysql }) { this.mysqlConfig = mysqlConfig; this.mysqlClient = mysqlClient; this.conn = null; }
  async connect() { this.conn = await this.mysqlClient.createConnection({ host: this.mysqlConfig.host || 'localhost', user: this.mysqlConfig.user, password: this.mysqlConfig.password, port: this.mysqlConfig.port, database: this.mysqlConfig.database || 'localkeiba', charset: 'utf8mb4' }); }
  async close() { if (this.conn) await this.conn.end(); }
  async findLatestPrediction(raceId) { const [rows] = await this.conn.execute(`SELECT model_version, memo, created_at FROM prediction WHERE race_id = ? ORDER BY created_at DESC LIMIT 1`, [raceId]); return rows[0] || null; }
  async findResultRows(raceId) { const [rows] = await this.conn.execute(`SELECT horse_number, horse_name, official_finish_position, dead_heat_group, dead_heat_order_in_group FROM race_results WHERE race_id = ?`, [raceId]); return rows; }
  async findPayoutRows(raceId) { const [rows] = await this.conn.execute(`SELECT bet_type, horse_number, payout FROM race_payouts WHERE race_id = ? AND bet_type IN ('WIN','PLACE')`, [raceId]); return rows; }
  async upsertPredictionEval(row) { await this.conn.execute(`INSERT INTO prediction_eval (race_id, model_version, predicted_horse_number, win_hit, win_payout, place_hit, place_payout) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE predicted_horse_number = VALUES(predicted_horse_number), win_hit = VALUES(win_hit), win_payout= VALUES(win_payout), place_hit = VALUES(place_hit), place_payout = VALUES(place_payout), updated_at = CURRENT_TIMESTAMP`, [row.race_id, row.model_version, row.predicted_horse_number ?? null, row.win_hit ? 1 : 0, row.win_payout ?? null, row.place_hit ? 1 : 0, row.place_payout ?? null]); }
  async upsertPredictionROI(row) { await this.conn.execute(`INSERT INTO prediction_roi (race_id, model_version, strategy, stake, returned, roi_pct) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE stake = VALUES(stake), returned = VALUES(returned), roi_pct = VALUES(roi_pct), updated_at = CURRENT_TIMESTAMP`, [row.race_id, row.model_version, row.strategy, row.stake, row.returned, row.roi_pct]); }
}
module.exports = { MySqlEvaluationRepository };
