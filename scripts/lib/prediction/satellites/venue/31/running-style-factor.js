'use strict';

/**
 * 高知競馬専用: 距離別の脚質ボーナス + ペース圧補正
 *
 * ベースは前目を軽く評価する。逃げ/先行が多い組み合わせでは
 * 前が苦しくなる想定で、上がりを使える差し/追込だけを上乗せする。
 * 不良馬場かつ逃げ馬が少ない組み合わせでは逃げ切りを上乗せする。
 *
 * capPct=12: コアスコアの12%上限
 */
const DEFAULT_BONUS_MAP = { 逃げ: 12, 先行: 10, 差し: 4, 追込: 0 };
const DISTANCE_BONUS_MAP = {
  800:  { 逃げ: 8,  先行: 8,  差し: 6, 追込: 0 },
  1300: { 逃げ: 14, 先行: 14, 差し: 4, 追込: 0 },
  1400: { 逃げ: 12, 先行: 10, 差し: 6, 追込: 2 },
  1600: { 逃げ: 8,  先行: 8,  差し: 6, 追込: 4 },
};
const CAP_PCT = 12;
const NAME = 'kochi_running_style';
const PACE_PRESSURE_FRONT_RUNNERS = 3;
const PACE_PRESSURE_BONUS_MAP = { 差し: 10, 追込: 4 };
const USABLE_LATE_KICK_LIMITS = {
  800: 42.0,
  1300: 42.0,
  1400: 41.5,
  1600: 41.5,
};
const BAD_TRACK_SOLO_ESCAPE_MAX = 1;
const BAD_TRACK_ESCAPE_BONUS_MAP = { 逃げ: 18, 先行: 6 };

function bestAgari(row) {
  const vals = [row.agari_3f_1, row.agari_3f_2]
    .map(v => Number(v))
    .filter(Number.isFinite);
  return vals.length ? Math.min(...vals) : null;
}

function hasUsableLateKick(row, distanceM) {
  if (row.running_style !== '差し' && row.running_style !== '追込') return false;
  const agari = bestAgari(row);
  if (agari == null) return false;
  const limit = USABLE_LATE_KICK_LIMITS[Number(distanceM)] ?? 42.0;
  return agari <= limit;
}

async function compute(racingFormRows, context = {}) {
  const map = DISTANCE_BONUS_MAP[Number(context.distanceM)] || DEFAULT_BONUS_MAP;
  const frontCount = racingFormRows.filter(row => row.running_style === '逃げ' || row.running_style === '先行').length;
  const escapeCount = racingFormRows.filter(row => row.running_style === '逃げ').length;
  const badTrackEscapeMap = context.trackCondition === '不良' && escapeCount <= BAD_TRACK_SOLO_ESCAPE_MAX
    ? BAD_TRACK_ESCAPE_BONUS_MAP
    : {};
  const bonuses = new Map();
  for (const row of racingFormRows) {
    const paceBonus = frontCount >= PACE_PRESSURE_FRONT_RUNNERS && hasUsableLateKick(row, context.distanceM)
      ? (PACE_PRESSURE_BONUS_MAP[row.running_style] ?? 0)
      : 0;
    const bonus =
      (map[row.running_style] ?? 0) +
      paceBonus +
      (badTrackEscapeMap[row.running_style] ?? 0);
    if (bonus > 0) bonuses.set(row.horse_number, bonus);
  }
  return { name: NAME, bonuses, capPct: CAP_PCT };
}

module.exports = {
  compute,
  name: NAME,
  CAP_PCT,
  DISTANCE_BONUS_MAP,
  DEFAULT_BONUS_MAP,
  PACE_PRESSURE_FRONT_RUNNERS,
  PACE_PRESSURE_BONUS_MAP,
  USABLE_LATE_KICK_LIMITS,
  BAD_TRACK_SOLO_ESCAPE_MAX,
  BAD_TRACK_ESCAPE_BONUS_MAP,
  bestAgari,
  hasUsableLateKick,
};
