#!/usr/bin/env node
/**
 * @copyright © 2026 IchikabuImpact
 * @license Commercial use prohibited without permission.
 */

/**
 * Usage: node eval-prediction.js YYYYMMDDRRBB [--stake-win 100] [--stake-place 100]
 * node eval-prediction.js 202510130110  
 * - prediction.memo.best.horse_number を起点に、単勝/複勝の的中判定＆払戻を表示
 * - 判定は race_payouts の確定払戻で実施
 * - 予想なし=exit 2 / 結果なし=exit 3 / 正常=exit 0
 * - 保存は prediction_eval（スナップショット）＋ prediction_roi（single/place の2行のみ）
 */

const mysql = require('mysql2/promise');
const config = require('./config.js');

const [, , raceId] = process.argv;
if (!raceId || !/^\d{12}$/.test(raceId)) {
  console.error('Usage: node eval-prediction.js YYYYMMDDRRBB [--stake-win 100] [--stake-place 100]');
  process.exit(1);
}
function arg(name, def = null) {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : def;
}
const stakeWin = Number(arg('stake-win', 0)); // 0なら記録しない
const stakePlace = Number(arg('stake-place', 0));

async function upsertPredictionEval(conn, row) {
  const sql = `
    INSERT INTO prediction_eval
      (race_id, model_version, predicted_horse_number,
       win_hit, win_payout, place_hit, place_payout)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      predicted_horse_number = VALUES(predicted_horse_number),
      win_hit   = VALUES(win_hit),
      win_payout= VALUES(win_payout),
      place_hit = VALUES(place_hit),
      place_payout = VALUES(place_payout),
      updated_at = CURRENT_TIMESTAMP`;
  const params = [
    row.race_id, row.model_version, row.predicted_horse_number ?? null,
    row.win_hit ? 1 : 0, row.win_payout ?? null,
    row.place_hit ? 1 : 0, row.place_payout ?? null,
  ];
  await conn.execute(sql, params);
}

async function upsertPredictionROI(conn, row) {
  const sql = `
    INSERT INTO prediction_roi
      (race_id, model_version, strategy, stake, returned, roi_pct)
    VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      stake    = VALUES(stake),
      returned = VALUES(returned),
      roi_pct  = VALUES(roi_pct),
      updated_at = CURRENT_TIMESTAMP`;
  const params = [
    row.race_id, row.model_version, row.strategy,
    row.stake, row.returned, row.roi_pct,
  ];
  await conn.execute(sql, params);
}

(async function main() {
  let conn;
  try {
    conn = await mysql.createConnection({
      host: config.mysql.host || 'localhost',
      user: config.mysql.user,
      password: config.mysql.password,
      port: config.mysql.port,
      database: config.mysql.database || 'localkeiba',
      charset: 'utf8mb4',
    });

    // 1) 最新予想
    const [predRows] = await conn.execute(
      `SELECT model_version, memo, created_at
         FROM prediction
        WHERE race_id = ?
        ORDER BY created_at DESC
        LIMIT 1`,
      [raceId]
    );
    if (!predRows.length) {
      console.error('[MISS] 予想が見つかりません（prediction が空）');
      process.exit(2);
      return;
    }
    const pred = predRows[0];

    // memo の安全パース
    let memo = null;
    const raw = pred.memo;
    if (raw == null) {
      memo = null;
    } else if (typeof raw === 'string') {
      try { memo = JSON.parse(raw); } catch { memo = null; }
    } else if (Buffer.isBuffer(raw)) {
      try { memo = JSON.parse(raw.toString('utf8')); } catch { memo = null; }
    } else if (typeof raw === 'object') {
      memo = raw;
    }
    const bestNo = memo?.best?.horse_number;

    // 2) 結果
    const [resRows] = await conn.execute(
      `SELECT horse_number, horse_name, official_finish_position,
              dead_heat_group, dead_heat_order_in_group
         FROM race_results
        WHERE race_id = ?`,
      [raceId]
    );
    if (!resRows.length) {
      console.error('[MISS] 結果が見つかりません（race_results が空）');
      process.exit(3);
      return;
    }

    // 実着順（参考）
    const actualOrder = [...resRows]
      .sort((a, b) =>
        (a.official_finish_position ?? 9999) - (b.official_finish_position ?? 9999) ||
        (a.dead_heat_group ?? 0) - (b.dead_heat_group ?? 0) ||
        (a.dead_heat_order_in_group ?? 0) - (b.dead_heat_order_in_group ?? 0) ||
        a.horse_number - b.horse_number
      )
      .map(r => r.horse_number);

    // 3) 払戻（WIN/PLACE）
    const [payRows] = await conn.execute(
      `SELECT bet_type, horse_number, payout
         FROM race_payouts
        WHERE race_id = ? AND bet_type IN ('WIN','PLACE')`,
      [raceId]
    );
    const winPay = new Map(payRows.filter(x => x.bet_type === 'WIN').map(x => [x.horse_number, x.payout]));
    const placePay = new Map(payRows.filter(x => x.bet_type === 'PLACE').map(x => [x.horse_number, x.payout]));

    // 勝ち馬（参考）
    const minPos = Math.min(...resRows.map(r => r.official_finish_position ?? 9999));
    const winners = resRows
      .filter(r => (r.official_finish_position ?? 9999) === minPos)
      .sort((a, b) => a.horse_number - b.horse_number);
    const winnersText = winners.map(w => `馬番${w.horse_number}（${w.horse_name || ''}）`).join(', ');

    // 4) 的中判定（払戻テーブル基準）
    const winHit = !!bestNo && winPay.has(bestNo);
    const placeHit = !!bestNo && placePay.has(bestNo);
    const winPayout = winHit ? (winPay.get(bestNo) || 0) : 0; // 100円基準
    const placePayout = placeHit ? (placePay.get(bestNo) || 0) : 0;

    // 5) 予想順（参考）
    const predictedOrder = Array.isArray(memo?.items)
      ? [...memo.items].sort((a, b) => b.score - a.score || a.horse_number - b.horse_number).map(x => x.horse_number)
      : (bestNo ? [bestNo] : []);

    // 6) 出力
    console.log('=== EVAL RESULT ===');
    console.log(`race_id: ${raceId}`);
    console.log(`model : ${pred.model_version}  at ${pred.created_at.toISOString?.() || pred.created_at}`);
    console.log(`予想◎ : ${bestNo ? '馬番' + bestNo : '(不明)'}`);
    console.log(`結果  : 1着 ${winnersText}${winners.length > 1 ? '（同着）' : ''}`);
    console.log(`単勝   : ${winHit ? `的中 🎯（払戻 ${winPayout} 円/100円）` : '不的中 ❌'}`);
    console.log(`複勝   : ${placeHit ? `的中 🎯（払戻 ${placePayout} 円/100円）` : '不的中 ❌'}`);
    if (predictedOrder.length) console.log(`予想順: ${predictedOrder.slice(0, 5).join(' → ')} ...`);
    console.log(`実着順: ${actualOrder.slice(0, 5).join(' → ')} ...`);

    // --- スナップショット保存 ---
    await upsertPredictionEval(conn, {
      race_id: raceId,
      model_version: pred.model_version,
      predicted_horse_number: bestNo ?? null,
      win_hit: winHit,
      win_payout: winPayout || null,
      place_hit: placeHit,
      place_payout: placePayout || null,
    });

    // --- ROI保存：単勝/複勝の2行だけ ---
    if (stakeWin > 0) {
      const ret = winHit ? Math.round(winPayout * (stakeWin / 100)) : 0;
      const roiPct = stakeWin ? ((ret / stakeWin) * 100) : 0;
      await upsertPredictionROI(conn, {
        race_id: raceId,
        model_version: pred.model_version,
        strategy: 'single',
        stake: stakeWin,
        returned: ret,
        roi_pct: roiPct,
      });
    }
    if (stakePlace > 0) {
      const ret = placeHit ? Math.round(placePayout * (stakePlace / 100)) : 0;
      const roiPct = stakePlace ? ((ret / stakePlace) * 100) : 0;
      await upsertPredictionROI(conn, {
        race_id: raceId,
        model_version: pred.model_version,
        strategy: 'place',
        stake: stakePlace,
        returned: ret,
        roi_pct: roiPct,
      });
    }

    process.exit(0);
  } catch (e) {
    console.error('[ERROR]', e && e.message ? e.message : e);
    process.exit(1);
  } finally {
    try { await conn?.end(); } catch { }
  }
})();
