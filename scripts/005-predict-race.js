#!/usr/bin/env node
/**
 * @file    005-predict-race.js
 * @pipeline [5/5 朝バッチ] スコアリング → 予想生成 → DB保存
 * @role    racing_form・jockey_ranking・sire_ranking を組み合わせてスコアを計算し、
 *          最高スコアの1頭を推奨馬として `prediction` テーブルへ保存する。
 *          モデル名: yosou-v1（MODEL_VERSION 定数）
 *
 * @input   DB: racing_form, jockey_ranking, sire_ranking
 * @output  DB: prediction (best horse_number + 全頭スコアを memo JSON に格納)
 * @calledby daily-yosou-batch.js [4] (004 の直後、並列実行)
 *
 * スコアロジック:
 *  1) jockey_ranking: 騎手名を頭3文字で前方一致照合してスコア加算
 *  2) sire_ranking: 父名を前方一致で照合してスコア加算
 *  3) 偶数馬番ボーナス: 馬番の値をそのまま加算
 *  4) 年齢ボーナス: 2歳+40 / 3歳+30 / 4歳+20
 *  5) 合計0点の場合は馬番を加算（フォールバック）
 *  6) 最高得点1頭を best として選出
 *
 * Usage:
 *   node 005-predict-race.js YYYYMMDDRRBB  (例: 202510130110)
 *
 * @copyright © 2026 IchikabuImpact
 * @license Commercial use prohibited without permission.
 */

const mysql = require('mysql2/promise');
const config = require('../config/config.js');

const [, , raceId] = process.argv;
if (!raceId || !/^\d{12}$/.test(raceId)) {
  console.error('Usage: node 005-predict-race.js YYYYMMDDRRBB');
  process.exit(1);
}
const year = Number(raceId.slice(0, 4));
const MODEL_VERSION = 'yosou-v1';

// 文字列正規化（空白系除去）
const norm = (s) => (s || '').replace(/\s+/g, ' ').replace(/[ 　\t]/g, '').trim();
// 先頭 n 文字（サロゲート対応）
const headN = (s, n) => Array.from(s || '').slice(0, n).join('');

// 独自スコア
function customScore(horse) {
  let bonus = 0;
  if (horse.horse_number % 2 === 0) bonus += horse.horse_number; // 偶数=馬番ボーナス
  const m = (horse.sex_age || '').match(/(\d+)/);
  if (m) {
    const age = parseInt(m[1], 10);
    if (age === 2) bonus += 40;
    else if (age === 3) bonus += 30;
    else if (age === 4) bonus += 20;
  }
  return bonus >>> 0;
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

    // 1) 出馬表（trainer_name も取得）
    const [rfRows] = await conn.execute(
      `SELECT
         horse_number,
         horse_name,
         jockey_name  AS jockey,
         trainer_name AS trainer,
         sire,
         sex_age
       FROM racing_form
       WHERE race_id = ?
       ORDER BY horse_number ASC`,
      [raceId]
    );
    if (!rfRows.length) throw new Error(`racing_form が空: race_id=${raceId}`);

    // 2) ジョッキーランキング（year あり）→ “頭3文字前方一致”インデックス
    const [jrRows] = await conn.execute(
      `SELECT jockey_name, score FROM jockey_ranking WHERE year = ?`,
      [year]
    );
    const jrPrefixMax = new Map();
    for (const r of jrRows) {
      const key = headN(norm(r.jockey_name), 3);
      const val = (r.score >>> 0);
      const cur = jrPrefixMax.get(key) || 0;
      if (val > cur) jrPrefixMax.set(key, val);
    }
    const jockeyScoreByName = (name) => {
      const key = headN(norm(name), 3);
      return jrPrefixMax.get(key) || 0;
    };

    // 3) トレーナーランキング（year あり）→ “頭3文字前方一致”インデックス
    const [trRows] = await conn.execute(
      `SELECT trainer_name, score FROM trainer_ranking WHERE year = ?`,
      [year]
    );
    const trPrefixMax = new Map();
    for (const r of trRows) {
      const key = headN(norm(r.trainer_name), 3);
      const val = (r.score >>> 0);
      const cur = trPrefixMax.get(key) || 0;
      if (val > cur) trPrefixMax.set(key, val);
    }
    const trainerScoreByName = (name) => {
      const key = headN(norm(name), 3);
      return trPrefixMax.get(key) || 0;
    };

    // 4) サイアーランキング（年なし）→ 同名MAX、前方一致
    const [srRowsRaw] = await conn.execute(
      `SELECT sire_name, MAX(score) AS score
         FROM sire_ranking
        GROUP BY sire_name`
    );
    const srRows = srRowsRaw
      .map(r => ({ sire_name: norm(r.sire_name), score: r.score >>> 0 }))
      .filter(r => r.sire_name.length > 0)
      .sort((a, b) => b.sire_name.length - a.sire_name.length); // 長い順で前方一致の誤爆抑制
    const sireScoreByText = (sireText) => {
      const S = norm(sireText);
      if (!S) return 0;
      for (const r of srRows) {
        const R = r.sire_name;
        if (S.startsWith(R) || R.startsWith(S)) return r.score;
      }
      return 0;
    };

    // 5〜7) スコア計算 & ベスト選定
    const calc = rfRows.map(row => {
      const jScore = jockeyScoreByName(row.jockey);
      const tScore = trainerScoreByName(row.trainer);
      const sScore = sireScoreByText(row.sire) || 0;
      const cScore = customScore({ horse_number: row.horse_number, sex_age: row.sex_age });
      let total = (jScore + tScore + sScore + cScore) >>> 0;
      if (total === 0) total += row.horse_number; // 0点救済
      return {
        horse_number: row.horse_number,
        horse_name: row.horse_name,
        score: total,
        breakdown: { jockey: jScore, trainer: tScore, sire: sScore, custom: cScore },
      };
    });

    calc.sort((a, b) => b.score - a.score || a.horse_number - b.horse_number);
    const best = calc[0];

    // 7) prediction 上書き保存（memo に全頭の内訳とベストを格納）
    const memo = {
      model: MODEL_VERSION,
      race_id: raceId,
      items: calc,
      best, // {horse_number, horse_name, score, breakdown}
      generatedAt: new Date().toISOString(),
    };

    // UNIQUE KEY (race_id, model_version) を利用してデッドロックなしで upsert
    await conn.execute(
      `INSERT INTO prediction (race_id, model_version, memo)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE
         model_version = VALUES(model_version),
         memo          = VALUES(memo)`,
      [raceId, MODEL_VERSION, JSON.stringify(memo)]
    );

    console.log(`[OK] race_id=${raceId} 推奨: 馬番${best.horse_number} (score=${best.score}) 内訳=${JSON.stringify(best.breakdown)}`);
  } catch (e) {
    console.error('[ERROR]', e && e.message ? e.message : e);
    process.exit(1);
  } finally {
    try { if (conn) await conn.end(); } catch { }
  }
})();
