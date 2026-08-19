#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const config = require('../../config/config.js');
const { createPool } = require('../lib/db/pool-factory');
const { findSchemaDrift } = require('../lib/ops/schema-drift-check');

const schemaPath = path.resolve(__dirname, '../../data/schema.sql');

(async () => {
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  const pool = createPool(config.mysql);
  try {
    const drift = await findSchemaDrift({ pool, schemaSql });
    console.log(JSON.stringify({ ok: drift.length === 0, drift }, null, 2));
    process.exitCode = drift.length === 0 ? 0 : 1;
  } finally {
    await pool.end().catch(() => {});
  }
})().catch(e => {
  console.error('[FATAL]', e && e.message ? e.message : e);
  process.exit(1);
});
