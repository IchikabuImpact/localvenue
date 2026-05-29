#!/usr/bin/env node
'use strict';
const config = require('../config/config.js');
const { MySqlRoiRepository } = require('./lib/roi/mysql-roi-repository');
const { EvalRoiUseCase } = require('./lib/roi/eval-roi-use-case');
function arg(name, def = null) { const i = process.argv.indexOf(`--${name}`); return i >= 0 ? process.argv[i + 1] : def; }
const useCase = new EvalRoiUseCase({ roiRepository: new MySqlRoiRepository({ mysqlConfig: config.mysql }), logger: console });
useCase.execute({ from: arg('from', null), to: arg('to', null), model: arg('model', null), stake: Number(arg('stake', 100)), mode: (arg('mode', 'both') || 'both').toLowerCase(), threshold: Number(arg('threshold', 1.0)) || 1.0, useScoreForPlace: !!arg('use-score-for-place', null), placeTemp: Number(arg('place-temp', 1.0)) || 1.0, placeMass: Number(arg('place-mass', 1.0)) || 1.0 }).catch(e => { console.error(e); process.exit(1); });
