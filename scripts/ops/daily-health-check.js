#!/usr/bin/env node
'use strict';

const path = require('path');
const config = require('../../config/config.js');
const { createPool } = require('../lib/db/pool-factory');
const { jstTodayYmd } = require('../lib/shared/date-utils');
const { collectDailyHealth, healthFailures } = require('../lib/ops/daily-health');

const ymd = process.argv[2] || jstTodayYmd();
const publicDir = path.resolve(__dirname, '../../public');

(async () => {
  const pool = createPool(config.mysql);
  try {
    const report = await collectDailyHealth({ pool, ymd, publicDir });
    const failures = healthFailures(report);
    console.log(JSON.stringify({ ok: failures.length === 0, failures, report }, null, 2));
    process.exitCode = failures.length === 0 ? 0 : 1;
  } finally {
    await pool.end().catch(() => {});
  }
})().catch(e => {
  console.error('[FATAL]', e && e.message ? e.message : e);
  process.exit(1);
});
