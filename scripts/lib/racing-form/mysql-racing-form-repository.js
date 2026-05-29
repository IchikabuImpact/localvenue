'use strict';
const mysql = require('mysql2/promise');
const { createPool } = require('../db/pool-factory');
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
  constructor({ pool, mysqlConfig, mysqlClient = mysql, logger = console, sleep = ms => new Promise(r => setTimeout(r, ms)) }) {
    this._pool = pool ?? createPool(mysqlConfig, mysqlClient);
    this.logger = logger;
    this.sleep = sleep;
  }

  async connect() {}
  async close() {}

  // 出馬表データ読み取り（予想ドメインで使用）
  async findByRaceId(raceId) {
    const [rows] = await this._pool.execute(
      `SELECT horse_number, horse_name,
              jockey_name  AS jockey,
              trainer_name AS trainer,
              sire, sex_age
       FROM racing_form WHERE race_id = ? ORDER BY horse_number ASC`,
      [raceId]
    );
    return rows;
  }

  async saveRaceForm({ raceId, rows }) {
    const sql = buildRacingFormUpsert(rows);
    const params = buildRacingFormParams({ raceId, rows });
    const lockName = `racing_form_${raceId}`;

    const conn = await this._pool.getConnection();
    try {
      await conn.query('SET NAMES utf8mb4');
      await conn.execute('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');

      let gotLock = 0;
      try {
        const [[lRow]] = await conn.execute('SELECT GET_LOCK(?, ?) AS got', [lockName, 10]);
        gotLock = lRow?.got || 0;
        if (gotLock !== 1) this.logger.warn(`[warn] lock取得失敗: ${lockName} → ロックなしで続行`);

        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            await conn.beginTransaction();
            await conn.execute('DELETE FROM racing_form WHERE race_id = ?', [raceId]);
            await conn.execute(sql, params);
            await conn.commit();
            return rows.length;
          } catch (txErr) {
            try { await conn.rollback(); } catch { /* ignore */ }
            if (!isDeadlock(txErr) || attempt === 3) throw txErr;
            await this.sleep(200 * attempt);
          }
        }
      } finally {
        if (gotLock === 1) await conn.execute('SELECT RELEASE_LOCK(?)', [lockName]).catch(() => {});
      }
    } finally {
      conn.release();
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
