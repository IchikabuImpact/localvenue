'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');

const kochi = require('../../../../scripts/lib/prediction/satellites/venue/31/running-style-factor');
const saga = require('../../../../scripts/lib/prediction/satellites/venue/32/running-style-factor');
const { loadVenueSatellites } = require('../../../../scripts/lib/prediction/satellites/venue/loader');

const rows = [
  { horse_number: 1, running_style: '先行', agari_3f_1: 40.2 },
  { horse_number: 2, running_style: '差し', agari_3f_1: 41.0 },
  { horse_number: 3, running_style: '追込', agari_3f_1: 41.0 },
];

test('高知800mのベース補正だけでは差しを過剰加点しない', async () => {
  const result = await kochi.compute(rows, { distanceM: 800 });
  assert.equal(result.bonuses.get(1), 8);
  assert.equal(result.bonuses.get(2), 6);
  assert.equal(result.bonuses.has(3), false);
});

test('高知は先行勢が多いと差しと追込にペース圧加点する', async () => {
  const result = await kochi.compute([
    { horse_number: 1, running_style: '逃げ' },
    { horse_number: 2, running_style: '先行' },
    { horse_number: 3, running_style: '先行' },
    { horse_number: 4, running_style: '差し', agari_3f_1: 41.5 },
    { horse_number: 5, running_style: '追込', agari_3f_1: 41.9 },
  ], { distanceM: 800 });
  assert.equal(result.bonuses.get(4), 16);
  assert.equal(result.bonuses.get(5), 4);
});

test('高知は先行勢が多くても上がりが足りない差しはペース圧加点しない', async () => {
  const result = await kochi.compute([
    { horse_number: 1, running_style: '逃げ' },
    { horse_number: 2, running_style: '先行' },
    { horse_number: 3, running_style: '先行' },
    { horse_number: 4, running_style: '差し', agari_3f_1: 43.0 },
  ], { distanceM: 800 });
  assert.equal(result.bonuses.get(4), 6);
});

test('高知は不良馬場で逃げが少なければ逃げを加点する', async () => {
  const result = await kochi.compute([
    { horse_number: 1, running_style: '逃げ' },
    { horse_number: 2, running_style: '差し' },
    { horse_number: 3, running_style: '追込' },
  ], { distanceM: 1300, trackCondition: '不良' });
  assert.equal(result.bonuses.get(1), 32);
  assert.equal(result.bonuses.get(2), 6);
  assert.equal(result.bonuses.get(3), 2);
});

test('高知1600mは差しと追込を先行より上に置く', async () => {
  const result = await kochi.compute(rows, { distanceM: 1600 });
  assert.equal(result.bonuses.get(1), 8);
  assert.equal(result.bonuses.get(2), 6);
  assert.equal(result.bonuses.get(3), 4);
});

test('佐賀1400mは差しを先行より上に置く', async () => {
  const result = await saga.compute(rows, { distanceM: 1400 });
  assert.equal(result.bonuses.get(1), 8);
  assert.equal(result.bonuses.get(2), 12);
  assert.equal(result.bonuses.get(3), 3);
});

test('会場コード31と32でサテライトが読み込まれる', async () => {
  const kochiFactors = await loadVenueSatellites('31', rows, { distanceM: 800 });
  const sagaFactors = await loadVenueSatellites('32', rows, { distanceM: 1400 });
  assert.equal(kochiFactors[0].name, 'kochi_running_style');
  assert.equal(sagaFactors[0].name, 'saga_running_style');
});
