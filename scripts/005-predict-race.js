#!/usr/bin/env node
/**
 * @file    005-predict-race.js
 * @pipeline [5/5 朝バッチ] スコアリング → 予想生成 → DB保存
 *
 * Usage:
 *   node 005-predict-race.js YYYYMMDDRRBB  (例: 202510130110)
 *
 * exit codes:
 *   0  正常
 *   1  異常終了
 *   4  予想が既に存在するためスキップ（運用モード: config.debug = false）
 */
'use strict';

const config = require('../config/config.js');
const { parsePredictionRaceIdArg } = require('./lib/prediction/race-id');
const { createPool } = require('./lib/db/pool-factory');
const { MySqlPredictionRepository } = require('./lib/prediction/mysql-prediction-repository');
const { MySqlRacingFormRepository } = require('./lib/racing-form/mysql-racing-form-repository');
const { MySqlRankingRepository } = require('./lib/prediction/mysql-ranking-repository');
const { PredictRaceUseCase } = require('./lib/prediction/predict-race-use-case');

let race;
try {
  race = parsePredictionRaceIdArg(process.argv);
} catch (e) {
  console.error(e.message);
  process.exit(1);
}

const pool = createPool(config.mysql);

const useCase = new PredictRaceUseCase({
  predictionRepository: new MySqlPredictionRepository({ pool }),
  racingFormRepository: new MySqlRacingFormRepository({ pool }),
  rankingRepository:    new MySqlRankingRepository({ pool }),
  logger: console,
  debug: config.debug || false,
});

useCase.execute(race)
  .then(() => pool.end())
  .catch(e => {
    if (e.exitCode === 4) {
      console.log(`[SKIP] ${race.raceId}: ${e.message}`);
      pool.end().catch(() => {}).then(() => process.exit(4));
      return;
    }
    console.error('[ERROR]', e && e.message ? e.message : e);
    pool.end().catch(() => {}).then(() => process.exit(1));
  });
