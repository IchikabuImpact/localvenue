'use strict';

/**
 * 高知競馬専用: 脚質ボーナス
 * 根拠: 高知は逃げ勝率32%・先行12%と突出して前残りコース。
 *
 * running_style → rawBonus:
 *   逃げ  +30
 *   先行  +15
 *   差し  +5
 *   追込  0
 *
 * capPct=15: コアスコアの15%上限
 */
const BONUS_MAP = { 逃げ: 30, 先行: 15, 差し: 5, 追込: 0 };
const CAP_PCT = 15;
const NAME = 'kochi_running_style';

async function compute(racingFormRows) {
  const bonuses = new Map();
  for (const row of racingFormRows) {
    const bonus = BONUS_MAP[row.running_style] ?? 0;
    if (bonus > 0) bonuses.set(row.horse_number, bonus);
  }
  return { name: NAME, bonuses, capPct: CAP_PCT };
}

module.exports = { compute, name: NAME };
