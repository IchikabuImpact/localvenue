#!/usr/bin/env node
/**
 * Usage: node eval-prediction.js 202510130110
 *  - prediction.memo の best.horse_number と race_results を突き合わせて評価
 *  - 予想なし/結果なしは exit code を分けて明示
 *    - 2: 予想が見つからない
 *    - 3: 結果が見つからない
 *    - 0: 照合完了（当たり/ハズレはメッセージで表示）
 */

const mysql = require('mysql2/promise');
const config = require('./config.js');
const [, , raceId] = process.argv;
if (!raceId || !/^\d{12}$/.test(raceId)) {
  console.error('Usage: node eval-prediction.js YYYYMMDDRRBB');
  process.exit(1);
}

(async function main () {
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

    // 1) 予想を取得（同一レースに複数あれば最新を採用）
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
 
    // 置き換え後:
    let memo = null;
    const raw = pred.memo;
    if (raw == null) {
    memo = null;
    } else if (typeof raw === 'string') {
    try { memo = JSON.parse(raw); } catch { memo = null; }
    } else if (Buffer.isBuffer(raw)) {
    try { memo = JSON.parse(raw.toString('utf8')); } catch { memo = null; }
    } else if (typeof raw === 'object') {
    // mysql2 は JSON 型を JS オブジェクトとして返すことがある
    memo = raw;
    }


    const bestNo = memo?.best?.horse_number;
    if (!bestNo) {
      console.error('[WARN] 予想はあるが memo.best.horse_number が読めません');
    }

    // 2) 結果を取得
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

    // 3) 勝ち馬(同着含む)の集合
    const minPos = Math.min(...resRows.map(r => r.official_finish_position ?? 9999));
    const winners = resRows
      .filter(r => (r.official_finish_position ?? 9999) === minPos)
      .sort((a,b) => a.horse_number - b.horse_number);

    // 4) 当たり判定
    const isHit = !!bestNo && winners.some(w => w.horse_number === bestNo);

    // 5) 追加情報（top3の比較など）
    const actualOrder = [...resRows]
      .sort((a,b) =>
        (a.official_finish_position ?? 9999) - (b.official_finish_position ?? 9999) ||
        (a.dead_heat_group ?? 0) - (b.dead_heat_group ?? 0) ||
        (a.dead_heat_order_in_group ?? 0) - (b.dead_heat_order_in_group ?? 0) ||
        a.horse_number - b.horse_number
      )
      .map(r => r.horse_number);

    const predictedOrder = Array.isArray(memo?.items)
      ? [...memo.items].sort((a,b) => b.score - a.score || a.horse_number - b.horse_number).map(x => x.horse_number)
      : (bestNo ? [bestNo] : []);

    // 6) 出力
    console.log('=== EVAL RESULT ===');
    console.log(`race_id: ${raceId}`);
    console.log(`model : ${pred.model_version}  at ${pred.created_at.toISOString?.() || pred.created_at}`);
    if (bestNo) {
      console.log(`予想◎ : 馬番${bestNo}`);
    } else {
      console.log('予想◎ : (不明)');
    }
    const winnersText = winners.map(w => `馬番${w.horse_number}（${w.horse_name || ''}）`).join(', ');
    console.log(`結果  : 1着 ${winnersText}${winners.length > 1 ? '（同着）' : ''}`);
    console.log(isHit ? '判定  : 的中 🎯' : '判定  : 不的中 ❌');

    // 参考（上位比較）
    if (predictedOrder.length) {
      console.log(`予想順: ${predictedOrder.slice(0,5).join(' → ')} ...`);
    }
    console.log(`実着順: ${actualOrder.slice(0,5).join(' → ')} ...`);

    process.exit(0);
  } catch (e) {
    console.error('[ERROR]', e && e.message ? e.message : e);
    process.exit(1);
  } finally {
    // noop
  }
})();
