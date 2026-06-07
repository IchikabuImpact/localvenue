'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { computeWetTrackBonuses, WET_CONDITIONS, CAP_PCT } = require('../../../../scripts/lib/prediction/satellites/wet-track-factor');

// buildSireRows が scoreFromPosition でスコアを計算するため、
// sire_ranking テーブルの行と同じ形式で渡す。
// score フィールドは sire_ranking.score（数値）を想定。
function sireRow(sireName, score) {
  return { sire_name: sireName, score };
}

test('WET_CONDITIONS に 重 と 不良 が含まれる', () => {
  assert.equal(WET_CONDITIONS.has('重'), true);
  assert.equal(WET_CONDITIONS.has('不良'), true);
  assert.equal(WET_CONDITIONS.has('良'), false);
  assert.equal(WET_CONDITIONS.has('稍重'), false);
});

test('良馬場のときはボーナスなし・capPctのみ返す', () => {
  const rows = [{ horse_number: 1, sire: 'サイアーA' }];
  const result = computeWetTrackBonuses(rows, '良', [], []);
  assert.equal(result.bonuses.size, 0);
  assert.equal(result.capPct, CAP_PCT);
});

test('重馬場で条件スコア > allスコアの場合にボーナス付与', () => {
  const rows = [{ horse_number: 1, sire: 'サイアーA' }];
  // conditionSireRows: score=80, allSireRows: score=60 → diff=20
  const condRows = [sireRow('サイアーA', 80)];
  const allRows  = [sireRow('サイアーA', 60)];
  const result = computeWetTrackBonuses(rows, '重', condRows, allRows);
  assert.equal(result.bonuses.get(1), 20);
  assert.equal(result.capPct, CAP_PCT);
});

test('条件スコア <= allスコアの場合はボーナスなし', () => {
  const rows = [{ horse_number: 2, sire: 'サイアーB' }];
  const condRows = [sireRow('サイアーB', 50)];
  const allRows  = [sireRow('サイアーB', 70)];
  const result = computeWetTrackBonuses(rows, '重', condRows, allRows);
  assert.equal(result.bonuses.has(2), false);
});

test('条件スコアのデータなし（条件スコア0）はボーナスなし', () => {
  const rows = [{ horse_number: 3, sire: 'サイアーC' }];
  const condRows = []; // 条件スコアなし → 0
  const allRows  = [sireRow('サイアーC', 60)];
  const result = computeWetTrackBonuses(rows, '不良', condRows, allRows);
  assert.equal(result.bonuses.has(3), false);
});

test('allスコアのデータなし（ベース0）は条件スコアがそのままdiff', () => {
  const rows = [{ horse_number: 4, sire: 'サイアーD' }];
  const condRows = [sireRow('サイアーD', 55)];
  const allRows  = []; // allスコアなし → 0
  const result = computeWetTrackBonuses(rows, '重', condRows, allRows);
  assert.equal(result.bonuses.get(4), 55);
});

test('複数頭の混在ケース', () => {
  const rows = [
    { horse_number: 1, sire: 'X' },
    { horse_number: 2, sire: 'Y' },
    { horse_number: 3, sire: 'Z' },
  ];
  const condRows = [sireRow('X', 90), sireRow('Y', 40)];
  const allRows  = [sireRow('X', 70), sireRow('Y', 60), sireRow('Z', 50)];
  const result = computeWetTrackBonuses(rows, '重', condRows, allRows);
  assert.equal(result.bonuses.get(1), 20); // 90-70
  assert.equal(result.bonuses.has(2), false); // 40-60 < 0
  assert.equal(result.bonuses.has(3), false); // condなし(0)-50 < 0
});
