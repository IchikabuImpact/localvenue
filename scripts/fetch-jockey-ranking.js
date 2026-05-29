#!/usr/bin/env node
/**
 * fetch-jockey-ranking.js
 * JBIS のリーディングジョッキーランキング（地方）上位100件を取得し
 * jockey_ranking テーブルへ UPSERT する。
 * （axios+cheerio版 — Selenium不使用）
 *
 * Usage:
 *   node fetch-jockey-ranking.js [--division=<1|2|3>] [--year=YYYY]
 *
 * division: 1=総合, 2=中央, 3=地方（既定=3）
 * year:     取得年度（既定=今年）
 *
 * @copyright © 2026 IchikabuImpact
 * @license Commercial use prohibited without permission.
 */

'use strict';

const { getOpt } = require('./lib/shared/cli-utils');
const throttle = require('./lib/jbis-throttle');
const {
  buildPeopleRankingUrl,
  fetchHtml,
  parsePeopleRanking,
  savePeopleRanking,
  scoreFromRank,
} = require('./lib/ranking/jbis-ranking');

const now = new Date();
const theYear = Number(getOpt('year', '')) || now.getFullYear();
const division = Number(getOpt('division', '3')); // 1:総合 2:中央 3:地方

function buildUrl(year, div) {
  return buildPeopleRankingUrl({
    year,
    division: div,
    ranking: '8',
    sort: 'ranking',
    order: 'A',
  });
}

function parse(html) {
  return parsePeopleRanking(html, {
    hrefContains: '/horse/jockey/',
    nameKey: 'jockeyName',
    maxRank: 100,
  });
}

async function save(rows, year) {
  return savePeopleRanking(rows, {
    year,
    table: 'jockey_ranking',
    nameColumn: 'jockey_name',
    nameKey: 'jockeyName',
  });
}

async function main() {
  const url = buildUrl(theYear, division);
  console.log(`[INFO] year=${theYear} division=${division}`);
  console.log(`[INFO] url=${url}`);

  try {
    // レート制限: 前回リクエストから十分な間隔を空ける
    await throttle.waitForRateLimit();

    const html = await fetchHtml(url);
    await throttle.logRequest(url, true);

    const rows = parse(html);
    console.log(`[INFO] scraped ${rows.length} rows`);

    if (!rows.length) throw new Error('0件しか取れませんでした（HTML構造変更の可能性）');

    const n = await save(rows, theYear);
    console.log(`[OK] year=${theYear} division=${division} → saved ${n} rows`);

    // 上位5件をログ表示
    rows.slice(0, 5).forEach((r) =>
      console.log(`  ${r.rank}位: ${r.jockeyName} (score=${scoreFromRank(r.rank)})`)
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

module.exports = { buildUrl, parse, save };
