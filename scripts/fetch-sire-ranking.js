#!/usr/bin/env node
/**
 * fetch-sire-ranking.js
 * JBIS の種牡馬ランキング（地方ダート平地）上位100件を取得し
 * sire_ranking テーブルへ UPSERT する。
 *
 * Usage:
 *   node fetch-sire-ranking.js <distance_m> [--condition <1-5|all|良|稍重|重|不良>]
 *
 *   condition の値:
 *     1 / all  = 総合（全馬場）※デフォルト
 *     2 / 良
 *     3 / 稍重
 *     4 / 重
 *     5 / 不良
 *
 *   例:
 *     node fetch-sire-ranking.js 1300
 *     node fetch-sire-ranking.js 1300 --condition 重
 *     node fetch-sire-ranking.js 1300 --condition 4
 */

'use strict';

const throttle = require('./lib/jbis-throttle');
const {
  TRACK_CONDITION_MAP,
  TRACK_CONDITION_CODES,
  buildSireRankingUrl,
  fetchHtml,
  parseSireRanking,
  saveSireRanking,
  scoreFromRank,
} = require('./lib/ranking/jbis-ranking');

function parseDistanceArg(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(
      'Usage: node fetch-sire-ranking.js <distance_m> [--condition <1-5|all|良|稍重|重|不良>]\n' +
      'Example: node fetch-sire-ranking.js 1300 --condition 重'
    );
  }
  return parsed;
}

function parseConditionArg(argv) {
  const idx = argv.indexOf('--condition');
  if (idx < 0) return { code: 1, label: 'all' };

  const raw = argv[idx + 1];
  if (!raw) throw new Error('--condition には値が必要です (1-5 または all/良/稍重/重/不良)');

  // 数値で指定
  const num = Number(raw);
  if (Number.isFinite(num) && TRACK_CONDITION_MAP[num]) {
    return { code: num, label: TRACK_CONDITION_MAP[num] };
  }

  // ラベル文字列で指定
  if (TRACK_CONDITION_CODES[raw] !== undefined) {
    return { code: TRACK_CONDITION_CODES[raw], label: raw };
  }

  throw new Error(`無効な --condition 値: "${raw}". 使用可能: 1-5 または ${Object.values(TRACK_CONDITION_MAP).join('/')}`);
}

async function main() {
  let distance, condition;
  try {
    distance  = parseDistanceArg(process.argv[2]);
    condition = parseConditionArg(process.argv);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }

  const url = buildSireRankingUrl(distance, condition.code);
  console.log(`[INFO] distance=${distance}m  condition=${condition.code}(${condition.label})`);
  console.log(`[INFO] url=${url}`);

  try {
    await throttle.waitForRateLimit();
    const html = await fetchHtml(url);
    await throttle.logRequest(url, true);

    const rows = parseSireRanking(html);
    console.log(`[INFO] scraped ${rows.length} rows`);
    if (!rows.length) throw new Error('0件しか取れませんでした（HTML構造変更の可能性）');

    const n = await saveSireRanking(rows, { distance, trackCondition: condition.label });
    console.log(`[OK] distance=${distance}m condition=${condition.label} → saved ${n} rows`);

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

module.exports = { parseDistanceArg, parseConditionArg };
