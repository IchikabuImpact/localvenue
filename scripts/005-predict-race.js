#!/usr/bin/env node
/**
 * @file    005-predict-race.js
 * @pipeline [5/5 朝バッチ] スコアリング → 予想生成 → DB保存
 * @role    racing_form・jockey_ranking・sire_ranking を組み合わせてスコアを計算し、
 *          最高スコアの1頭を推奨馬として `prediction` テーブルへ保存する。
 *
 * Usage:
 *   node 005-predict-race.js YYYYMMDDRRBB  (例: 202510130110)
 *
 * @copyright © 2026 IchikabuImpact
 * @license Commercial use prohibited without permission.
 */

'use strict';

const config = require('../config/config.js');
const { parsePredictionRaceIdArg } = require('./lib/prediction/race-id');
const { MySqlPredictionRepository } = require('./lib/prediction/mysql-prediction-repository');
const { PredictRaceUseCase } = require('./lib/prediction/predict-race-use-case');

let race;
try {
  race = parsePredictionRaceIdArg(process.argv);
} catch (e) {
  console.error(e.message);
  process.exit(1);
}

const useCase = new PredictRaceUseCase({
  predictionRepository: new MySqlPredictionRepository({ mysqlConfig: config.mysql }),
  logger: console,
});

useCase.execute(race).catch(e => {
  console.error('[ERROR]', e && e.message ? e.message : e);
  process.exit(1);
});
