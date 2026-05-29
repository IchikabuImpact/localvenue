const test = require('node:test');
const assert = require('node:assert/strict');
const { buildCutoffYmd, jstTodayYmd, parseYmdOrToday, ymdToIso } = require('../../../scripts/lib/shared/date-utils');

test('jstTodayYmd formats the JST calendar date', () => {
  assert.equal(jstTodayYmd(new Date('2026-05-28T16:00:00Z')), '20260529');
});

test('parseYmdOrToday keeps valid YYYYMMDD and falls back to JST today', () => {
  const now = new Date('2026-05-28T16:00:00Z');
  assert.equal(parseYmdOrToday('20260119', now), '20260119');
  assert.equal(parseYmdOrToday('bad', now), '20260529');
});

test('ymdToIso converts YYYYMMDD to ISO date', () => {
  assert.equal(ymdToIso('20260119'), '2026-01-19');
  assert.throws(() => ymdToIso('2026-01-19'), /invalid YYYYMMDD/);
});

test('buildCutoffYmd subtracts calendar days from a supplied Date', () => {
  assert.equal(buildCutoffYmd(30, new Date('2026-05-29T00:00:00Z')), '20260429');
});
