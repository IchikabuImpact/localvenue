'use strict';

const mysql = require('mysql2/promise');

class MySqlRaceCountRepository {
  constructor({ mysqlConfig, mysqlClient = mysql }) {
    this.mysqlConfig = mysqlConfig;
    this.mysqlClient = mysqlClient;
    this.conn = null;
  }

  async connect() {
    this.conn = await this.mysqlClient.createConnection({
      host:     this.mysqlConfig.host || 'localhost',
      user:     this.mysqlConfig.user,
      password: this.mysqlConfig.password,
      port:     this.mysqlConfig.port,
      database: this.mysqlConfig.database || 'localkeiba',
      charset:  'utf8mb4',
    });
  }

  async beginTransaction() {
    await this.conn.beginTransaction();
  }

  async commit() {
    await this.conn.commit();
  }

  async rollback() {
    await this.conn.rollback();
  }

  async close() {
    if (this.conn) await this.conn.end();
  }

  async findVenueCodesByDate(dateISO) {
    const [rows] = await this.conn.execute(
      'SELECT venucode FROM calendar WHERE race_date = ? ORDER BY venucode',
      [dateISO]
    );
    return rows.map(r => Number(r.venucode));
  }

  async saveRaceCount({ ymd, venueCode, totalRaces }) {
    const id = `${ymd}${venueCode}`;

    await this.conn.execute(
      `INSERT INTO race_cnt (id, cnt)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE cnt = VALUES(cnt)`,
      [id, totalRaces]
    );

    await this.conn.execute(
      `INSERT INTO race_count_by_date (ymd, venue_code, total_races)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE total_races = VALUES(total_races)`,
      [ymd, String(venueCode), totalRaces]
    );
  }
}

module.exports = { MySqlRaceCountRepository };
