#!/usr/bin/env node
/**
 * fetch-trainer-ranking.js
 * JBIS のリーディングトレーナーランキング（地方）を CSV で取得し、
 * trainer_ranking テーブルの指定年度分を入れ替える。
 *
 * Usage:
 *   node fetch-trainer-ranking.js [--division=<1|2|3>] [--year=YYYY] [--scored=N]
 *
 * division:  1=総合, 2=中央, 3=地方（既定=3）
 * year:      取得年度（既定=今年）
 * scored:    予想用スコアを付ける上位人数（既定=100）。それより下は所属・成績だけ保存し score=0
 *
 * CSV は1回のダウンロードで全件そろう。調教師名の後ろの「(笠 松)」を所属（affiliation）として保存する。
 * CSV は URL の sort 指定に関係なく勝利数の順で返るため、取り込んだ後に収得賞金の順へ並べ直す。
 * 中央（所属=中央）の調教師は、地方の交流重賞で賞金が大きく上位に入ってしまうので、スコアを付けない。
 *
 * @copyright © 2026 IchikabuImpact
 * @license Commercial use prohibited without permission.
 */

'use strict';

const throttle = require('./lib/jbis-throttle');
const { getOpt } = require('./lib/shared/cli-utils');
const {
  buildPeopleRankingCsvUrl,
  fetchCsv,
  parseTrainerRankingCsv,
  saveTrainerRanking,
  scoreFromPosition,
} = require('./lib/ranking/jbis-ranking');

const now      = new Date();
const theYear  = Number(getOpt('year', ''))     || now.getFullYear();
const division = Number(getOpt('division', '3'));
const scored   = Number(getOpt('scored', '100')) || 100;

function buildUrl(year, div) {
  return buildPeopleRankingCsvUrl({ csvName: 'leadingTrainer', year, division: div, ranking: '9', sort: 'prize', order: 'D' });
}

function parse(csvText) {
  return parseTrainerRankingCsv(csvText);
}

async function save(rows, year) {
  return saveTrainerRanking(rows, { year, scoredCount: scored });
}

async function main() {
  console.log(`[INFO] year=${theYear} division=${division} scored=${scored}`);

  const url = buildUrl(theYear, division);
  console.log(`[INFO] url=${url}`);

  let rows;
  try {
    await throttle.waitForRateLimit();
    const text = await fetchCsv(url);
    await throttle.logRequest(url, true);
    rows = parse(text);
  } catch (e) {
    await throttle.logRequest(url, false).catch(() => {});
    throw e;
  }

  if (!rows.length) {
    console.error('[FATAL] 1件も取得できませんでした');
    process.exit(1);
  }

  // 同じ調教師名が複数回出た場合は、上の順位だけ残す
  const seen = new Set();
  const uniqueRows = rows.filter(r => {
    if (seen.has(r.trainerName)) return false;
    seen.add(r.trainerName);
    return true;
  });

  // 地方の調教師を収得賞金の順に並べ、その後ろに中央の調教師を置く（中央は score=0 になるよう scored を超える位置へ）
  const local   = uniqueRows.filter(r => r.affiliation !== '中央').sort((a, b) => (b.prizeMan ?? 0) - (a.prizeMan ?? 0));
  const central = uniqueRows.filter(r => r.affiliation === '中央');
  const ordered = local.concat(central);

  const n = await saveTrainerRanking(ordered, { year: theYear, scoredCount: Math.min(scored, local.length) });
  console.log(`[OK] saved ${n} rows（地方${local.length}人・中央${central.length}人。賞金上位${Math.min(scored, local.length)}人に score ${scoreFromPosition(0)}〜${scoreFromPosition(Math.min(scored, local.length) - 1)}、残りは score=0）`);

  ordered.slice(0, 5).forEach((r, i) =>
    console.log(`  ${i + 1}位: ${r.trainerName}（${r.affiliation ?? '-'}） score=${scoreFromPosition(i)}`)
  );
}

if (require.main === module) {
  main().catch(e => {
    console.error('[FATAL]', e.message || e);
    process.exit(1);
  });
}

module.exports = { buildUrl, parse, save };
