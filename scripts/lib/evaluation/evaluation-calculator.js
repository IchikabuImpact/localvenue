'use strict';

function safeJSON(raw) {
  if (raw == null) return null;
  if (typeof raw === 'string') { try { return JSON.parse(raw); } catch { return null; } }
  if (Buffer.isBuffer(raw)) { try { return JSON.parse(raw.toString('utf8')); } catch { return null; } }
  if (typeof raw === 'object') return raw;
  return null;
}

// 馬複のペアを lo*100+hi でエンコード（lo < hi, 例: 3-5 → 305）
function quinellaKey(a, b) {
  return Math.min(a, b) * 100 + Math.max(a, b);
}

// 4頭ボックス = C(4,2) = 6組み合わせ = 6票
const QUINELLA_BOX_TICKETS = 6;

function evaluatePrediction({ raceId, prediction, resultRows, payoutRows, stakeWin = 0, stakePlace = 0, stakeQuinella = 0 }) {
  const memo    = safeJSON(prediction.memo);
  const bestNo  = memo?.best?.horse_number;
  const items   = Array.isArray(memo?.items) ? memo.items : [];

  // 着順ソート
  const actualOrder = [...resultRows]
    .sort((a, b) =>
      (a.official_finish_position ?? 9999) - (b.official_finish_position ?? 9999) ||
      (a.dead_heat_group ?? 0) - (b.dead_heat_group ?? 0) ||
      (a.dead_heat_order_in_group ?? 0) - (b.dead_heat_order_in_group ?? 0) ||
      a.horse_number - b.horse_number
    )
    .map(r => r.horse_number);

  // 払戻マップ
  const winPay   = new Map(payoutRows.filter(x => x.bet_type === 'WIN').map(x => [x.horse_number, x.payout]));
  const placePay = new Map(payoutRows.filter(x => x.bet_type === 'PLACE').map(x => [x.horse_number, x.payout]));
  const quinPay  = new Map(payoutRows.filter(x => x.bet_type === 'QUINELLA').map(x => [x.horse_number, x.payout]));

  const minPos  = Math.min(...resultRows.map(r => r.official_finish_position ?? 9999));
  const winners = resultRows
    .filter(r => (r.official_finish_position ?? 9999) === minPos)
    .sort((a, b) => a.horse_number - b.horse_number);

  // ── 単勝・複勝 ───────────────────────────────────────────────────
  const winHit    = !!bestNo && winPay.has(bestNo);
  const placeHit  = !!bestNo && placePay.has(bestNo);
  const winPayout   = winHit   ? (winPay.get(bestNo)   || 0) : 0;
  const placePayout = placeHit ? (placePay.get(bestNo)  || 0) : 0;

  const predictedOrder = items.length
    ? [...items].sort((a, b) => b.score - a.score || a.horse_number - b.horse_number).map(x => x.horse_number)
    : (bestNo ? [bestNo] : []);

  // ── 馬複4頭ボックス ──────────────────────────────────────────────
  // 上位4頭（score降順, 同点は馬番昇順）
  const top4 = [...items]
    .sort((a, b) => b.score - a.score || a.horse_number - b.horse_number)
    .slice(0, 4)
    .map(i => i.horse_number);

  const first  = actualOrder[0];
  const second = actualOrder[1];
  // 1着と2着が両方top4に含まれていれば的中
  const quinellaHit = top4.length >= 2
    && Number.isFinite(first)
    && Number.isFinite(second)
    && top4.includes(first)
    && top4.includes(second);

  let quinellaPayout = 0;
  if (quinellaHit && Number.isFinite(first) && Number.isFinite(second)) {
    quinellaPayout = quinPay.get(quinellaKey(first, second)) || 0;
  }

  // ── evalRow ──────────────────────────────────────────────────────
  const evalRow = {
    race_id: raceId,
    model_version: prediction.model_version,
    predicted_horse_number: bestNo ?? null,
    win_hit:   winHit,
    win_payout:   winPayout   || null,
    place_hit: placeHit,
    place_payout: placePayout || null,
    quinella_hit: quinellaHit,
    quinella_payout: quinellaPayout || null,
  };

  // ── ROI行 ────────────────────────────────────────────────────────
  const roiRows = [];
  if (stakeWin > 0) {
    const ret = winHit ? Math.round(winPayout * (stakeWin / 100)) : 0;
    roiRows.push({ race_id: raceId, model_version: prediction.model_version, strategy: 'single', stake: stakeWin, returned: ret, roi_pct: stakeWin ? ret / stakeWin * 100 : 0 });
  }
  if (stakePlace > 0) {
    const ret = placeHit ? Math.round(placePayout * (stakePlace / 100)) : 0;
    roiRows.push({ race_id: raceId, model_version: prediction.model_version, strategy: 'place', stake: stakePlace, returned: ret, roi_pct: stakePlace ? ret / stakePlace * 100 : 0 });
  }
  if (stakeQuinella > 0) {
    // 4頭ボックス6票 × per-ticket-stake
    const totalStake = QUINELLA_BOX_TICKETS * stakeQuinella;
    const ret = quinellaHit ? Math.round(quinellaPayout * (stakeQuinella / 100)) : 0;
    roiRows.push({ race_id: raceId, model_version: prediction.model_version, strategy: 'quinella', stake: totalStake, returned: ret, roi_pct: totalStake ? ret / totalStake * 100 : 0 });
  }

  return { memo, bestNo, actualOrder, predictedOrder, winners, winHit, placeHit, winPayout, placePayout, quinellaHit, quinellaPayout, top4, evalRow, roiRows };
}

module.exports = { safeJSON, quinellaKey, QUINELLA_BOX_TICKETS, evaluatePrediction };
