#!/usr/bin/env node
'use strict';
const config = require('../config/config.js');
const { MySqlRoiRepository } = require('./lib/roi/mysql-roi-repository');
const { AggregateDailyRoiUseCase, parseTargetYmd } = require('./lib/roi/daily-roi-use-case');
let targetYmd;
try { targetYmd = parseTargetYmd(process.argv[2]); }
catch (e) { console.error(e.message); process.exit(1); }
const useCase = new AggregateDailyRoiUseCase({ roiRepository: new MySqlRoiRepository({ mysqlConfig: config.mysql }), logger: console });
useCase.execute({ targetYmd }).catch(e => { console.error('[ERROR]', e); process.exit(1); });
