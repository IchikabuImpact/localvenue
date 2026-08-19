'use strict';
const mysql = require('mysql2/promise');
const config = require('../../config/config.js');

const SIRE_KEYS = ['sire', 'youngSireBoost', 'juvenileSireRankingBonus', 'summerSire', 'summerBroodmareSire', 'summerDamFamily'];
const SUMMER_ONLY_KEYS = ['summerSire', 'summerBroodmareSire', 'summerDamFamily', 'summerWeightAllowance'];
const OTHER_CORE_KEYS = ['jockey', 'trainer', 'custom'];

function sum(bd, keys) {
  return keys.reduce((s, k) => s + (Number(bd[k]) || 0), 0);
}

(async () => {
  const conn = await mysql.createConnection(config.mysql);
  const [rows] = await conn.execute(`
    SELECT p.race_id, p.memo, pe.win_hit, pe.place_hit
      FROM prediction p
      JOIN prediction_eval pe ON pe.race_id = p.race_id AND pe.model_version = p.model_version
     WHERE p.model_version = 'yosou-v1'
       AND LEFT(CAST(p.race_id AS CHAR), 8) >= '20260701'
  `);

  let n = 0;
  const agg = { hit: { n: 0, sire: 0, summer: 0, other: 0, total: 0, bodyweightAdj: 0 },
                miss: { n: 0, sire: 0, summer: 0, other: 0, total: 0, bodyweightAdj: 0 } };

  for (const r of rows) {
    const memo = typeof r.memo === 'string' ? JSON.parse(r.memo) : r.memo;
    const best = memo && memo.best;
    if (!best || !best.breakdown) continue;
    const bd = best.breakdown;
    const sireSum = sum(bd, SIRE_KEYS);
    const summerSum = sum(bd, SUMMER_ONLY_KEYS);
    const otherSum = sum(bd, OTHER_CORE_KEYS);
    const bucket = r.win_hit ? agg.hit : agg.miss;
    bucket.n++;
    bucket.sire += sireSum;
    bucket.summer += summerSum;
    bucket.other += otherSum;
    bucket.bodyweightAdj += Number(bd.bodyweightAdjustment) || 0;
    bucket.total += Number(best.score) || 0;
    n++;
  }

  console.log(`n=${n} (2026-07-01〜)`);
  for (const [label, b] of Object.entries(agg)) {
    console.log(`\n=== ◎馬の内訳平均 (${label}, n=${b.n}) ===`);
    console.log(`  sire系合計(sire+youngSireBoost+juvenileSireRank+summerSire/Broodmare/DamFamily): 平均${(b.sire / b.n).toFixed(1)} (score比 ${(b.sire / b.total * 100).toFixed(1)}%)`);
    console.log(`  うち夏季限定加点のみ(summerSire/Broodmare/DamFamily/WeightAllowance): 平均${(b.summer / b.n).toFixed(1)} (score比 ${(b.summer / b.total * 100).toFixed(1)}%)`);
    console.log(`  jockey+trainer+custom合計: 平均${(b.other / b.n).toFixed(1)} (score比 ${(b.other / b.total * 100).toFixed(1)}%)`);
    console.log(`  夏季馬体重倍率による増減(bodyweightAdjustment): 平均${(b.bodyweightAdj / b.n).toFixed(1)}`);
    console.log(`  総スコア平均: ${(b.total / b.n).toFixed(1)}`);
  }

  await conn.end();
})().catch(e => { console.error(e); process.exit(1); });
