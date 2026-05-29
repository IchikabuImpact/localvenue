#!/usr/bin/env node
/**
 * fetch-sire-ranking.js
 * JBIS の種牡馬ランキング（地方ダート平地）上位100件を取得し
 * sire_ranking テーブルへ UPSERT する。
 * （axios+cheerio版 — Selenium不使用）
 *
 * Usage:
 *   node fetch-sire-ranking.js <distance_m>
 *   例: node fetch-sire-ranking.js 1300
 *
 * @copyright © 2026 IchikabuImpact
 * @license Commercial use prohibited without permission.
 */

'use strict';

const throttle = require('./lib/jbis-throttle');
const {
  buildSireRankingUrl,
  fetchHtml,
  parseSireRanking,
  saveSireRanking,
  scoreFromRank,
} = require('./lib/ranking/jbis-ranking');

function parseDistanceArg(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error('Usage: node fetch-sire-ranking.js <distance_m>\nExample: node fetch-sire-ranking.js 1300');
  }
  return parsed;
}

function buildUrl(dist) {
  return buildSireRankingUrl(dist);
}

function parse(html) {
  return parseSireRanking(html);
}

async function save(rows, dist) {
  return saveSireRanking(rows, { distance: dist });
}

async function main() {
  let distance;
  try {
    distance = parseDistanceArg(process.argv[2]);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }

  const url = buildUrl(distance);
  console.log(`[INFO] distance=${distance}m`);
  console.log(`[INFO] url=${url}`);

  try {
    // レート制限: 前回リクエストから十分な間隔を空ける
    await throttle.waitForRateLimit();

    const html = await fetchHtml(url);
    await throttle.logRequest(url, true);

    const rows = parse(html);
    console.log(`[INFO] scraped ${rows.length} rows`);

    if (!rows.length) throw new Error('0件しか取れませんでした（HTML構造変更の可能性）');

    const n = await save(rows, distance);
    console.log(`[OK] distance=${distance}m → saved ${n} rows`);

    // 上位3件をログ表示
    rows.slice(0, 3).forEach((r) =>
      console.log(`  ${r.rank}位: ${r.sireName} (id=${r.sireId}, score=${scoreFromRank(r.rank)})`)
    );
  } catch (e) {
    await throttle.logRequest(url, false).catch(() => {});
    console.error('[FATAL]', e.message || e);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { buildUrl, parse, parseDistanceArg, save };
