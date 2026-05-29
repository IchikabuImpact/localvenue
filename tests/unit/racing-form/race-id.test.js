'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { parseRaceId } = require('../../../scripts/lib/racing-form/race-id');
const { buildDebaTableUrl } = require('../../../scripts/lib/racing-form/deba-table-url');

test('parseRaceIdは12桁race_idを構成要素へ分解する', () => {
  assert.deepEqual(parseRaceId('202605230131'), {
    raceId: '202605230131', yyyymmdd: '20260523', raceNo: 1, babaCode: '31', year: 2026, yy: 26,
  });
});

test('buildDebaTableUrlは既存形式でURLを組み立てる', () => {
  assert.equal(
    buildDebaTableUrl({ yyyymmdd: '20260523', raceNo: 1, babaCode: '31' }),
    'https://www.keiba.go.jp/KeibaWeb/TodayRaceInfo/DebaTable?k_raceDate=2026%2F05%2F23&k_raceNo=1&k_babaCode=31'
  );
});
