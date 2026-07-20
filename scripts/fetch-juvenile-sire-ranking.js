#!/usr/bin/env node
/**
 * fetch-juvenile-sire-ranking.js
 * JBIS の2歳種牡馬ランキング（地方）上位100件を取得し
 * juvenile_sire_ranking テーブルへ UPSERT する。
 *
 * Usage:
 *   node fetch-juvenile-sire-ranking.js [--division=<1|2|3>] [--year=YYYY] [--ranking=2]
 */

'use strict';

const throttle = require('./lib/jbis-throttle');
const { getOpt } = require('./lib/shared/cli-utils');
const {
  buildJuvenileSireRankingUrl,
  fetchHtml,
  parseSireRanking,
  saveJuvenileSireRanking,
  scoreFromPosition,
} = require('./lib/ranking/jbis-ranking');

const now = new Date();
const theYear = Number(getOpt('year', '')) || now.getFullYear();
const division = Number(getOpt('division', '3'));
const ranking = Number(getOpt('ranking', '2'));

function buildUrl(year, div, rankingNo, seqno = '') {
  return buildJuvenileSireRankingUrl({
    year,
    division: div,
    ranking: rankingNo,
    seqno,
  });
}

async function main() {
  const seqno = '';
  const url = buildUrl(theYear, division, ranking, seqno);
  console.log(`[INFO] year=${theYear} division=${division} ranking=${ranking}`);
  console.log(`[INFO] url=${url}`);

  try {
    await throttle.waitForRateLimit();
    const html = await fetchHtml(url);
    await throttle.logRequest(url, true);

    const rows = parseSireRanking(html);
    console.log(`[INFO] scraped ${rows.length} rows`);
    if (!rows.length) throw new Error('0件しか取れませんでした（HTML構造変更またはランキング番号変更の可能性）');

    const n = await saveJuvenileSireRanking(rows, { year: theYear, division });
    console.log(`[OK] year=${theYear} division=${division} ranking=${ranking} -> saved ${n} rows`);

    rows.slice(0, 5).forEach((r, i) =>
      console.log(`  ${r.rank}位: ${r.sireName} (id=${r.sireId}, score=${scoreFromPosition(i)})`)
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

module.exports = { buildUrl };
