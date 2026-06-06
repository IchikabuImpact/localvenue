'use strict';

const WET_CONDITIONS = new Set(['重', '不良']);
const CAP_PCT = 10; // コアスコアの10%をボーナス上限とする

/**
 * WetTrackFactor: 重・不良馬場のとき、条件別サイアースコアが all より高い馬にボーナスを付与。
 * bonus = max(0, conditionScore - allScore)  ←  scoring.js 側でコアスコアの10%にキャップ
 *
 * @param {Array<{horse_number, sire}>} racingFormRows
 * @param {string} trackCondition
 * @param {Array<{sire_name, score}>} conditionSireRows - 重 or 不良の生スコア（フォールバックなし）
 * @param {Array<{sire_name, score}>} allSireRows       - all の生スコア
 * @returns {{ bonuses: Map<number, number>, capPct: number }}
 */
function computeWetTrackBonuses(racingFormRows, trackCondition, conditionSireRows, allSireRows) {
  const bonuses = new Map();

  if (!WET_CONDITIONS.has(trackCondition)) return { bonuses, capPct: CAP_PCT };

  const { norm, headN, buildSireRows, findSireScore } = require('../scoring');
  const condRows = buildSireRows(conditionSireRows);
  const allRows  = buildSireRows(allSireRows);

  for (const row of racingFormRows) {
    const condScore = findSireScore(condRows, row.sire) || 0;
    const baseScore = findSireScore(allRows,  row.sire) || 0;
    const diff = condScore - baseScore;
    if (diff > 0) bonuses.set(row.horse_number, diff);
  }

  return { bonuses, capPct: CAP_PCT };
}

module.exports = { computeWetTrackBonuses, WET_CONDITIONS, CAP_PCT };
