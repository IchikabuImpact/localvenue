'use strict';
const mysql = require('mysql2/promise');
const { createPool } = require('../db/pool-factory');

class MySqlRankingRepository {
  constructor({ pool, mysqlConfig, mysqlClient = mysql }) {
    this._pool = pool ?? createPool(mysqlConfig, mysqlClient);
  }

  async connect() {}
  async close() {}

  async findJockeyScores(year) {
    const [rows] = await this._pool.execute(
      `SELECT jockey_name, score FROM jockey_ranking WHERE year = ?`,
      [year]
    );
    return rows;
  }

  async findTrainerScores(year) {
    const [rows] = await this._pool.execute(
      `SELECT trainer_name, score FROM trainer_ranking WHERE year = ?`,
      [year]
    );
    return rows;
  }

  async findSireScores() {
    const [rows] = await this._pool.execute(
      `SELECT sire_name, MAX(score) AS score FROM sire_ranking GROUP BY sire_name`
    );
    return rows;
  }
}

module.exports = { MySqlRankingRepository };
