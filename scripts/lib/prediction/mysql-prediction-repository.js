'use strict';

const mysql = require('mysql2/promise');
const { MODEL_VERSION } = require('./scoring');

class MySqlPredictionRepository {
  constructor({ mysqlConfig, mysqlClient = mysql }) {
    this.mysqlConfig = mysqlConfig;
    this.mysqlClient = mysqlClient;
    this.conn = null;
  }

  async connect() {
    this.conn = await this.mysqlClient.createConnection({
      host: this.mysqlConfig.host || 'localhost',
      user: this.mysqlConfig.user,
      password: this.mysqlConfig.password,
      port: this.mysqlConfig.port,
      database: this.mysqlConfig.database || 'localkeiba',
      charset: 'utf8mb4',
    });
  }

  async close() {
    if (this.conn) await this.conn.end();
  }

  async findRacingFormRows(raceId) {
    const [rows] = await this.conn.execute(
      `SELECT
         horse_number,
         horse_name,
         jockey_name  AS jockey,
         trainer_name AS trainer,
         sire,
         sex_age
       FROM racing_form
       WHERE race_id = ?
       ORDER BY horse_number ASC`,
      [raceId]
    );
    return rows;
  }

  async findJockeyScores(year) {
    const [rows] = await this.conn.execute(
      `SELECT jockey_name, score FROM jockey_ranking WHERE year = ?`,
      [year]
    );
    return rows;
  }

  async findTrainerScores(year) {
    const [rows] = await this.conn.execute(
      `SELECT trainer_name, score FROM trainer_ranking WHERE year = ?`,
      [year]
    );
    return rows;
  }

  async findSireScores() {
    const [rows] = await this.conn.execute(
      `SELECT sire_name, MAX(score) AS score
         FROM sire_ranking
        GROUP BY sire_name`
    );
    return rows;
  }

  async savePrediction({ raceId, memo, modelVersion = MODEL_VERSION }) {
    await this.conn.execute(
      `INSERT INTO prediction (race_id, model_version, memo)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE
         model_version = VALUES(model_version),
         memo          = VALUES(memo)`,
      [raceId, modelVersion, JSON.stringify(memo)]
    );
  }
}

module.exports = { MySqlPredictionRepository };
