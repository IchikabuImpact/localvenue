#!/usr/bin/env node
/**
 * fetch-trainer-ranking.js
 * JBIS のリーディングトレーナーランキング（地方）上位100件を取得し
 * trainer_ranking テーブルへ UPSERT する。
 * （axios+cheerio版 — Selenium不使用）
 *
 * Usage:
 *   node fetch-trainer-ranking.js [--division=<1|2|3>] [--year=YYYY]
 *
 * division: 1=総合, 2=中央, 3=地方（既定=3）
 * year:     取得年度（既定=今年）
 *
 * @copyright © 2026 IchikabuImpact
 * @license Commercial use prohibited without permission.
 */

'use strict';

const { getOpt } = require('./lib/shared/cli-utils');
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
    ranking: '9',
    sort: 'prize',
    order: 'D',
  });
}

function parse(html) {
  return parsePeopleRanking(html, {
    hrefContains: '/horse/trainer/',
    nameKey: 'trainerName',
    maxRank: 9999,
  });
}

async function save(rows, year) {
  return savePeopleRanking(rows, {
    year,
    table: 'trainer_ranking',
    nameColumn: 'trainer_name',
    nameKey: 'trainerName',
  });
}

async function main() {
  const url = buildUrl(theYear, division);
  console.log(`[INFO] year=${theYear} division=${division}`);
  console.log(`[INFO] url=${url}`);

  try {
    const html = await fetchHtml(url);
    const rows = parse(html);
    console.log(`[INFO] scraped ${rows.length} rows`);

    if (!rows.length) throw new Error('0件しか取れませんでした（HTML構造変更の可能性）');

    const n = await save(rows, theYear);
    console.log(`[OK] year=${theYear} division=${division} → saved ${n} rows`);

    // 上位5件をログ表示
    rows.slice(0, 5).forEach((r) =>
      console.log(`  ${r.rank}位: ${r.trainerName} (score=${scoreFromRank(r.rank)})`)
    );
  } catch (e) {
    console.error('[FATAL]', e.message || e);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { buildUrl, parse, save };
