'use strict';
const mysql = require('mysql2/promise');
const { resolvePool } = require('../db/pool-factory');

class MySqlRaceCountRepository {
  constructor(opts) {
    const { pool, ownsPool } = resolvePool(opts);
    this._pool = pool;
    this._ownsPool = ownsPool;
    this._conn = null;
  }

  async connect() {
    this._conn = await this._pool.getConnection();
  }

  async beginTransaction() { await this._conn.beginTransaction(); }
  async commit()           { await this._conn.commit(); }
  async rollback()         { await this._conn.rollback(); }

  async close() {
    if (this._conn) { this._conn.release(); this._conn = null; }
    if (this._ownsPool && this._pool) await this._pool.end().catch(() => {});
  }

  async findVenueCodesByDate(dateISO) {
    const [rows] = await this._conn.execute(
      'SELECT venucode FROM calendar WHERE race_date = ? ORDER BY venucode',
      [dateISO]
    );
    return rows.map(r => Number(r.venucode));
  }

  async saveRaceCount({ ymd, venueCode, totalRaces }) {
    const id = `${ymd}${venueCode}`;
    await this._conn.execute(
      `INSERT INTO race_cnt (id, cnt) VALUES (?, ?) ON DUPLICATE KEY UPDATE cnt = VALUES(cnt)`,
      [id, totalRaces]
    );
    await this._conn.execute(
      `INSERT INTO race_count_by_date (ymd, venue_code, total_races) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE total_races = VALUES(total_races)`,
      [ymd, String(venueCode), totalRaces]
    );
  }
}

module.exports = { MySqlRaceCountRepository };
