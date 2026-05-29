'use strict';
const mysql = require('mysql2/promise');
const { resolvePool } = require('../db/pool-factory');
const { raceDaysToRows, logRaceDays } = require('./race-days');

class MySqlCalendarRepository {
  constructor({ pool, mysqlConfig, mysqlClient = mysql, logger = console, useTransaction = true, successSuffix = '' }) {
    const resolved = resolvePool({ pool, mysqlConfig, mysqlClient });
    this._pool = resolved.pool;
    this._ownsPool = resolved.ownsPool;
    this.logger = logger;
    this.useTransaction = useTransaction;
    this.successSuffix = successSuffix;
  }

  async connect() {}
  async close() {
    if (this._ownsPool && this._pool) await this._pool.end().catch(() => {});
  }

  async saveRaceDays(raceDays) {
    const rows = raceDaysToRows(raceDays);
    if (rows.length === 0) {
      this.logger.log('[INFO] 保存対象なし（該当開催なし）');
      return 0;
    }

    const conn = await this._pool.getConnection();
    try {
      if (this.useTransaction) await conn.beginTransaction();

      const CHUNK = 300;
      for (let i = 0; i < rows.length; i += CHUNK) {
        const chunk = rows.slice(i, i + CHUNK);
        const placeholders = chunk.map(() => '(?,?,?)').join(',');
        await conn.execute(
          `INSERT INTO calendar (race_date, venucode, venue) VALUES ${placeholders} ON DUPLICATE KEY UPDATE venue = VALUES(venue)`,
          chunk.flat()
        );
      }

      if (this.useTransaction) await conn.commit();
      this.logger.log(`[OK] ${rows.length} rows saved to calendar${this.successSuffix}`);
      logRaceDays(raceDays, this.logger);
      return rows.length;
    } catch (e) {
      if (this.useTransaction) await conn.rollback().catch(() => {});
      throw e;
    } finally {
      conn.release();
    }
  }
}

module.exports = { MySqlCalendarRepository };
