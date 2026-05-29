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
