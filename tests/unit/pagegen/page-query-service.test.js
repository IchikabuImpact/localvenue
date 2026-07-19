'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { loadRaces, loadRoiSummary } = require('../../../scripts/lib/pagegen/page-query-service');

test('loadRaces joins first-place race_results per race without a global LIMIT', async () => {
  const queries = [];
  const pool = {
    async execute(sql, params) {
      queries.push({ sql, params });
      return [[
        { race_id: '202607150118', model_version: 'yosou-v1', memo: '{}', created_at: new Date('2026-07-15T01:00:00Z') },
        { race_id: '202607150124', model_version: 'yosou-v1', memo: '{}', created_at: new Date('2026-07-15T01:00:00Z') },
      ]];
    },
  };

  const races = await loadRaces(pool, '20260715', null);

  assert.equal(races.length, 2);
  assert.deepEqual(races.map(r => r.race_id), ['202607150118', '202607150124']);
  assert.match(queries[0].sql, /GROUP BY race_id/);
  assert.doesNotMatch(queries[0].sql, /official_finish_position\s*=\s*1\s+LIMIT\s+1/i);
});

test('loadRoiSummary reads the 30-day summary table for a target date', async () => {
  const queries = [];
  const pool = {
    async execute(sql, params) {
      queries.push({ sql, params });
      return [[{ strategy: 'single', roi_percent: '120.00' }]];
    },
  };

  const rows = await loadRoiSummary(pool, '2026-07-15', 30);

  assert.equal(rows.length, 1);
  assert.match(queries[0].sql, /prediction_roi_summary/);
  assert.deepEqual(queries[0].params, ['2026-07-15', 30]);
});
