#!/usr/bin/env node
/**
 * 単複セット（単勝100 + 複勝100）の回収率を評価
 * Usage: node eval-roi.js 202510130110
 */

const mysql = require('mysql2/promise');
const config = require('./config.js');

const [, , raceId] = process.argv;
if (!raceId || !/^\d{12}$/.test(raceId)) {
  console.error('Usage: node eval-roi.js YYYYMMDDRRBB');
  process.exit(1);
}

function parseMemo(raw) {
  if (raw == null) return null;
  if (typeof raw === 'object' && !Buffer.isBuffer(raw)) return raw;
  if (Buffer.isBuffer(raw)) { try { return JSON.parse(raw.toString('utf8')); } catch { return null; } }
  if (typeof raw === 'string') { try { return JSON.parse(raw); } catch { return null; } }
  return null;
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

    // 1) 予想（最新1件）
    const [predRows] = await conn.execute(
      `SELECT race_id, model_version, memo, created_at
         FROM prediction
        WHERE race_id = ?
        ORDER BY created_at DESC
        LIMIT 1`,
      [raceId]
    );
    if (!predRows.length) {
      console.log('[INFO] 予想がありません。');
      process.exit(0);
    }
    const pred = predRows[0];
    const memo = parseMemo(pred.memo) || {};
    const modelVersion = pred.model_version || memo.model_version || memo.model || 'unknown';

    // 推奨馬（bestが無い場合はitems先頭）
    let predictedNumber = memo?.best?.horse_number ?? null;
    if (predictedNumber == null && Array.isArray(memo.items) && memo.items.length) {
      const top = [...memo.items].sort((a,b) => (b.score - a.score) || (a.horse_number - b.horse_number))[0];
      predictedNumber = top?.horse_number ?? null;
    }
    if (predictedNumber == null) {
      console.log('[WARN] 推奨馬が決められませんでした。');
      process.exit(0);
    }

    // 2) 払戻（WIN/PLACE）
    const [payRows] = await conn.execute(
      `SELECT bet_type, horse_number, payout
         FROM race_payouts
        WHERE race_id = ? AND horse_number = ? AND bet_type IN ('WIN','PLACE')`,
      [raceId, predictedNumber]
    );
    const win = payRows.find(r => r.bet_type === 'WIN');
    const plc = payRows.find(r => r.bet_type === 'PLACE');

    const invest = 200;
    const ret = (win?.payout ?? 0) + (plc?.payout ?? 0);
    const roi = invest > 0 ? (100.0 * ret / invest) : 0;

    // 3) 保存（prediction_roi）
    await conn.execute(
      `INSERT INTO prediction_roi
         (race_id, model_version, predicted_number, win_payout, place_payout, invest_yen, return_yen, roi_percent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         predicted_number = VALUES(predicted_number),
         win_payout      = VALUES(win_payout),
         place_payout    = VALUES(place_payout),
         invest_yen      = VALUES(invest_yen),
         return_yen      = VALUES(return_yen),
         roi_percent     = VALUES(roi_percent),
         updated_at      = CURRENT_TIMESTAMP`,
      [raceId, modelVersion, predictedNumber, win?.payout ?? null, plc?.payout ?? null, invest, ret, roi.toFixed(2)]
    );

    // 4) 表示
    console.log('=== ROI (単複セット) ===');
    console.log(`race_id   : ${raceId}`);
    console.log(`model     : ${modelVersion}`);
    console.log(`推奨馬    : 馬番${predictedNumber}`);
    console.log(`単勝払戻  : ${win?.payout ?? 0} 円`);
    console.log(`複勝払戻  : ${plc?.payout ?? 0} 円`);
    console.log(`投資額    : ${invest} 円`);
    console.log(`回収額    : ${ret} 円`);
    console.log(`回収率    : ${roi.toFixed(2)} %`);
    console.log('[DONE] prediction_roi に保存しました。');
  } catch (e) {
    console.error('[ERROR]', e && e.message ? e.message : e);
    process.exit(1);
  } finally {
    try { if (conn) await conn.end(); } catch {}
  }
})();
