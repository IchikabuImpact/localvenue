'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { computeDistanceBonuses, DISTANCE_BONUS, CAP_PCT } = require('../../../../scripts/lib/prediction/satellites/distance-factor');

const RACE_ID = '202605230131';

test('同距離での1着実績があればボーナス付与', async () => {
  const rows = [{ horse_number: 1, horse_name: 'A' }];
  const fetch = async () => [
    { official_finish_position: 1, distance_m: 1600 },
    { official_finish_position: 3, distance_m: 1800 },
  ];
  const result = await computeDistanceBonuses(rows, 1600, fetch, RACE_ID);
  assert.equal(result.bonuses.get(1), DISTANCE_BONUS);
  assert.equal(result.capPct, CAP_PCT);
});

test('同距離の着順が1着でなければボーナスなし', async () => {
  const rows = [{ horse_number: 2, horse_name: 'B' }];
  const fetch = async () => [
    { official_finish_position: 2, distance_m: 1600 },
    { official_finish_position: 3, distance_m: 1600 },
  ];
  const result = await computeDistanceBonuses(rows, 1600, fetch, RACE_ID);
  assert.equal(result.bonuses.has(2), false);
});

test('1着実績があっても距離が異なればボーナスなし', async () => {
  const rows = [{ horse_number: 3, horse_name: 'C' }];
  const fetch = async () => [
    { official_finish_position: 1, distance_m: 1800 },
  ];
  const result = await computeDistanceBonuses(rows, 1600, fetch, RACE_ID);
  assert.equal(result.bonuses.has(3), false);
});

test('過去データなしはボーナスなし', async () => {
  const rows = [{ horse_number: 4, horse_name: 'D' }];
  const fetch = async () => [];
  const result = await computeDistanceBonuses(rows, 1600, fetch, RACE_ID);
  assert.equal(result.bonuses.has(4), false);
});

test('距離情報なし（distanceM=null）はすべてスキップ', async () => {
  const rows = [{ horse_number: 5, horse_name: 'E' }];
  let called = false;
  const fetch = async () => { called = true; return [{ official_finish_position: 1, distance_m: 1600 }]; };
  const result = await computeDistanceBonuses(rows, null, fetch, RACE_ID);
  assert.equal(result.bonuses.size, 0);
  assert.equal(called, false);
});

test('複数頭の混在ケース', async () => {
  const rows = [
    { horse_number: 1, horse_name: 'A' },
    { horse_number: 2, horse_name: 'B' },
    { horse_number: 3, horse_name: 'C' },
  ];
  const data = {
    A: [{ official_finish_position: 1, distance_m: 1200 }], // 同距離1着
    B: [{ official_finish_position: 1, distance_m: 1800 }], // 異距離1着
    C: [{ official_finish_position: 2, distance_m: 1200 }], // 同距離2着
  };
  const fetch = async name => data[name];
  const result = await computeDistanceBonuses(rows, 1200, fetch, RACE_ID);
  assert.equal(result.bonuses.get(1), DISTANCE_BONUS);
  assert.equal(result.bonuses.has(2), false);
  assert.equal(result.bonuses.has(3), false);
});
