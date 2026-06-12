'use strict';

const BONUS   = 15;
const CAP_PCT = 10;

/**
 * LastKickFactor: 直近2走で上がり3Fが改善した馬にボーナスを付与。
 * agari_3f_1（直近1走）< agari_3f_2（直近2走）のとき改善と判定。
 * 上がり3Fは小さいほど速い。
 *
 * @param {Array<{horse_number, agari_3f_1, agari_3f_2}>} racingFormRows
 * @returns {{ bonuses: Map<number, number>, capPct: number }}
 */
function computeLastKickBonuses(racingFormRows) {
  const bonuses = new Map();
  for (const row of racingFormRows) {
    const a1 = row.agari_3f_1 != null ? Number(row.agari_3f_1) : null;
    const a2 = row.agari_3f_2 != null ? Number(row.agari_3f_2) : null;
    if (a1 != null && a2 != null && a1 < a2) {
      bonuses.set(row.horse_number, BONUS);
    }
  }
  return { bonuses, capPct: CAP_PCT };
}

module.exports = { computeLastKickBonuses, LAST_KICK_BONUS: BONUS, CAP_PCT };
