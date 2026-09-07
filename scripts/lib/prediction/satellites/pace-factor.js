'use strict';

/**
 * PaceFactor: 出走馬の脚質構成からレースのペース（ハイ/ミドル/スロー）を推定し、
 * そのペースに適性のある脚質にボーナスを付与する。
 *
 * frontCount（逃げ+先行の頭数）で判定:
 *   frontCount >= 4 → ハイペース（前が競り合って垂れやすい。差し・追込を優遇）
 *   frontCount <= 1 → スローペース（楽な逃げになりやすい。逃げ・先行を優遇）
 *   それ以外        → ミドルペース（小幅な逃げ・差し寄りの補正）
 *
 * capPct=10: コアスコアの10%上限
 */
const CAP_PCT = 10;
const NAME = 'pace';

const HIGH_PACE_FRONT_THRESHOLD = 4;
const SLOW_PACE_FRONT_THRESHOLD = 1;

const PACE_BONUS_MAP = {
  high:   { 逃げ: 0,  先行: 0,  差し: 15, 追込: 12 },
  slow:   { 逃げ: 15, 先行: 10, 差し: 0,  追込: 0  },
  middle: { 逃げ: 5,  先行: 5,  差し: 8,  追込: 3  },
};

function classifyPace(racingFormRows) {
  let frontCount = 0;
  for (const row of racingFormRows) {
    if (row.running_style === '逃げ' || row.running_style === '先行') frontCount++;
  }
  if (frontCount >= HIGH_PACE_FRONT_THRESHOLD) return 'high';
  if (frontCount <= SLOW_PACE_FRONT_THRESHOLD) return 'slow';
  return 'middle';
}

function computePaceBonuses(racingFormRows) {
  const paceType = classifyPace(racingFormRows);
  const map = PACE_BONUS_MAP[paceType];
  const bonuses = new Map();
  for (const row of racingFormRows) {
    const bonus = map[row.running_style] ?? 0;
    if (bonus > 0) bonuses.set(row.horse_number, bonus);
  }
  return { name: NAME, paceType, bonuses, capPct: CAP_PCT };
}

module.exports = {
  computePaceBonuses,
  classifyPace,
  PACE_BONUS_MAP,
  CAP_PCT,
  NAME,
  HIGH_PACE_FRONT_THRESHOLD,
  SLOW_PACE_FRONT_THRESHOLD,
};
