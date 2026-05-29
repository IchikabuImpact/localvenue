'use strict';
const mysql = require('mysql2/promise');
const { createPool } = require('../db/pool-factory');

class MySqlRaceIdRepository {
  constructor({ pool, mysqlConfig, mysqlClient = mysql }) {
    this._pool = pool ?? createPool(mysqlConfig, mysqlClient);
  }

  async connect() {}
  async close() {}

  async findRaceCountsByYmd(ymd) {
    const [rows] = await this._pool.execute(
      `SELECT venue_code, total_races FROM race_count_by_date WHERE ymd = ? ORDER BY venue_code`,
      [ymd]
    );
    return rows;
  }
}

module.exports = { MySqlRaceIdRepository };
