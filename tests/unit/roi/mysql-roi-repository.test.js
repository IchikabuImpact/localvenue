'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { MySqlRoiRepository } = require('../../../scripts/lib/roi/mysql-roi-repository');

test('aggregateSummaryはprediction_roi_dailyから指定期間のROIを合算する', async () => {
  const calls = [];
  const repo = new MySqlRoiRepository({
    pool: {
      execute: async (sql, params) => {
        calls.push({ sql, params });
        return [[{ strategy: 'single', races: 10, invest_yen: 1000, return_yen: 1200, roi_percent: '120.00' }]];
      },
    },
  });

  const rows = await repo.aggregateSummary({ isoDate: '2026-07-15', periodDays: 30 });

  assert.equal(rows.length, 1);
  assert.match(calls[0].sql, /FROM prediction_roi_daily/);
  assert.match(calls[0].sql, /DATE_SUB\(\?, INTERVAL \? DAY\)/);
  assert.deepEqual(calls[0].params, ['2026-07-15', 29, '2026-07-15']);
});

test('upsertSummaryはprediction_roi_summaryへ30日サマリーを保存する', async () => {
  const calls = [];
  const repo = new MySqlRoiRepository({
    pool: {
      execute: async (sql, params) => {
        calls.push({ sql, params });
        return [[]];
      },
    },
  });

  await repo.upsertSummary({
    isoDate: '2026-07-15',
    periodDays: 30,
    row: { model_version: 'yosou-v1', strategy: 'single', races: 10, invest_yen: 1000, return_yen: 1200, roi_percent: '120.00' },
  });

  assert.match(calls[0].sql, /INSERT INTO prediction_roi_summary/);
  assert.deepEqual(calls[0].params, ['2026-07-15', 30, 'yosou-v1', 'single', 10, 1000, 1200, '120.00']);
});
