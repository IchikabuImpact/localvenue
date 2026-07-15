'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { loadRaces } = require('../../../scripts/lib/pagegen/page-query-service');

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
