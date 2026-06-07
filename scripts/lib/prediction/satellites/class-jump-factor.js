'use strict';

const BONUS   = 20;
const CAP_PCT = 10;

/**
 * ClassJumpFactor: 前走よりクラスが1段階以上上昇した馬にボーナスを付与。
 * bonus = BONUS(20)  ←  scoring.js 側でコアスコアの10%にキャップ
 *
 * クラスレベルは parseRaceClassLevel() が返す 1〜5 を使用。
 * 今走・前走どちらかが null（クラス判定不能）の場合はスキップ。
 *
 * @param {Array<{horse_number, horse_name}>} racingFormRows
 * @param {number|null} currentClassLevel  - 今走のクラスレベル（parseRaceClassLevel の結果）
 * @param {Function} fetchLastRaceTitle    - async (horseName, beforeRaceId) => {race_title} | null
 * @param {string} currentRaceId
 * @returns {Promise<{ bonuses: Map<number, number>, capPct: number }>}
 */
async function computeClassJumpBonuses(racingFormRows, currentClassLevel, fetchLastRaceTitle, currentRaceId) {
  const bonuses = new Map();

  if (currentClassLevel == null) return { bonuses, capPct: CAP_PCT };

  const { parseRaceClassLevel } = require('../scoring');

  await Promise.all(racingFormRows.map(async row => {
    const last = await fetchLastRaceTitle(row.horse_name, currentRaceId);
    if (!last) return;
    const prevLevel = parseRaceClassLevel(last.race_title);
    if (prevLevel != null && currentClassLevel > prevLevel) {
      bonuses.set(row.horse_number, BONUS);
    }
  }));

  return { bonuses, capPct: CAP_PCT };
}

module.exports = { computeClassJumpBonuses, CLASS_JUMP_BONUS: BONUS, CAP_PCT };
