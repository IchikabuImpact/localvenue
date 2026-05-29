#!/usr/bin/env node
/**
 * @file    daily-yosou-batch.js
 * @role    【朝バッチ オーケストレーター】 001〜005 を順番に実行して当日の予想を完成させる
 *
 * 実行順序:
 *   [1] 001-save-monthly-calendar.js   — 月間開催カレンダー取得
 *   [2] 002-save-race-count-by-date.js — 当日の会場別レース数取得
 *   [3] 003-list-race-ids.js           — 当日 race_id 一覧を取得
 *   [4] 004-racing-form-to-db.js       — 出馬表取得（並列: PARALLEL=2）
 *       005-predict-race.js            — 予想生成（004の直後、同一race_idで）
 *
 * @env  PARALLEL=2  並列実行数（デフォルト2）
 *       NODE_BIN    使用する node のパス（デフォルト "node"）
 *
 * Usage:
 *   node daily-yosou-batch.js           // JST 今日の開催分を対象
 *   node daily-yosou-batch.js 20251116  // 指定日の開催分を対象（YYYYMMDD）
 */

const path = require("path");
const { createBatchLogger, createNodeRunner, eachLimit, listRaceIds } = require('./lib/batch/batch-utils');
const { parseYmdOrToday } = require('./lib/shared/date-utils');

const NODE_BIN = process.env.NODE_BIN || "node";
const PARALLEL = Math.max(1, Number(process.env.PARALLEL || 2));

// このJSのある場所
const BASE = __dirname;

// 子スクリプトは scripts 配下にある想定
const SCRIPTS = {
  kaisai: path.join(BASE, "001-save-monthly-calendar.js"),
  saveCount: path.join(BASE, "002-save-race-count-by-date.js"),
  listRaceIds: path.join(BASE, "003-list-race-ids.js"),
  racingForm: path.join(BASE, "004-racing-form-to-db.js"),
  predict: path.join(BASE, "005-predict-race.js"),
};

const log = createBatchLogger();
const { runCaptureNode, runNode, runNodeWithCode } = createNodeRunner({
  nodeBin: NODE_BIN,
  cwd: BASE,
});

(async () => {
  // 引数に YYYYMMDD が来ていればそれを使い、なければ JST 今日
  const ymdArg = process.argv[2] || "";
  const ymd = parseYmdOrToday(ymdArg);

  log(`=== デイリー予想バッチ開始: ${ymd} (並列: ${PARALLEL}) ===`);

  // [1] 月間開催情報を更新（引数は YYYYMMDD だが、001-save-monthly-calendar.js 側で年月に解釈）
  log(`[1] ${path.basename(SCRIPTS.kaisai)} ${ymd}`);
  await runNode(SCRIPTS.kaisai, [ymd]);

  // [2] 当日分の会場ごとのレース数を取得・保存
  log(`[2] ${path.basename(SCRIPTS.saveCount)} ${ymd}`);
  await runNode(SCRIPTS.saveCount, [ymd]);

  // [3] 当日全レースの race_id を取得
  log(`[3] ${path.basename(SCRIPTS.listRaceIds)} ${ymd}`);
  const raceIds = await listRaceIds(runCaptureNode, SCRIPTS.listRaceIds, ymd);
  log(`[3] 取得RACEID: ${raceIds.length}件`);
  if (raceIds.length === 0) {
    log("本日レースなし。終了。");
    return;
  }

  // [4] 各レースについて 出馬表取り込み → 予想生成 を並列実行
  await eachLimit(raceIds, PARALLEL, async (raceId) => {
    log(`[racing-form] ${raceId}`);
    const formCode = await runNodeWithCode(SCRIPTS.racingForm, [raceId]);
    if (formCode !== 0) {
      // 1レース失敗してもバッチ全体を止めない（warningして次へ）
      log(`[warn] 004 exit=${formCode}: ${raceId} → スキップして続行`);
      return;
    }

    log(`[predict    ] ${raceId}`);
    const predCode = await runNodeWithCode(SCRIPTS.predict, [raceId]);
    if (predCode !== 0) {
      log(`[warn] 005 exit=${predCode}: ${raceId} → スキップして続行`);
      return;
    }
  });

  log(`=== デイリー予想バッチ完了: ${ymd} ===`);
})().catch((e) => {
  console.error(`[fatal] ${e.message}`);
  process.exit(1);
});
