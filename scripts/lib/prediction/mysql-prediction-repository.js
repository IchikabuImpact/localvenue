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
      `SELECT weather, track_condition, distance_m, race_start_time FROM race_info WHERE race_id = ?`,
      [raceId]
    );
    return rows[0] ?? null;
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
