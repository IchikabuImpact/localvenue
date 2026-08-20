'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { renderIndexPage, renderRecoveryPage, renderDetailPage } = require('../../../scripts/lib/pagegen/html-renderer');

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

test('renderIndexPage omits the blog teaser when teaserHtml is not given', () => {
  const html = renderIndexPage({
    isoDate: '2026-07-15',
    races: [],
    dailyRoi: [],
    venueMap: new Map(),
  });

  assert.doesNotMatch(html, /blog-teaser/);
});

test('renderIndexPage inserts teaserHtml between the ROI summary and the race list', () => {
  const html = renderIndexPage({
    isoDate: '2026-07-15',
    races: [],
    dailyRoi: [],
    venueMap: new Map(),
    teaserHtml: '<section class="blog-teaser">MARKER</section>',
  });

  const roiIndex = html.indexOf('roi-summary');
  const teaserIndex = html.indexOf('blog-teaser');
  const raceListIndex = html.indexOf('race-list');

  assert.ok(roiIndex !== -1 && teaserIndex !== -1 && raceListIndex !== -1);
  assert.ok(roiIndex < teaserIndex, 'teaser should come after the ROI summary');
  assert.ok(teaserIndex < raceListIndex, 'teaser should come before the race list');
});

test('renderIndexPage shows "予想なしのため対象外" instead of "未確定" when results exist without a prediction', () => {
  const html = renderIndexPage({
    isoDate: '2026-08-18',
    races: [
      { race_id: '202608180118', memo: null, win_hit: null, place_hit: null, finish_summary: '1着:5 テストホース / 2着:3 サンプルホース' },
    ],
    dailyRoi: [],
    venueMap: new Map([['18', '浦和']]),
  });

  assert.match(html, /単勝: 予想なしのため対象外/);
  assert.doesNotMatch(html, /単勝: 未確定/);
});

test('renderIndexPage keeps "未確定" when there is no prediction and no finish result yet', () => {
  const html = renderIndexPage({
    isoDate: '2026-08-20',
    races: [
      { race_id: '202608200118', memo: null, win_hit: null, place_hit: null, finish_summary: null },
    ],
    dailyRoi: [],
    venueMap: new Map([['18', '浦和']]),
  });

  assert.match(html, /単勝: 未確定/);
});

test('renderDetailPage shows finish order when there is no prediction but race_results exist', () => {
  const html = renderDetailPage({
    race: {
      race_id: '202608180118',
      memo: null,
      win_hit: null,
      place_hit: null,
      finish_summary: '1着:5 テストホース / 2着:3 サンプルホース / 3着:7 ダミーホース',
    },
    venueMap: new Map([['18', '浦和']]),
  });

  assert.match(html, /予想なしのため的中判定は対象外/);
  assert.match(html, /1着:5 テストホース \/ 2着:3 サンプルホース \/ 3着:7 ダミーホース/);
});

test('renderDetailPage shows neither eval nor finish-order section when nothing is confirmed yet', () => {
  const html = renderDetailPage({
    race: { race_id: '202608200118', memo: null, win_hit: null, place_hit: null, finish_summary: null },
    venueMap: new Map([['18', '浦和']]),
  });

  assert.doesNotMatch(html, /result-info/);
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
