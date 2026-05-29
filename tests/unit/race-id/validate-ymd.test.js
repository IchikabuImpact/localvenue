'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { isValidYmd, parseYmdArg } = require('../../../scripts/lib/race-id/validate-ymd');

test('isValidYmdはYYYYMMDDだけを許可する', () => {
  assert.equal(isValidYmd('20260523'), true);
  assert.equal(isValidYmd('2026-05-23'), false);
  assert.equal(isValidYmd('202605'), false);
  assert.equal(isValidYmd(undefined), false);
});

test('parseYmdArgはprocess.argv形式からYYYYMMDDを取り出す', () => {
  assert.equal(parseYmdArg(['node', 'script', '20260523']), '20260523');
});

test('parseYmdArgは不正な引数でUsageエラーを投げる', () => {
  assert.throws(() => parseYmdArg(['node', 'script']), /Usage: node 003-list-race-ids.js YYYYMMDD/);
  assert.throws(() => parseYmdArg(['node', 'script', '2026-05-23']), /Usage: node 003-list-race-ids.js YYYYMMDD/);
});
