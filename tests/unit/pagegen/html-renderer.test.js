'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { renderIndexPage, renderRecoveryPage } = require('../../../scripts/lib/pagegen/html-renderer');

test('renderIndexPage shows confirmed and pending race counts in ROI summary', () => {
  const html = renderIndexPage({
    isoDate: '2026-07-15',
    races: [
      { race_id: '202607150118', memo: '{}', win_hit: 0 },
      { race_id: '202607150218', memo: '{}', win_hit: null },
    ],
    dailyRoi: [
      { strategy: 'single', roi_percent: '54.00', invest_yen: 100, return_yen: 54, races: 1 },
      { strategy: 'place', roi_percent: '86.00', invest_yen: 100, return_yen: 86, races: 1 },
    ],
    venueMap: new Map([['18', '浦和']]),
  });

  assert.match(html, /途中集計/);
  assert.match(html, /1\/2R/);
  assert.match(html, /未確定 1R/);
  assert.match(html, /1R確定分/);
});

test('renderRecoveryPage shows 30-day ROI summary cards', () => {
  const html = renderRecoveryPage({
    isoDate: '2026-07-15',
    dateStats: new Map(),
    roiSummary: [
      { strategy: 'single', roi_percent: '120.00', invest_yen: 1000, return_yen: 1200, races: 10 },
      { strategy: 'place', roi_percent: '80.00', invest_yen: 1000, return_yen: 800, races: 10 },
      { strategy: 'quinella', roi_percent: '150.00', invest_yen: 6000, return_yen: 9000, races: 10 },
    ],
  });

  assert.match(html, /直近30日サマリー/);
  assert.match(html, /単勝/);
  assert.match(html, /120\.00%/);
  assert.match(html, /合計/);
  assert.match(html, /137\.50%/);
});
