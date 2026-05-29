#!/usr/bin/env node
/**
 * @file    003-list-race-ids.js
 * @pipeline [3/5 朝バッチ / 夜バッチ共通] race_id 一覧を標準出力へ出力
 * @role    `race_count_by_date` から指定日の全 race_id を生成し、
 *          1行1件で stdout へ出す。バッチ間のパイプ連携専用スクリプト。
 *          race_id = YYYYMMDD(8) + RR(2桁レースNo) + BB(2桁NARコード) = 12桁
 *
 * @input   DB: race_count_by_date
 * @output  stdout: YYYYMMDDRRBB を1行1件（ファイルへの書き込みなし）
 * @calledby daily-yosou-batch.js [3] / daily-result-batch.js [1]
 *
 * Usage:
 *   node 003-list-race-ids.js YYYYMMDD
 *
 * @copyright © 2026 IchikabuImpact
 * @license Commercial use prohibited without permission.
 */

'use strict';

const config = require('../config/config.js');
const { parseYmdArg } = require('./lib/race-id/validate-ymd');
const { MySqlRaceIdRepository } = require('./lib/race-id/mysql-race-id-repository');
const { ListRaceIdsUseCase } = require('./lib/race-id/list-race-ids-use-case');

(async () => {
  let ymd;
  try {
    ymd = parseYmdArg(process.argv);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }

  const useCase = new ListRaceIdsUseCase({
    raceIdRepository: new MySqlRaceIdRepository({ mysqlConfig: config.mysql }),
    output: raceId => console.log(raceId),
    logger: console,
  });

  try {
    await useCase.execute({ ymd });
  } catch (e) {
    console.error('[fatal] 003-list-race-ids:', e.message || e);
    process.exit(1);
  }
})();
