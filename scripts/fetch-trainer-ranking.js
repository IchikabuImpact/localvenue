#!/usr/bin/env node
/**
 * fetch-trainer-ranking.js
 * JBIS のリーディングトレーナーランキング（地方）を複数ページ取得し
 * trainer_ranking テーブルへ UPSERT する。
 *
 * Usage:
 *   node fetch-trainer-ranking.js [--division=<1|2|3>] [--year=YYYY] [--max-pages=N]
 *
 * division:  1=総合, 2=中央, 3=地方（既定=3）
 * year:      取得年度（既定=今年）
 * max-pages: 最大取得ページ数（既定=10, 1ページ=100件）
 *
 * @copyright © 2026 IchikabuImpact
 * @license Commercial use prohibited without permission.
 */

'use strict';

const throttle = require('./lib/jbis-throttle');
const { getOpt } = require('./lib/shared/cli-utils');
const {
  buildPeopleRankingUrl,
  fetchHtml,
  parsePeopleRanking,
  savePeopleRanking,
  scoreFromPosition,
} = require('./lib/ranking/jbis-ranking');

const now      = new Date();
const theYear  = Number(getOpt('year', ''))       || now.getFullYear();
const division = Number(getOpt('division', '3'));
const maxPages = Number(getOpt('max-pages', '10'));

function buildUrl(year, div, seqno) {
  return buildPeopleRankingUrl({ year, division: div, ranking: '9', sort: 'prize', order: 'D', seqno });
}

function parse(html) {
  return parsePeopleRanking(html, {
    hrefContains: '/horse/trainer/',
    nameKey: 'trainerName',
    maxRank: 99999,
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
  console.log(`[INFO] year=${theYear} division=${division} max-pages=${maxPages}`);

  let allRows = [];
  let seqno   = '';

  for (let page = 1; page <= maxPages; page++) {
    const url = buildUrl(theYear, division, seqno);
    console.log(`[INFO] page=${page} seqno=${seqno || '(first)'} url=${url}`);

    try {
      await throttle.waitForRateLimit();
      const html = await fetchHtml(url);
      await throttle.logRequest(url, true);

      const rows = parse(html);
      console.log(`[INFO] page=${page} → ${rows.length} rows`);

      if (!rows.length) break;

      allRows = allRows.concat(rows);

      if (rows.length < 100) break; // 最終ページ

      seqno = String(allRows.length + 1); // 次ページの先頭番号
    } catch (e) {
      await throttle.logRequest(buildUrl(theYear, division, seqno), false).catch(() => {});
      console.error(`[ERROR] page=${page}: ${e.message || e}`);
      break;
    }
  }

  if (!allRows.length) {
    console.error('[FATAL] 1件も取得できませんでした');
    process.exit(1);
  }

  // 同一調教師名が複数ページに現れた場合、最初の出現（最上位スコア）のみ残す
  const seen = new Set();
  const uniqueRows = allRows.filter(r => {
    if (seen.has(r.trainerName)) return false;
    seen.add(r.trainerName);
    return true;
  });

  console.log(`[INFO] total scraped: ${allRows.length} rows → unique: ${uniqueRows.length} rows`);
  const newPages = allRows.length / 100;
  if (uniqueRows.length <= 100) {
    console.log('[WARN] seqno ページネーションが効いていない可能性があります（全ページ同一データ）');
  }
  const n = await save(uniqueRows, theYear);
  console.log(`[OK] saved ${n} rows (position-based score: 1位→${scoreFromPosition(0)}, ${n}位→${scoreFromPosition(n - 1)})`);

  allRows.slice(0, 5).forEach((r, i) =>
    console.log(`  ${i + 1}位: ${r.trainerName} (score=${scoreFromPosition(i)})`)
  );
}

if (require.main === module) {
  main().catch(e => {
    console.error('[FATAL]', e.message || e);
    process.exit(1);
  });
}

module.exports = { buildUrl, parse, save };
