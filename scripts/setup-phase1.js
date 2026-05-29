#!/usr/bin/env node
/**
 * @file scripts/setup-phase1.js
 * @description Creates the prediction_roi_daily table for Phase 1.
 */

const { setupPhase1 } = require('./lib/db/setup-phase1');

setupPhase1().catch((e) => {
  console.error('[ERROR]', e);
  process.exit(1);
});
