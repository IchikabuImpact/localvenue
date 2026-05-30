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

  // trackCondition が指定された場合、条件別スコアを優先して取得する。
  // 条件別データがなければ 'all' にフォールバックするため、現状は動作変化なし。
  async findSireScores(trackCondition = null) {
    if (trackCondition) {
      const [rows] = await this._pool.execute(
        `SELECT sire_name,
           COALESCE(
             MAX(CASE WHEN track_condition = ? THEN score END),
             MAX(CASE WHEN track_condition = 'all' THEN score END),
             MAX(score)
           ) AS score
         FROM sire_ranking
         GROUP BY sire_name`,
        [trackCondition]
      );
      return rows;
    }
    const [rows] = await this._pool.execute(
      `SELECT sire_name, MAX(score) AS score FROM sire_ranking GROUP BY sire_name`
    );
    return rows;
  }
}

module.exports = { MySqlRankingRepository };
