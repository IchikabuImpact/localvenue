'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { AggregateDailyRoiUseCase } = require('../../../scripts/lib/roi/daily-roi-use-case');

function silentLogger() { return { log() {}, warn() {}, error() {} }; }

const SAMPLE_ROWS = [
  { model_version: 'yosou-v1', strategy: 'single', races: 35, invest_yen: 3500, return_yen: 4200, roi_percent: '120.00' },
  { model_version: 'yosou-v1', strategy: 'place',  races: 35, invest_yen: 3500, return_yen: 2800, roi_percent: '80.00'  },
];

function makeRepo(overrides = {}) {
  return {
    connect:      async () => {},
    close:        async () => {},
    aggregateDaily: async () => SAMPLE_ROWS,
    upsertDaily:    async () => {},
    findDailyRows:  async () => SAMPLE_ROWS,
    ...overrides,
  };
}

// ── 正常系 ─────────────────────────────────────────────────────────
test('日次ROIを集計してDBに保存する', async () => {
  const upserted = [];
  const useCase = new AggregateDailyRoiUseCase({
    logger: silentLogger(),
    roiRepository: makeRepo({ upsertDaily: async ({ isoDate, row }) => upserted.push({ isoDate, row }) }),
  });

  const result = await useCase.execute({ targetYmd: '20260523' });

  assert.equal(result.isoDate, '2026-05-23');
  assert.equal(result.rows.length, 2);
  assert.equal(upserted.length, 2);
  assert.equal(upserted[0].isoDate, '2026-05-23');
});

// ── 集計データなし ──────────────────────────────────────────────────
test('ROIデータが空の場合に警告ログを出力する', async () => {
  const warnings = [];
  const logger = { log() {}, warn(msg) { warnings.push(msg); }, error() {} };
  const useCase = new AggregateDailyRoiUseCase({
    logger,
    roiRepository: makeRepo({
      aggregateDaily: async () => [],
      findDailyRows:  async () => [],
    }),
  });

  const result = await useCase.execute({ targetYmd: '20260523' });

  assert.equal(result.rows.length, 0);
  assert.ok(warnings.some(w => w.includes('No ROI data')));
});

// ── close() が必ず呼ばれる ─────────────────────────────────────────
test('エラー発生時も close() が呼ばれる', async () => {
  let closeCalled = false;
  const useCase = new AggregateDailyRoiUseCase({
    logger: silentLogger(),
    roiRepository: makeRepo({
      aggregateDaily: async () => { throw new Error('DB error'); },
      close: async () => { closeCalled = true; },
    }),
  });

  await useCase.execute({ targetYmd: '20260523' }).catch(() => {});
  assert.equal(closeCalled, true);
});

// ── single/place 片方のみ ─────────────────────────────────────────
test('singleのみのときplaceがないと警告する', async () => {
  const warnings = [];
  const logger = { log() {}, warn(msg) { warnings.push(msg); }, error() {} };
  const singleOnly = [SAMPLE_ROWS[0]]; // single のみ
  const useCase = new AggregateDailyRoiUseCase({
    logger,
    roiRepository: makeRepo({ aggregateDaily: async () => singleOnly, findDailyRows: async () => singleOnly }),
  });

  await useCase.execute({ targetYmd: '20260523' });
  assert.ok(warnings.some(w => w.includes("Missing 'place'")));
});
