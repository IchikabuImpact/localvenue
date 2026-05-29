#!/usr/bin/env node
/**
 * @file    002-save-race-count-by-date.js
 * @pipeline [2/5 朝バッチ] 会場別レース数取得 → DB保存
 * @role    `calendar` テーブルから指定日の開催会場を取り出し、
 *          keiba.go.jp RaceList をスクレイピングして会場ごとの
 *          最終レース番号（＝レース数）を `race_count_by_date` へ保存する。
 *          ここで保存した値が 003 の race_id 生成の元になる。
 *
 * @input   DB: calendar / keiba.go.jp RaceList（HTML、SSR）
 * @output  DB: race_count_by_date (ymd, venue_code, total_races) / race_cnt (id, cnt)
 * @calledby daily-yosou-batch.js [2]
 *
 * Usage:
 *   node 002-save-race-count-by-date.js 20251116
 *   node 002-save-race-count-by-date.js 2025-09-14
 *   node 002-save-race-count-by-date.js          # 省略 → JST 今日
 *   node 002-save-race-count-by-date.js 20251116 31  # 1会場のみ強制実行
 *
 * @copyright © 2026 IchikabuImpact
 * @license Commercial use prohibited without permission.
 */

'use strict';

const config = require('../config/config.js');
const { normalizeDateArg } = require('./lib/race-count/normalize-date-arg');
const { parseOneVenueCode } = require('./lib/race-count/parse-one-code');
const { KeibaRaceListClient } = require('./lib/race-count/keiba-race-list-client');
const { RaceCountParser } = require('./lib/race-count/race-count-parser');
const { MySqlRaceCountRepository } = require('./lib/race-count/mysql-race-count-repository');
const { SaveRaceCountByDateUseCase } = require('./lib/race-count/save-race-count-by-date-use-case');

async function main() {
  const dateISO = normalizeDateArg(process.argv[2]);
  const oneVenueCode = parseOneVenueCode(process.argv[3]);

  const useCase = new SaveRaceCountByDateUseCase({
    raceListClient: new KeibaRaceListClient(),
    raceCountParser: new RaceCountParser(),
    raceCountRepository: new MySqlRaceCountRepository({ mysqlConfig: config.mysql }),
    logger: console,
  });

  await useCase.execute({ dateISO, oneVenueCode });
}

main().catch(err => {
  console.error('[FATAL]', err.message || err);
  process.exit(1);
});
