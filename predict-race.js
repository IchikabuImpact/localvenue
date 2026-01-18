#!/usr/bin/env node
/**
 * Usage: node predict-race.js 202510130110
 *
 * @copyright © 2026 IchikabuImpact
 * @license Commercial use prohibited without permission.
 *
 *  1) racing_form から出馬表を取得（正しい列名に対応）
 *  2) jockey_ranking(year) を“頭3文字の前方一致”で照合して加点
 *  3) sire_ranking を“前方一致”で照合して加点（年なし・同名は最大スコア）
 *  4) 独自ルールで加点
 *     - 偶数馬番にボーナス（加点=馬番）
 *     - 2歳:+40, 3歳:+30, 4歳:+20
 *  5) 総得点が0なら馬番を加算
 *  6) 最高得点の1頭を推奨
 *  7) prediction に上書き保存（memo に全頭の内訳JSON）
 */

const mysql = require('mysql2/promise');
const config = require('./config.js');

const [, , raceId] = process.argv;
if (!raceId || !/^\d{12}$/.test(raceId)) {
  console.error('Usage: node predict-race.js YYYYMMDDRRBB');
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

    // 1) 出馬表（列名をテーブルに合わせてASエイリアス）
    const [rfRows] = await conn.execute(
      `SELECT
         horse_number,
         horse_name,
         jockey_name AS jockey,
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

    // 3) サイアーランキング（年なし）→ 同名MAX、前方一致
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

    // 4〜6) スコア計算 & ベスト選定
    const calc = rfRows.map(row => {
      const jScore = jockeyScoreByName(row.jockey);
      const sScore = sireScoreByText(row.sire) || 0;
      const cScore = customScore({ horse_number: row.horse_number, sex_age: row.sex_age });
      let total = (jScore + sScore + cScore) >>> 0;
      if (total === 0) total += row.horse_number; // 0点救済
      return {
        horse_number: row.horse_number,
        horse_name: row.horse_name,
        score: total,
        breakdown: { jockey: jScore, sire: sScore, custom: cScore },
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

    await conn.beginTransaction();
    // race_id で上書きしたいので、現行スキーマでは DELETE→INSERT
    await conn.execute(`DELETE FROM prediction WHERE race_id = ?`, [raceId]);
    await conn.execute(
      `INSERT INTO prediction (race_id, model_version, memo)
       VALUES (?, ?, CAST(? AS JSON))`,
      [raceId, MODEL_VERSION, JSON.stringify(memo)]
    );
    await conn.commit();

    console.log(`[OK] race_id=${raceId} 推奨: 馬番${best.horse_number} (score=${best.score}) 内訳=${JSON.stringify(best.breakdown)}`);
  } catch (e) {
    try { if (conn) await conn.rollback(); } catch { }
    console.error('[ERROR]', e && e.message ? e.message : e);
    process.exit(1);
  } finally {
    try { if (conn) await conn.end(); } catch { }
  }
})();
