'use strict';

const BONUS = 10;

/**
 * ImprovementFactor: 前走より着順が1つ以上改善した馬に +10 点を付与する。
 * データなし・1走分しかない場合はボーナス0（スキップ）。
 *
 * @param {Array<{horse_number, horse_name}>} racingFormRows
 * @param {string} currentRaceId  - 現在のrace_id（これより古いレースを対象にする）
 * @param {Function} fetchRecentResults - async (horseName, beforeRaceId) => [{official_finish_position}]
 * @returns {Map<number, number>} horse_number → bonus
 */
async function computeImprovementBonuses(racingFormRows, currentRaceId, fetchRecentResults) {
  const bonuses = new Map();
  await Promise.all(racingFormRows.map(async row => {
    const results = await fetchRecentResults(row.horse_name, currentRaceId);
    // 直近2走が取れた場合のみ判定（results[0]=最新, results[1]=その前）
    if (results.length >= 2) {
      const latest = results[0].official_finish_position;
      const prev   = results[1].official_finish_position;
      if (latest < prev) {
        bonuses.set(row.horse_number, BONUS);
      }
    }
  }));
  return bonuses;
}

module.exports = { computeImprovementBonuses, IMPROVEMENT_BONUS: BONUS };
