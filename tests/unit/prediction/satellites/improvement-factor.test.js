'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { computeImprovementBonuses, IMPROVEMENT_BONUS } = require('../../../../scripts/lib/prediction/satellites/improvement-factor');

const RACE_ID = '202605230131';

test('前走より着順が改善した馬にボーナスを付与', async () => {
  const rows = [{ horse_number: 1, horse_name: 'A' }];
  // results[0]=最新(3着), results[1]=その前(5着) → 改善
  const fetch = async () => [
    { official_finish_position: 3 },
    { official_finish_position: 5 },
  ];
  const bonuses = await computeImprovementBonuses(rows, RACE_ID, fetch);
  assert.equal(bonuses.get(1), IMPROVEMENT_BONUS);
});

test('着順が悪化した場合はボーナスなし', async () => {
  const rows = [{ horse_number: 2, horse_name: 'B' }];
  const fetch = async () => [
    { official_finish_position: 5 },
    { official_finish_position: 2 },
  ];
  const bonuses = await computeImprovementBonuses(rows, RACE_ID, fetch);
  assert.equal(bonuses.has(2), false);
});

test('着順が同じ場合はボーナスなし', async () => {
  const rows = [{ horse_number: 3, horse_name: 'C' }];
  const fetch = async () => [
    { official_finish_position: 3 },
    { official_finish_position: 3 },
  ];
  const bonuses = await computeImprovementBonuses(rows, RACE_ID, fetch);
  assert.equal(bonuses.has(3), false);
});

test('過去データ1走分のみの場合はスキップ', async () => {
  const rows = [{ horse_number: 4, horse_name: 'D' }];
  const fetch = async () => [{ official_finish_position: 2 }];
  const bonuses = await computeImprovementBonuses(rows, RACE_ID, fetch);
  assert.equal(bonuses.has(4), false);
});

test('過去データなしの場合はスキップ', async () => {
  const rows = [{ horse_number: 5, horse_name: 'E' }];
  const fetch = async () => [];
  const bonuses = await computeImprovementBonuses(rows, RACE_ID, fetch);
  assert.equal(bonuses.has(5), false);
});

test('複数頭で混在するケース', async () => {
  const rows = [
    { horse_number: 1, horse_name: 'A' },
    { horse_number: 2, horse_name: 'B' },
    { horse_number: 3, horse_name: 'C' },
  ];
  const data = {
    A: [{ official_finish_position: 2 }, { official_finish_position: 4 }], // 改善
    B: [{ official_finish_position: 4 }, { official_finish_position: 2 }], // 悪化
    C: [],                                                                   // データなし
  };
  const fetch = async name => data[name];
  const bonuses = await computeImprovementBonuses(rows, RACE_ID, fetch);
  assert.equal(bonuses.get(1), IMPROVEMENT_BONUS);
  assert.equal(bonuses.has(2), false);
  assert.equal(bonuses.has(3), false);
});
