#!/usr/bin/env node
'use strict';
const config = require('../config/config.js');
const { MySqlEvaluationRepository } = require('./lib/evaluation/mysql-evaluation-repository');
const { EvaluatePredictionUseCase } = require('./lib/evaluation/evaluate-prediction-use-case');
const [, , raceId] = process.argv;
if (!raceId || !/^\d{12}$/.test(raceId)) { console.error('Usage: node eval-prediction.js YYYYMMDDRRBB [--stake-win 100] [--stake-place 100]'); process.exit(1); }
function arg(name, def = null) { const i = process.argv.indexOf(`--${name}`); return i >= 0 ? process.argv[i + 1] : def; }
const useCase = new EvaluatePredictionUseCase({ evaluationRepository: new MySqlEvaluationRepository({ mysqlConfig: config.mysql }), logger: console });
useCase.execute({ raceId, stakeWin: Number(arg('stake-win', 0)), stakePlace: Number(arg('stake-place', 0)) }).catch(e => {
  if (e.exitCode === 2) { console.error('[MISS] 予想が見つかりません（prediction が空）'); process.exit(2); }
  if (e.exitCode === 3) { console.error('[MISS] 結果が見つかりません（race_results が空）'); process.exit(3); }
  console.error('[ERROR]', e && e.message ? e.message : e); process.exit(1);
});
