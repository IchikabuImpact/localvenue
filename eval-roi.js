#!/usr/bin/env node
/**
 * @copyright © 2026 IchikabuImpact
 * @license Commercial use prohibited without permission.
 */

/**
 * eval-roi.js
 * EV>=threshold の馬だけ均等BETしてROIを評価・保存
 *
 * Usage:
 *   node eval-roi.js --from 2025-10-13 --to 2025-10-13 [--model yosou-v1] [--stake 100] [--mode both|win|place] [--use-score-for-place] [--threshold 1.0]
 *
 * 前提:
 *   - prediction(race_id, model_version, memo(JSON), created_at)
 *     memo.items[] に { horse_number, p_win?, p_place?, score? } のいずれか
 *   - race_payouts(race_id, bet_type IN ('WIN','PLACE'), horse_number, payout)
 *   - prediction_roi(race_id, model_version, strategy, stake, returned, roi_pct)  ※PK: (race_id, model_version, strategy)
 */

const mysql = require('mysql2/promise');
const config = require('./config.js');

function arg(name, def = null) {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : def;
}
const FROM = arg('from', null);     // YYYY-MM-DD
const TO = arg('to', null);     // YYYY-MM-DD
const MODEL = arg('model', null);     // 例: yosou-v1（nullならモデルは指定しない）
const STAKE = Number(arg('stake', 100)); // 1頭あたり投資額
const MODE = (arg('mode', 'both') || 'both').toLowerCase(); // both|win|place
const USE_SCORE_FOR_PLACE = !!arg('use-score-for-place', null);
const PLACE_TEMP = Number(arg('place-temp', 1.0)) || 1.0;  // 例: 0.8
const PLACE_MASS = Number(arg('place-mass', 1.0)) || 1.0;  // 例: 3（複勝の想定当たり数）
const THRESH = Number(arg('threshold', 1.0)) || 1.0;

function softPowerNormalize(xs, T = 1.0) {
  // exp の代わりに s^(1/T) を使った疑似ソフトマックス（スコアが非負ならOK）
  const ys = xs.map(s => Math.max(0, Number(s || 0)) ** (1 / Math.max(1e-6, T)));
  const sum = ys.reduce((a, b) => a + b, 0) || 1;
  return ys.map(v => v / sum);
}
function toYmd(s) { return s ? s.replace(/-/g, '') : s; }
function safeJSON(raw) {
  if (raw == null) return null;
  if (typeof raw === 'string') { try { return JSON.parse(raw); } catch { return null; } }
  if (Buffer.isBuffer(raw)) { try { return JSON.parse(raw.toString('utf8')); } catch { return null; } }
  if (typeof raw === 'object') return raw;
  return null;
}
function normalizeScores(items, key = 'score') {
  const xs = items.map(it => Math.max(0, Number(it[key] || 0)));
  const sum = xs.reduce((a, b) => a + b, 0) || 1;
  return xs.map(v => v / sum);
}
async function upsertROI(conn, row) {
  const sql = `
    INSERT INTO prediction_roi (race_id, model_version, strategy, stake, returned, roi_pct)
    VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      stake=VALUES(stake),
      returned=VALUES(returned),
      roi_pct=VALUES(roi_pct),
      updated_at=CURRENT_TIMESTAMP`;
  const params = [row.race_id, row.model_version, row.strategy, row.stake, row.returned, row.roi_pct];
  await conn.execute(sql, params);
}

(async () => {
  const conn = await mysql.createConnection({
    host: config.mysql.host || 'localhost',
    user: config.mysql.user,
    password: config.mysql.password,
    port: config.mysql.port,
    database: config.mysql.database || 'localkeiba',
    charset: 'utf8mb4',
  });

  // 対象レース（prediction 起点で 先頭8桁=日付 で絞り込み）
  const where = [];
  const params = [];
  if (FROM && TO) {
    where.push('LEFT(CAST(p.race_id AS CHAR), 8) BETWEEN ? AND ?');
    params.push(toYmd(FROM), toYmd(TO));
  }
  if (MODEL) {
    where.push('p.model_version = ?');
    params.push(MODEL);
  }

  const [races] = await conn.execute(
    `SELECT DISTINCT p.race_id
       FROM prediction p
      ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
      ORDER BY p.race_id`, params
  );
  if (!races.length) {
    console.log('No target races.');
    await conn.end();
    process.exit(0);
  }

  let totalStakeWin = 0, totalRetWin = 0, totalStakePl = 0, totalRetPl = 0;

  for (const { race_id } of races) {
    // 最新の予測1件（モデル指定があればそのモデルに限定）
    const predParams = MODEL ? [race_id, MODEL] : [race_id];
    const [predRows] = await conn.execute(
      `SELECT model_version, memo, created_at
         FROM prediction
        WHERE race_id = ? ${MODEL ? 'AND model_version=?' : ''}
        ORDER BY created_at DESC
        LIMIT 1`,
      predParams
    );
    if (!predRows.length) continue;

    const model_version = predRows[0].model_version;
    const memo = safeJSON(predRows[0].memo);
    const items = Array.isArray(memo?.items) ? memo.items : [];
    if (!items.length) continue;

    // 予測確率の準備
    // p_win: あれば使う。なければ score 正規化で代替
    let usePwin = items.map(it => {
      const v = Number(it.p_win);
      return Number.isFinite(v) ? v : null;
    });
    if (!usePwin.some(v => v != null)) {
      usePwin = normalizeScores(items, 'score');
    } else {
      // 一部nullが混ざる場合は0埋め
      usePwin = usePwin.map(v => (v == null ? 0 : Math.max(0, Math.min(1, v))));
    }

    // p_place: あれば使う。無ければフラグONで score 正規化を代用
    let pplace = items.map(it => {
      const v = Number(it.p_place);
      return Number.isFinite(v) ? v : null;
    });
    let hasPlaceProb = pplace.some(v => v != null);
    if (!hasPlaceProb && USE_SCORE_FOR_PLACE) {
      // 1) 温度で上位を強調 → 2) 総和を PLACE_MASS に合わせてスケール（各値は最大1でクリップ）
      const base = softPowerNormalize(items.map(it => it.score || 0), PLACE_TEMP);
      let scaled = base.map(p => p * PLACE_MASS);
      scaled = scaled.map(p => Math.min(1, p)); // 1を超えないように
      pplace = scaled;
      hasPlaceProb = true;
    } else if (hasPlaceProb) {
      pplace = pplace.map(v => (v == null ? 0 : Math.max(0, Math.min(1, v))));
    }

    // 払戻（確定）
    const [payRows] = await conn.execute(
      `SELECT bet_type, horse_number, payout
         FROM race_payouts
        WHERE race_id=? AND bet_type IN ('WIN','PLACE')`, [race_id]
    );
    const winPay = new Map(payRows.filter(x => x.bet_type === 'WIN').map(x => [x.horse_number, x.payout]));
    const plcPay = new Map(payRows.filter(x => x.bet_type === 'PLACE').map(x => [x.horse_number, x.payout]));

    // === WIN: EV>=THRESH ===
    if (MODE === 'both' || MODE === 'win') {
      let stakeSum = 0, retSum = 0;
      items.forEach((it, idx) => {
        const p = Math.max(0, Math.min(1, Number(usePwin[idx] || 0)));
        const payout = winPay.get(it.horse_number); // 勝ち馬にのみ存在
        if (!payout) return; // 勝っていなければ回収0 & EV<THRESH扱い
        const ev = p * (payout / 100);
        if (ev >= THRESH) {
          stakeSum += STAKE;
          retSum += payout * (STAKE / 100);
        }
      });
      totalStakeWin += stakeSum;
      totalRetWin += retSum;
      await upsertROI(conn, {
        race_id, model_version,
        strategy: 'ev_win',
        stake: Math.round(stakeSum),
        returned: Math.round(retSum),
        roi_pct: stakeSum ? (retSum / stakeSum * 100) : 0
      });
    }

    // === PLACE: EV>=THRESH ===
    if ((MODE === 'both' || MODE === 'place') && hasPlaceProb) {
      let stakeSum = 0, retSum = 0;
      items.forEach((it, idx) => {
        const pp = Math.max(0, Math.min(1, Number(pplace[idx] || 0)));
        const payout = plcPay.get(it.horse_number); // 複勝圏内にのみ存在
        if (!payout) return;
        const ev = pp * (payout / 100);
        if (ev >= THRESH) {
          stakeSum += STAKE;
          retSum += payout * (STAKE / 100);
        }
      });
      totalStakePl += stakeSum;
      totalRetPl += retSum;
      await upsertROI(conn, {
        race_id, model_version,
        strategy: 'ev_place',
        stake: Math.round(stakeSum),
        returned: Math.round(retSum),
        roi_pct: stakeSum ? (retSum / stakeSum * 100) : 0
      });
    }
  }

  // サマリー表示
  if (MODE === 'both' || MODE === 'win') {
    const roi = totalStakeWin ? (totalRetWin / totalStakeWin * 100) : 0;
    console.log(`WIN EV>=${THRESH} : stake=${Math.round(totalStakeWin)} return=${Math.round(totalRetWin)} ROI=${roi.toFixed(2)}%`);
  }
  if (MODE === 'both' || MODE === 'place') {
    const roi = totalStakePl ? (totalRetPl / totalStakePl * 100) : 0;
    console.log(`PLACE EV>=${THRESH} : stake=${Math.round(totalStakePl)} return=${Math.round(totalRetPl)} ROI=${roi.toFixed(2)}%`);
  }

  await conn.end();
})().catch(e => { console.error(e); process.exit(1); });
