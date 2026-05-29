#!/usr/bin/env node
/** @file scripts/101-save-result-db.js */
'use strict';

const config = require('../config/config.js');
const { parseRaceIdArg } = require('./lib/result/rakuten-race-code');
const { RakutenResultClient } = require('./lib/result/rakuten-result-client');
const { MySqlResultRepository } = require('./lib/result/mysql-result-repository');
const { SaveResultUseCase } = require('./lib/result/save-result-use-case');

let race;
try { race = parseRaceIdArg(process.argv, '101-save-result-db.js'); }
catch (e) { console.error('Usage: node 101-save-result-db.js YYYYMMDDRRBB'); process.exit(1); }

const useCase = new SaveResultUseCase({
  resultClient: new RakutenResultClient(),
  resultRepository: new MySqlResultRepository({ mysqlConfig: config.mysql }),
  logger: console,
});

useCase.execute(race).catch(e => {
  if (e.exitCode === 2) { console.error(`[INFO] ${e.message}`); process.exit(2); }
  console.error('[ERROR]', e && e.message ? e.message : e);
  process.exit(1);
});
