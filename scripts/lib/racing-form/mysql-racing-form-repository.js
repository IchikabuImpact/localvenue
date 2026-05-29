'use strict';

const mysql = require('mysql2/promise');
const { isDeadlock } = require('./deadlock');

const RACING_FORM_COLUMNS = [
  'race_id', 'frame_number', 'horse_number', 'horse_name',
  'sex_age', 'hair', 'birthyear', 'birthymonth',
  'sire', 'dam', 'broodmare_sire',
  'jockey_name', 'affiliation',
  'carried_weight', 'trainer_name', 'owner', 'breeder',
];

function buildRacingFormUpsert(rows) {
  const placeholders = rows.map(() => `(${RACING_FORM_COLUMNS.map(() => '?').join(',')})`).join(',');
  return `
      INSERT INTO racing_form (${RACING_FORM_COLUMNS.join(',')})
      VALUES ${placeholders}
      ON DUPLICATE KEY UPDATE
        frame_number=VALUES(frame_number),
        horse_name=VALUES(horse_name),
        sex_age=VALUES(sex_age),
        hair=VALUES(hair),
        birthyear=VALUES(birthyear),
        birthymonth=VALUES(birthymonth),
        sire=VALUES(sire),
        dam=VALUES(dam),
        broodmare_sire=VALUES(broodmare_sire),
        jockey_name=VALUES(jockey_name),
        affiliation=VALUES(affiliation),
        carried_weight=VALUES(carried_weight),
        trainer_name=VALUES(trainer_name),
        owner=VALUES(owner),
        breeder=VALUES(breeder),
        updated_at=CURRENT_TIMESTAMP
    `;
}

function buildRacingFormParams({ raceId, rows }) {
  const params = [];
  for (const r of rows) {
    params.push(
      raceId,
      r.frame_number, r.horse_number, r.horse_name,
      r.sex_age, r.hair, r.birthyear, r.birthymonth,
      r.sire, r.dam, r.broodmare_sire,
      r.jockey, r.affiliation,
      r.burden_weight,
      r.trainer, r.owner, r.breeder,
    );
  }
  return params;
}

class MySqlRacingFormRepository {
  constructor({ mysqlConfig, mysqlClient = mysql, logger = console, sleep = ms => new Promise(r => setTimeout(r, ms)) }) {
    this.mysqlConfig = mysqlConfig;
    this.mysqlClient = mysqlClient;
    this.logger = logger;
    this.sleep = sleep;
    this.conn = null;
  }

  async connect() {
    this.conn = await this.mysqlClient.createConnection({
      host:     this.mysqlConfig.host || 'localhost',
      user:     this.mysqlConfig.user,
      password: this.mysqlConfig.password,
      port:     this.mysqlConfig.port,
      database: this.mysqlConfig.database || 'localvenue',
      charset:  'utf8mb4',
    });
    await this.conn.query('SET NAMES utf8mb4');
  }

  async close() {
    if (this.conn) await this.conn.end();
  }

  async saveRaceForm({ raceId, rows }) {
    const sql = buildRacingFormUpsert(rows);
    const params = buildRacingFormParams({ raceId, rows });
    const lockName = `racing_form_${raceId}`;

    await this.conn.execute('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');

    let gotLock = 0;
    try {
      const [[lRow]] = await this.conn.execute('SELECT GET_LOCK(?, ?) AS got', [lockName, 10]);
      gotLock = lRow?.got || 0;
      if (gotLock !== 1) this.logger.warn(`[warn] lock取得失敗: ${lockName} → ロックなしで続行`);

      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          await this.conn.beginTransaction();
          await this.conn.execute('DELETE FROM racing_form WHERE race_id = ?', [raceId]);
          await this.conn.execute(sql, params);
          await this.conn.commit();
          return rows.length;
        } catch (txErr) {
          try { await this.conn.rollback(); } catch { /* ignore */ }
          if (!isDeadlock(txErr) || attempt === 3) throw txErr;
          await this.sleep(200 * attempt);
        }
      }
    } finally {
      if (gotLock === 1) {
        try { await this.conn.execute('SELECT RELEASE_LOCK(?)', [lockName]); } catch { /* ignore */ }
      }
    }

    return rows.length;
  }
}

module.exports = {
  MySqlRacingFormRepository,
  RACING_FORM_COLUMNS,
  buildRacingFormParams,
  buildRacingFormUpsert,
};
