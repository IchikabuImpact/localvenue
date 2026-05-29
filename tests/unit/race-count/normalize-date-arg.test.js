'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeDateArg, toYmd } = require('../../../scripts/lib/race-count/normalize-date-arg');
const { parseOneVenueCode } = require('../../../scripts/lib/race-count/parse-one-code');

test('YYYYMMDDをYYYY-MM-DDへ正規化する', () => {
  assert.equal(normalizeDateArg('20260523'), '2026-05-23');
});

test('YYYY-MM-DDはYYYY-MM-DDとして正規化する', () => {
  assert.equal(normalizeDateArg('2026-05-23'), '2026-05-23');
});

test('引数なしはJST今日を返す', () => {
  const now = new Date('2026-05-28T15:30:00Z');
  assert.equal(normalizeDateArg(undefined, now), '2026-05-29');
});

test('不正日付形式はエラーにする', () => {
  assert.throws(() => normalizeDateArg('2026/05/23'), /Invalid date/);
});

test('toYmdはハイフンを除去する', () => {
  assert.equal(toYmd('2026-05-23'), '20260523');
});

test('parseOneVenueCodeは1〜3桁の数値だけを受け取る', () => {
  assert.equal(parseOneVenueCode('31'), 31);
  assert.equal(parseOneVenueCode(' 031 '), 31);
  assert.equal(parseOneVenueCode('abcd'), null);
  assert.equal(parseOneVenueCode(undefined), null);
});
