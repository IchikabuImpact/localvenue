'use strict';

const mysql = require('mysql2/promise');

class MySqlRaceIdRepository {
  constructor({ mysqlConfig, mysqlClient = mysql }) {
    this.mysqlConfig = mysqlConfig;
    this.mysqlClient = mysqlClient;
    this.conn = null;
  }

  async connect() {
    this.conn = await this.mysqlClient.createConnection({
      host: this.mysqlConfig.host,
      user: this.mysqlConfig.user,
      password: this.mysqlConfig.password,
      database: this.mysqlConfig.database,
      port: this.mysqlConfig.port,
    });
  }

  async close() {
    if (this.conn) await this.conn.end();
  }

  async findRaceCountsByYmd(ymd) {
    const [rows] = await this.conn.execute(
      `
      SELECT venue_code, total_races
      FROM race_count_by_date
      WHERE ymd = ?
      ORDER BY venue_code
      `,
      [ymd]
    );
    return rows;
  }
}

module.exports = { MySqlRaceIdRepository };
