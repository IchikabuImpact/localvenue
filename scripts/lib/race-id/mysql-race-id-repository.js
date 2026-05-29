'use strict';
const mysql = require('mysql2/promise');
const { resolvePool } = require('../db/pool-factory');

class MySqlRaceIdRepository {
  constructor(opts) {
    const { pool, ownsPool } = resolvePool(opts);
    this._pool = pool;
    this._ownsPool = ownsPool;
  }

  async connect() {}
  async close() {
    if (this._ownsPool && this._pool) await this._pool.end().catch(() => {});
  }

  async findRaceCountsByYmd(ymd) {
    const [rows] = await this._pool.execute(
      `SELECT venue_code, total_races FROM race_count_by_date WHERE ymd = ? ORDER BY venue_code`,
      [ymd]
    );
    return rows;
  }
}

module.exports = { MySqlRaceIdRepository };
