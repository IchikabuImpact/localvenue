'use strict';
const mysql = require('mysql2/promise');
const { resolvePool } = require('../db/pool-factory');

class MySqlRankingRepository {
  constructor(opts) {
    const { pool, ownsPool } = resolvePool(opts);
    this._pool = pool;
    this._ownsPool = ownsPool;
  }

  async connect() {}
  async close() {
    if (this._ownsPool && this._pool) await this._pool.end().catch(() => {});
  }

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
