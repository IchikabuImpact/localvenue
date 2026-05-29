#!/usr/bin/env node
/**
 * @file    004-racing-form-to-db.js
 * @pipeline [4/5 朝バッチ] 出馬表スクレイピング → DB保存
 * @role    keiba.go.jp の DebaTable（出馬表）を取得・パースし、
 *          `racing_form` テーブルへ保存する。
 *
 * Usage:
 *   node 004-racing-form-to-db.js YYYYMMDDRRBB  (例: 202509141131)
 *
 * @copyright © 2026 IchikabuImpact
 * @license Commercial use prohibited without permission.
 */

'use strict';

const config = require('../config/config.js');
const { parseRaceIdArg } = require('./lib/racing-form/race-id');
const { KeibaDebaTableClient } = require('./lib/racing-form/keiba-deba-table-client');
const { RacingFormParser } = require('./lib/racing-form/racing-form-parser');
const { MySqlRacingFormRepository } = require('./lib/racing-form/mysql-racing-form-repository');
const { SaveRacingFormUseCase } = require('./lib/racing-form/save-racing-form-use-case');

let race;
try {
  race = parseRaceIdArg(process.argv, '004-racing-form-to-db.js');
} catch (e) {
  console.error('Usage: node 004-racing-form-to-db.js YYYYMMDDRRBB  (例: 202509141131)');
  process.exit(1);
}

const useCase = new SaveRacingFormUseCase({
  debaTableClient: new KeibaDebaTableClient(),
  racingFormParser: new RacingFormParser(),
  racingFormRepository: new MySqlRacingFormRepository({ mysqlConfig: config.mysql }),
  logger: console,
});

useCase.execute(race).catch(err => {
  console.error('[ERROR]', err?.message || err);
  process.exit(1);
});
