#!/usr/bin/env node
/**
 * @file    daily-result-batch.js
 * @role    【夜バッチ オーケストレーター】 101〜104 + HTML生成 + git push を実行する
 *
 * 実行順序:
 *   [1] 003-list-race-ids.js           — 当日 race_id 一覧を取得
 *   [2] 101-save-result-db.js          — レース結果・払戻取得（並列: PARALLEL=2）
 *       102-eval-prediction.js         — 予想評価（101の直後、同一race_idで）
 *         ※ 101 exit 2（未確定）→ スキップ
 *         ※ 102 exit 2（予想なし）/ exit 3（結果なし）→ スキップ
 *   [3] 103-eval-roi.js                — ROI集計（--from --to で当日指定）
 *   [4] 104-aggregate-roi-daily.js     — 日次ROI集計
 *   [5] generate-daily-pages.js        — 静的HTML生成 + 古ファイル削除
 *
 * @env  PARALLEL=2       並列実行数（デフォルト2）
 *       STAKE_WIN=100    単勝賭け金（デフォルト100円）
 *       STAKE_PLACE=100  複勝賭け金（デフォルト100円）
 *       NODE_BIN         使用する node のパス
 *
 * Usage:
 *   node daily-result-batch.js           // JST 今日
 *   node daily-result-batch.js 20260119  // 指定日
 */

const path = require('path');
const { createBatchLogger, createNodeRunner, eachLimit, listRaceIds } = require('./lib/batch/batch-utils');
const { parseYmdOrToday, ymdToIso } = require('./lib/shared/date-utils');

const NODE_BIN = process.env.NODE_BIN || 'node';
const PARALLEL = Math.max(1, Number(process.env.PARALLEL || 2));
// 単勝・複勝の賭け金（円）。0にするとprediction_roiへの書き込みが行われずROI集計が空になる。
// 環境変数で上書き可能: STAKE_WIN=200 node daily-result-batch.js
const STAKE_WIN   = Number(process.env.STAKE_WIN   ?? 100);
const STAKE_PLACE = Number(process.env.STAKE_PLACE ?? 100);

const BASE = __dirname;

const SCRIPTS = {
  listRaceIds: path.join(BASE, '003-list-race-ids.js'),
  saveResult: path.join(BASE, '101-save-result-db.js'),
  evalPrediction: path.join(BASE, '102-eval-prediction.js'),
  evalRoi: path.join(BASE, '103-eval-roi.js'),
  aggregateDaily: path.join(BASE, '104-aggregate-roi-daily.js'),
  generatePages: path.join(BASE, 'generate-daily-pages.js'),
};

const log = createBatchLogger();
const { runCaptureNode, runNode, runNodeWithCode } = createNodeRunner({
  nodeBin: NODE_BIN,
  cwd: BASE,
});

function buildEvalPredictionArgs(raceId) {
  const args = [raceId];
  if (STAKE_WIN > 0) args.push('--stake-win', String(STAKE_WIN));
  if (STAKE_PLACE > 0) args.push('--stake-place', String(STAKE_PLACE));
  return args;
}

(async () => {
  const ymdArg = process.argv[2] || '';
  const ymd = parseYmdOrToday(ymdArg);

  log(`=== デイリー結果バッチ開始: ${ymd} (並列: ${PARALLEL}) ===`);

  log(`[1] ${path.basename(SCRIPTS.listRaceIds)} ${ymd}`);
  const raceIds = await listRaceIds(runCaptureNode, SCRIPTS.listRaceIds, ymd);
  log(`[1] 取得RACEID: ${raceIds.length}件`);
  if (raceIds.length === 0) {
    log('対象レースなし。終了。');
    return;
  }

  await eachLimit(raceIds, PARALLEL, async (raceId) => {
    log(`[save-result] ${raceId}`);
    const code = await runNodeWithCode(SCRIPTS.saveResult, [raceId]);
    if (code === 2) {
      log(`[skip] 結果未確定: ${raceId}`);
      return;
    }
    if (code !== 0) {
      // 1レース失敗してもバッチ全体を止めない（warningして次へ）
      log(`[warn] 101 exit=${code}: ${raceId} → スキップして続行`);
      return;
    }

    log(`[eval-pred ] ${raceId}`);
    const evalCode = await runNodeWithCode(SCRIPTS.evalPrediction, buildEvalPredictionArgs(raceId));
    if (evalCode === 2) {
      log(`[skip] 予想なし: ${raceId}`);
      return;
    }
    if (evalCode === 3) {
      log(`[skip] 結果なし: ${raceId}`);
      return;
    }
    if (evalCode !== 0) {
      log(`[warn] 102 exit=${evalCode}: ${raceId} → スキップして続行`);
      return;
    }
  });

  const iso = ymdToIso(ymd);
  log(`[roi] ${path.basename(SCRIPTS.evalRoi)} --from ${iso} --to ${iso}`);
  await runNode(SCRIPTS.evalRoi, ['--from', iso, '--to', iso]);

  log(`[agg] ${path.basename(SCRIPTS.aggregateDaily)} ${ymd}`);
  await runNode(SCRIPTS.aggregateDaily, [ymd]);

  log(`[web] ${path.basename(SCRIPTS.generatePages)} ${ymd}`);
  await runNode(SCRIPTS.generatePages, [ymd]);

  log(`=== デイリー結果バッチ完了: ${ymd} ===`);
})().catch((e) => {
  console.error(`[fatal] ${e.message}`);
  process.exit(1);
});
