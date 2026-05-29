'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { parseYearMonth } = require('../../../scripts/lib/calendar/parse-year-month');

test('YYYYMMDD形式は年月だけを返す', () => {
  assert.deepEqual(parseYearMonth(['node', 'script', '20260523']), {
    year: '2026',
    month: '05',
  });
});

test('YYYYMM形式は年月を返す', () => {
  assert.deepEqual(parseYearMonth(['node', 'script', '202606']), {
    year: '2026',
    month: '06',
  });
});

test('YYYY M形式は月をゼロ埋めする', () => {
  assert.deepEqual(parseYearMonth(['node', 'script', '2026', '7']), {
    year: '2026',
    month: '07',
  });
});

test('年だけ指定した場合はnowの月を使う', () => {
  const now = new Date('2026-12-15T00:00:00Z');
  assert.deepEqual(parseYearMonth(['node', 'script', '2027'], now), {
    year: '2027',
    month: '12',
  });
});

test('引数なしの場合はnowの年月を使う', () => {
  const now = new Date('2026-05-29T00:00:00Z');
  assert.deepEqual(parseYearMonth(['node', 'script'], now), {
    year: '2026',
    month: '05',
  });
});
