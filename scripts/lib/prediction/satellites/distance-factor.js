'use strict';

const BONUS   = 20; // rawBonus の固定値（capPct でコアスコアの10%に制限される）
const CAP_PCT = 10;

/**
 * DistanceFactor: 今走と同じ距離で1着実績のある馬にボーナスを付与。
 * bonus = BONUS(20)  ←  scoring.js 側でコアスコアの10%にキャップ
 *
 * @param {Array<{horse_number, horse_name}>} racingFormRows
 * @param {number|null} distanceM  - 今走の距離（race_info.distance_m）
 * @param {Function} fetchResults  - async (horseName, beforeRaceId) => [{official_finish_position, distance_m}]
 * @param {string} currentRaceId
 * @returns {Promise<{ bonuses: Map<number, number>, capPct: number }>}
 */
async function computeDistanceBonuses(racingFormRows, distanceM, fetchResults, currentRaceId) {
  const bonuses = new Map();

  if (!distanceM) return { bonuses, capPct: CAP_PCT };

  await Promise.all(racingFormRows.map(async row => {
    const results = await fetchResults(row.horse_name, currentRaceId);
    const hasWin = results.some(r =>
      r.official_finish_position === 1 && r.distance_m === distanceM
    );
    if (hasWin) bonuses.set(row.horse_number, BONUS);
  }));

  return { bonuses, capPct: CAP_PCT };
}

module.exports = { computeDistanceBonuses, DISTANCE_BONUS: BONUS, CAP_PCT };
