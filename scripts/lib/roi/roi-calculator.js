'use strict';
const { safeJSON } = require('../evaluation/evaluation-calculator');
function softPowerNormalize(xs, T = 1.0) { const ys = xs.map(s => Math.max(0, Number(s || 0)) ** (1 / Math.max(1e-6, T))); const sum = ys.reduce((a, b) => a + b, 0) || 1; return ys.map(v => v / sum); }
function normalizeScores(items, key = 'score') { const xs = items.map(it => Math.max(0, Number(it[key] || 0))); const sum = xs.reduce((a, b) => a + b, 0) || 1; return xs.map(v => v / sum); }
function toYmd(s) { return s ? s.replace(/-/g, '') : s; }
function calculateRaceRoi({ raceId, modelVersion, items, payoutRows, mode = 'both', stake = 100, threshold = 1.0, useScoreForPlace = false, placeTemp = 1.0, placeMass = 1.0 }) {
  let usePwin = items.map(it => { const v = Number(it.p_win); return Number.isFinite(v) ? v : null; });
  if (!usePwin.some(v => v != null)) usePwin = normalizeScores(items, 'score');
  else usePwin = usePwin.map(v => (v == null ? 0 : Math.max(0, Math.min(1, v))));
  let pplace = items.map(it => { const v = Number(it.p_place); return Number.isFinite(v) ? v : null; });
  let hasPlaceProb = pplace.some(v => v != null);
  if (!hasPlaceProb && useScoreForPlace) { pplace = softPowerNormalize(items.map(it => it.score || 0), placeTemp).map(p => Math.min(1, p * placeMass)); hasPlaceProb = true; }
  else if (hasPlaceProb) pplace = pplace.map(v => (v == null ? 0 : Math.max(0, Math.min(1, v))));
  const winPay = new Map(payoutRows.filter(x => x.bet_type === 'WIN').map(x => [x.horse_number, x.payout]));
  const plcPay = new Map(payoutRows.filter(x => x.bet_type === 'PLACE').map(x => [x.horse_number, x.payout]));
  const rows = [];
  if (mode === 'both' || mode === 'win') {
    let stakeSum = 0, retSum = 0;
    items.forEach((it, idx) => { const payout = winPay.get(it.horse_number); if (!payout) return; if (Math.max(0, Math.min(1, Number(usePwin[idx] || 0))) * (payout / 100) >= threshold) { stakeSum += stake; retSum += payout * (stake / 100); } });
    rows.push({ race_id: raceId, model_version: modelVersion, strategy: 'ev_win', stake: Math.round(stakeSum), returned: Math.round(retSum), roi_pct: stakeSum ? Math.min(9999.99, retSum / stakeSum * 100) : 0 });
  }
  if ((mode === 'both' || mode === 'place') && hasPlaceProb) {
    let stakeSum = 0, retSum = 0;
    items.forEach((it, idx) => { const payout = plcPay.get(it.horse_number); if (!payout) return; if (Math.max(0, Math.min(1, Number(pplace[idx] || 0))) * (payout / 100) >= threshold) { stakeSum += stake; retSum += payout * (stake / 100); } });
    rows.push({ race_id: raceId, model_version: modelVersion, strategy: 'ev_place', stake: Math.round(stakeSum), returned: Math.round(retSum), roi_pct: stakeSum ? Math.min(9999.99, retSum / stakeSum * 100) : 0 });
  }
  return rows;
}
module.exports = { safeJSON, toYmd, softPowerNormalize, normalizeScores, calculateRaceRoi };
