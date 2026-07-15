'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { renderIndexPage } = require('../../../scripts/lib/pagegen/html-renderer');

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
