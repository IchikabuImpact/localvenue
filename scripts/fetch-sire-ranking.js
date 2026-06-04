#!/usr/bin/env node
/**
 * fetch-sire-ranking.js
 * JBIS の種牡馬ランキング（地方ダート平地）を最大200件取得し
 * sire_ranking テーブルへ UPSERT する。
 *
 * Usage:
 *   node fetch-sire-ranking.js <distance_m> [--condition <1-5|all|良|稍重|重|不良>] [--max-pages=N]
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
 *     node fetch-sire-ranking.js 1300 --condition 4 --max-pages=3
 */

'use strict';

const throttle = require('./lib/jbis-throttle');
const { getOpt } = require('./lib/shared/cli-utils');
const {
  TRACK_CONDITION_MAP,
  TRACK_CONDITION_CODES,
  buildSireRankingUrl,
  fetchHtml,
  parseSireRanking,
  saveSireRanking,
  scoreFromPosition,
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

  const num = Number(raw);
  if (Number.isFinite(num) && TRACK_CONDITION_MAP[num]) {
    return { code: num, label: TRACK_CONDITION_MAP[num] };
  }

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

  const maxPages = Number(getOpt('max-pages', '2'));  // デフォルト2ページ=200件

  console.log(`[INFO] distance=${distance}m  condition=${condition.code}(${condition.label})  max-pages=${maxPages}`);

  let allRows = [];
  let seqno   = '';

  for (let page = 1; page <= maxPages; page++) {
    const url = buildSireRankingUrl(distance, condition.code, new Date(), seqno);
    console.log(`[INFO] page=${page} seqno=${seqno || '(first)'} url=${url}`);

    try {
      await throttle.waitForRateLimit();
      const html = await fetchHtml(url);
      await throttle.logRequest(url, true);

      const rows = parseSireRanking(html);
      console.log(`[INFO] page=${page} → ${rows.length} rows`);

      if (!rows.length) break;

      allRows = allRows.concat(rows);

      if (rows.length < 100) break; // 最終ページ

      seqno = String(allRows.length + 1);
    } catch (e) {
      await throttle.logRequest(buildSireRankingUrl(distance, condition.code, new Date(), seqno), false).catch(() => {});
      console.error(`[ERROR] page=${page}: ${e.message || e}`);
      break;
    }
  }

  if (!allRows.length) {
    console.error('[FATAL] 1件も取得できませんでした（HTML構造変更の可能性）');
    process.exit(1);
  }

  // 同一sireIdが複数ページに現れた場合、最初の出現（最上位スコア）のみ残す
  const seen = new Set();
  const uniqueRows = allRows.filter(r => {
    if (seen.has(r.sireId)) return false;
    seen.add(r.sireId);
    return true;
  });

  console.log(`[INFO] total scraped: ${allRows.length} rows → unique: ${uniqueRows.length} rows`);
  if (allRows.length > 100 && uniqueRows.length <= 100) {
    console.log('[WARN] seqno ページネーションが効いていない可能性があります（全ページ同一データ）');
  }

  const n = await saveSireRanking(uniqueRows, { distance, trackCondition: condition.label });
  console.log(`[OK] distance=${distance}m condition=${condition.label} → saved ${n} rows (position-based score: 1位→${scoreFromPosition(0)}, ${n}位→${scoreFromPosition(n - 1)})`);

  uniqueRows.slice(0, 5).forEach((r, i) =>
    console.log(`  ${i + 1}位: ${r.sireName} (id=${r.sireId}, score=${scoreFromPosition(i)})`)
  );
}

if (require.main === module) {
  main().catch(e => {
    console.error('[FATAL]', e.message || e);
    process.exit(1);
  });
}

module.exports = { parseDistanceArg, parseConditionArg };
