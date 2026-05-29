'use strict';

function safeJSON(raw) {
  if (raw == null) return null;
  if (typeof raw === 'string') { try { return JSON.parse(raw); } catch { return null; } }
  if (Buffer.isBuffer(raw)) { try { return JSON.parse(raw.toString('utf8')); } catch { return null; } }
  if (typeof raw === 'object') return raw;
  return null;
}

function evaluatePrediction({ raceId, prediction, resultRows, payoutRows, stakeWin = 0, stakePlace = 0 }) {
  const memo = safeJSON(prediction.memo);
  const bestNo = memo?.best?.horse_number;
  const actualOrder = [...resultRows].sort((a, b) => (a.official_finish_position ?? 9999) - (b.official_finish_position ?? 9999) || (a.dead_heat_group ?? 0) - (b.dead_heat_group ?? 0) || (a.dead_heat_order_in_group ?? 0) - (b.dead_heat_order_in_group ?? 0) || a.horse_number - b.horse_number).map(r => r.horse_number);
  const winPay = new Map(payoutRows.filter(x => x.bet_type === 'WIN').map(x => [x.horse_number, x.payout]));
  const placePay = new Map(payoutRows.filter(x => x.bet_type === 'PLACE').map(x => [x.horse_number, x.payout]));
  const minPos = Math.min(...resultRows.map(r => r.official_finish_position ?? 9999));
  const winners = resultRows.filter(r => (r.official_finish_position ?? 9999) === minPos).sort((a, b) => a.horse_number - b.horse_number);
  const winHit = !!bestNo && winPay.has(bestNo);
  const placeHit = !!bestNo && placePay.has(bestNo);
  const winPayout = winHit ? (winPay.get(bestNo) || 0) : 0;
  const placePayout = placeHit ? (placePay.get(bestNo) || 0) : 0;
  const predictedOrder = Array.isArray(memo?.items) ? [...memo.items].sort((a, b) => b.score - a.score || a.horse_number - b.horse_number).map(x => x.horse_number) : (bestNo ? [bestNo] : []);
  const evalRow = { race_id: raceId, model_version: prediction.model_version, predicted_horse_number: bestNo ?? null, win_hit: winHit, win_payout: winPayout || null, place_hit: placeHit, place_payout: placePayout || null };
  const roiRows = [];
  if (stakeWin > 0) {
    const ret = winHit ? Math.round(winPayout * (stakeWin / 100)) : 0;
    roiRows.push({ race_id: raceId, model_version: prediction.model_version, strategy: 'single', stake: stakeWin, returned: ret, roi_pct: stakeWin ? ret / stakeWin * 100 : 0 });
  }
  if (stakePlace > 0) {
    const ret = placeHit ? Math.round(placePayout * (stakePlace / 100)) : 0;
    roiRows.push({ race_id: raceId, model_version: prediction.model_version, strategy: 'place', stake: stakePlace, returned: ret, roi_pct: stakePlace ? ret / stakePlace * 100 : 0 });
  }
  return { memo, bestNo, actualOrder, predictedOrder, winners, winHit, placeHit, winPayout, placePayout, evalRow, roiRows };
}
module.exports = { safeJSON, evaluatePrediction };
