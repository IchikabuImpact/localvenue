'use strict';

async function loadVenueMap(pool) {
  const [venues] = await pool.execute(`SELECT baba_code, venue FROM venue_master`);
  const map = new Map(venues.map(v => [String(v.baba_code).padStart(2, '0'), v.venue]));
  // NAR 補完コード
  const extras = { '10':'盛岡','11':'水沢','18':'浦和','19':'船橋','20':'大井','21':'川崎',
    '22':'金沢','23':'笠松','24':'名古屋','27':'園田','28':'姫路','31':'高知',
    '32':'佐賀','36':'門別','03':'帯広' };
  for (const [k, v] of Object.entries(extras)) map.set(k, v);
  return map;
}

async function loadDailyRoi(pool, isoDate) {
  const [rows] = await pool.execute(
    `SELECT * FROM prediction_roi_daily WHERE ymd = ?`, [isoDate]
  );
  return rows;
}

async function loadRaces(pool, ymdArg, modelArg) {
  const [rows] = await pool.execute(`
    SELECT
      CAST(p.race_id AS CHAR) as race_id, p.model_version, p.memo, p.created_at,
      r.official_finish_position, r.horse_number as win_horse_number, r.win_payout,
      eval.win_hit, eval.win_payout as eval_win_return,
      eval.place_hit, eval.place_payout as eval_place_return,
      eval.quinella_hit, eval.quinella_payout as eval_quinella_return
    FROM prediction p
    LEFT JOIN (
      SELECT race_id, model_version, win_hit, win_payout, place_hit, place_payout, quinella_hit, quinella_payout
      FROM prediction_eval
    ) eval ON p.race_id = eval.race_id AND p.model_version = eval.model_version
    LEFT JOIN (
      SELECT race_id, horse_number, official_finish_position, odds_final as win_payout
      FROM race_results WHERE official_finish_position = 1 LIMIT 1
    ) r ON p.race_id = r.race_id
    WHERE LEFT(p.race_id, 8) = ?
    ORDER BY p.race_id ASC
  `, [ymdArg]);

  const raceMap = new Map();
  for (const r of rows) {
    if (modelArg && r.model_version !== modelArg) continue;
    if (!raceMap.has(r.race_id) || new Date(r.created_at) > new Date(raceMap.get(r.race_id).created_at)) {
      raceMap.set(r.race_id, r);
    }
  }
  return Array.from(raceMap.values()).sort((a, b) => {
    const sA = String(a.race_id), sB = String(b.race_id);
    const vA = sA.slice(10, 12),  vB = sB.slice(10, 12);
    if (vA !== vB) return vA.localeCompare(vB);
    return sA.slice(8, 10).localeCompare(sB.slice(8, 10));
  });
}

async function loadRoiStats(pool, isoDate) {
  const [stats] = await pool.execute(`
    SELECT ymd, strategy, roi_percent, invest_yen, return_yen
    FROM prediction_roi_daily
    WHERE ymd >= DATE_SUB(?, INTERVAL 30 DAY)
    ORDER BY ymd ASC, strategy DESC
  `, [isoDate]);

  const dateStats = new Map();
  for (const s of stats) {
    // JST offset +9h を加算（toISOString はUTC返しのため1日ずれる）
    const dStr = s.ymd instanceof Date
      ? new Date(s.ymd.getTime() + 9 * 3600 * 1000).toISOString().slice(0, 10)
      : String(s.ymd).slice(0, 10);
    if (!dateStats.has(dStr)) dateStats.set(dStr, {});
    dateStats.get(dStr)[s.strategy] = s;
  }
  return dateStats;
}

module.exports = { loadVenueMap, loadDailyRoi, loadRaces, loadRoiStats };
