'use strict';
const mysql = require('mysql2/promise');
const { resolvePool } = require('../db/pool-factory');
const { MODEL_VERSION } = require('./scoring');

class MySqlPredictionRepository {
  constructor(opts) {
    const { pool, ownsPool } = resolvePool(opts);
    this._pool = pool;
    this._ownsPool = ownsPool;
  }

  async connect() {}
  async close() {
    if (this._ownsPool && this._pool) await this._pool.end().catch(() => {});
  }

  // 既存の予想レコードを取得（運用モードのスキップ判定用）
  async findExistingPrediction(raceId) {
    const [rows] = await this._pool.execute(
      `SELECT prediction_id FROM prediction WHERE race_id = ? LIMIT 1`,
      [raceId]
    );
    return rows[0] ?? null;
  }

  // race_info から天候・馬場状態を取得
  async findRaceInfo(raceId) {
    const [rows] = await this._pool.execute(
      `SELECT weather, track_condition, distance_m, race_start_time, race_title FROM race_info WHERE race_id = ?`,
      [raceId]
    );
    return rows[0] ?? null;
  }

  // 指定レースより前の同名馬の直近2走結果を返す（ImprovementFactor用）
  async findRecentResultsByHorseName(horseName, beforeRaceId) {
    const [rows] = await this._pool.execute(
      `SELECT rr.official_finish_position
         FROM race_results rr
         JOIN racing_form rf ON rf.race_id = rr.race_id AND rf.horse_name = rr.horse_name
        WHERE rr.horse_name = ?
          AND rr.race_id < ?
          AND rr.disqualified = 0
        ORDER BY rr.race_id DESC
        LIMIT 2`,
      [horseName, beforeRaceId]
    );
    return rows;
  }

  async savePrediction({ raceId, memo, modelVersion = MODEL_VERSION }) {
    await this._pool.execute(
      `INSERT INTO prediction (race_id, model_version, memo)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE model_version = VALUES(model_version), memo = VALUES(memo)`,
      [raceId, modelVersion, JSON.stringify(memo)]
    );
  }
}

module.exports = { MySqlPredictionRepository };
