'use strict';

const { VENUE_COURSES } = require('../trainer/trainer-master');

const FORM_COLUMNS = [
  'race_id', 'frame_number', 'horse_number', 'horse_name', 'sex_age', 'hair', 'sire', 'dam', 'broodmare_sire',
  'carried_weight', 'jockey_name', 'affiliation', 'trainer_name', 'owner', 'breeder', 'odds_morning',
  'horse_weight', 'horse_weight_diff', 'remarks', 'running_style', 'agari_3f_1', 'agari_3f_2',
];

/**
 * 出馬表APIの読み出し。読むだけで書き込みはしない。
 */
class RacecardRepository {
  constructor({ pool, pastRunLimit = 5 }) {
    this._pool = pool;
    this._pastRunLimit = pastRunLimit;
    this._venues = null;
    this._hasTrainerMaster = null;
  }

  async _q(sql, params = []) {
    const [rows] = await this._pool.query(sql, params);
    return rows;
  }

  async findVenues() {
    if (!this._venues) {
      const rows = await this._q('SELECT baba_code, venue FROM venue_master ORDER BY baba_code');
      this._venues = rows.map((r) => ({ code: Number(r.baba_code), name: r.venue }));
    }
    return this._venues;
  }

  async _trainerMasterAvailable() {
    if (this._hasTrainerMaster === null) {
      const rows = await this._q(
        `SELECT COUNT(*) AS n FROM information_schema.TABLES
          WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME IN ('trainer_master', 'trainer_alias')`
      );
      this._hasTrainerMaster = Number(rows[0].n) === 2;
    }
    return this._hasTrainerMaster;
  }

  async findDayRaces(date) {
    const from = Number(`${date}0000`);
    const to = Number(`${date}9999`);
    const rows = await this._q(
      `SELECT DISTINCT f.race_id, i.race_start_time
         FROM racing_form f
         LEFT JOIN race_info i ON i.race_id = CAST(f.race_id AS CHAR)
        WHERE f.race_id BETWEEN ? AND ?
        ORDER BY f.race_id`,
      [from, to]
    );
    const venues = await this.findVenues();
    return rows
      .map((r) => {
        const id = String(r.race_id);
        const babaCode = Number(id.slice(10, 12));
        return {
          raceId: id,
          babaCode,
          raceNo: Number(id.slice(8, 10)),
          venue: venues.find((v) => v.code === babaCode)?.name || `馬場コード${babaCode}`,
          startTime: r.race_start_time || null,
        };
      })
      .sort((a, b) => a.babaCode - b.babaCode || a.raceNo - b.raceNo);
  }

  async findRace(raceId, babaCode) {
    const horses = await this._q(
      `SELECT ${FORM_COLUMNS.join(', ')} FROM racing_form WHERE race_id = ? ORDER BY horse_number`,
      [Number(raceId)]
    );
    if (!horses.length) return null;
    const [info] = await this._q(
      'SELECT race_title, distance_m, track_condition, weather, race_start_time FROM race_info WHERE race_id = ?',
      [String(raceId)]
    );
    await this._attachTrainers(horses, babaCode);
    await this._attachPastRuns(horses, raceId);
    return { info: info || null, horses };
  }

  async _attachTrainers(horses, babaCode) {
    if (!(await this._trainerMasterAvailable())) return;
    const names = [...new Set(horses.map((h) => h.trainer_name).filter(Boolean))];
    if (!names.length) return;
    const rows = await this._q(
      `SELECT a.short_name, a.course, m.full_name, m.affiliation
         FROM trainer_alias a JOIN trainer_master m ON m.trainer_id = a.trainer_id
        WHERE a.short_name IN (?)`,
      [names]
    );
    const courses = new Set(VENUE_COURSES[String(Number(babaCode))] || []);
    for (const h of horses) {
      const cands = rows.filter((r) => r.short_name === h.trainer_name);
      // 同じ略称が複数の人に結び付いているときは、開催競馬場の所属の人を選ぶ
      const pick = cands.find((r) => courses.has(r.course)) || (cands.length === 1 ? cands[0] : null);
      if (pick) {
        h.trainerFullName = pick.full_name;
        h.trainerCourse = pick.course;
        h.trainerAffiliation = pick.affiliation;
      }
    }
  }

  async _attachPastRuns(horses, raceId) {
    const names = [...new Set(horses.map((h) => h.horse_name).filter(Boolean))];
    if (!names.length) return;
    const rows = await this._q(
      `SELECT rr.race_id, rr.horse_name, rr.official_finish_position, rr.odds_final, rr.jockey_name,
              i.race_title, i.distance_m, i.track_condition,
              (SELECT COUNT(*) FROM race_results x WHERE x.race_id = rr.race_id) AS field_size
         FROM race_results rr
         LEFT JOIN race_info i ON i.race_id = CAST(rr.race_id AS CHAR)
        WHERE rr.horse_name IN (?) AND rr.race_id < ?
        ORDER BY rr.race_id DESC`,
      [names, Number(raceId)]
    );
    const venues = await this.findVenues();
    for (const h of horses) {
      h.pastRuns = rows
        .filter((r) => r.horse_name === h.horse_name)
        .slice(0, this._pastRunLimit)
        .map((r) => {
          const id = String(r.race_id);
          const code = Number(id.slice(10, 12));
          return {
            raceId: id,
            venue: venues.find((v) => v.code === code)?.name || `馬場コード${code}`,
            raceNo: Number(id.slice(8, 10)),
            title: r.race_title,
            distance: r.distance_m,
            trackCondition: r.track_condition,
            position: r.official_finish_position,
            fieldSize: Number(r.field_size) || null,
            oddsFinal: r.odds_final,
            jockey: r.jockey_name,
          };
        });
    }
  }
}

module.exports = { RacecardRepository, FORM_COLUMNS };
