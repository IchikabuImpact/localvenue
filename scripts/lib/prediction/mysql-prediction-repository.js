'use strict';
const mysql = require('mysql2/promise');
const { createPool } = require('../db/pool-factory');
const { MODEL_VERSION } = require('./scoring');

class MySqlPredictionRepository {
  constructor({ pool, mysqlConfig, mysqlClient = mysql }) {
    this._pool = pool ?? createPool(mysqlConfig, mysqlClient);
  }

  async connect() {}
  async close() {}

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
