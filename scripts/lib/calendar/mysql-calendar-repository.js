'use strict';

const mysql = require('mysql2/promise');
const { raceDaysToRows, logRaceDays } = require('./race-days');

class MySqlCalendarRepository {
  constructor({ mysqlConfig, mysqlClient = mysql, logger = console, useTransaction = true, successSuffix = '' }) {
    this.mysqlConfig = mysqlConfig;
    this.mysqlClient = mysqlClient;
    this.logger = logger;
    this.useTransaction = useTransaction;
    this.successSuffix = successSuffix;
  }

  async saveRaceDays(raceDays) {
    const rows = raceDaysToRows(raceDays);
    if (rows.length === 0) {
      this.logger.log('[INFO] 保存対象なし（該当開催なし）');
      return 0;
    }

    let conn;
    try {
      conn = await this.mysqlClient.createConnection({
        host:     this.mysqlConfig.host,
        user:     this.mysqlConfig.user,
        password: this.mysqlConfig.password,
        database: this.mysqlConfig.database,
        port:     this.mysqlConfig.port,
        charset:  'utf8mb4',
      });

      if (this.useTransaction) await conn.beginTransaction();

      const CHUNK = 300;
      for (let i = 0; i < rows.length; i += CHUNK) {
        const chunk = rows.slice(i, i + CHUNK);
        const placeholders = chunk.map(() => '(?,?,?)').join(',');
        await conn.execute(
          `INSERT INTO calendar (race_date, venucode, venue)
           VALUES ${placeholders}
           ON DUPLICATE KEY UPDATE venue = VALUES(venue)`,
          chunk.flat()
        );
      }

      if (this.useTransaction) await conn.commit();

      this.logger.log(`[OK] ${rows.length} rows saved to calendar${this.successSuffix}`);
      logRaceDays(raceDays, this.logger);
      return rows.length;
    } catch (e) {
      if (conn && this.useTransaction) {
        try { await conn.rollback(); } catch { /* ignore */ }
      }
      throw e;
    } finally {
      if (conn) { try { await conn.end(); } catch { /* ignore */ } }
    }
  }
}

module.exports = { MySqlCalendarRepository };
