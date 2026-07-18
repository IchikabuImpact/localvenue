'use strict';

/**
 * 佐賀競馬専用: 距離別の脚質ボーナス
 *
 * ローカルDBの回収率寄り集計では、1300mは先行の安定度、
 * 1400m/1750mは差しの回収率が比較的良い。極端に順位を壊さないよう
 * 高知より控えめな補正にする。
 *
 * capPct=10: コアスコアの10%上限
 */
const DEFAULT_BONUS_MAP = { 逃げ: 10, 先行: 8, 差し: 8, 追込: 3 };
const DISTANCE_BONUS_MAP = {
  900:  { 逃げ: 10, 先行: 8,  差し: 10, 追込: 0 },
  1300: { 逃げ: 14, 先行: 12, 差し: 8,  追込: 3 },
  1400: { 逃げ: 10, 先行: 8,  差し: 12, 追込: 3 },
  1750: { 逃げ: 8,  先行: 6,  差し: 10, 追込: 4 },
};
const CAP_PCT = 10;
const NAME = 'saga_running_style';

async function compute(racingFormRows, context = {}) {
  const map = DISTANCE_BONUS_MAP[Number(context.distanceM)] || DEFAULT_BONUS_MAP;
  const bonuses = new Map();
  for (const row of racingFormRows) {
    const bonus = map[row.running_style] ?? 0;
    if (bonus > 0) bonuses.set(row.horse_number, bonus);
  }
  return { name: NAME, bonuses, capPct: CAP_PCT };
}

module.exports = { compute, name: NAME, CAP_PCT, DISTANCE_BONUS_MAP, DEFAULT_BONUS_MAP };
