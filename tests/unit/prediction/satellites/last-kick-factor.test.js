'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { computeLastKickBonuses, LAST_KICK_BONUS, CAP_PCT } = require('../../../../scripts/lib/prediction/satellites/last-kick-factor');

test('上がり3Fが改善した馬にボーナス付与', () => {
  const rows = [{ horse_number: 1, agari_3f_1: 36.8, agari_3f_2: 38.2 }];
  const result = computeLastKickBonuses(rows);
  assert.equal(result.bonuses.get(1), LAST_KICK_BONUS);
  assert.equal(result.capPct, CAP_PCT);
});

test('上がり3Fが悪化した場合はボーナスなし', () => {
  const rows = [{ horse_number: 2, agari_3f_1: 39.0, agari_3f_2: 37.5 }];
  const result = computeLastKickBonuses(rows);
  assert.equal(result.bonuses.has(2), false);
});

test('上がり3Fが同値の場合はボーナスなし', () => {
  const rows = [{ horse_number: 3, agari_3f_1: 38.0, agari_3f_2: 38.0 }];
  const result = computeLastKickBonuses(rows);
  assert.equal(result.bonuses.has(3), false);
});

test('agari_3f_1がnullの場合はスキップ', () => {
  const rows = [{ horse_number: 4, agari_3f_1: null, agari_3f_2: 38.0 }];
  const result = computeLastKickBonuses(rows);
  assert.equal(result.bonuses.has(4), false);
});

test('agari_3f_2がnullの場合はスキップ', () => {
  const rows = [{ horse_number: 5, agari_3f_1: 37.0, agari_3f_2: null }];
  const result = computeLastKickBonuses(rows);
  assert.equal(result.bonuses.has(5), false);
});

test('両方nullの場合はスキップ', () => {
  const rows = [{ horse_number: 6, agari_3f_1: null, agari_3f_2: null }];
  const result = computeLastKickBonuses(rows);
  assert.equal(result.bonuses.has(6), false);
});

test('複数頭の混在ケース', () => {
  const rows = [
    { horse_number: 1, agari_3f_1: 36.5, agari_3f_2: 38.0 }, // 改善
    { horse_number: 2, agari_3f_1: 39.0, agari_3f_2: 37.0 }, // 悪化
    { horse_number: 3, agari_3f_1: null,  agari_3f_2: 37.0 }, // データなし
  ];
  const result = computeLastKickBonuses(rows);
  assert.equal(result.bonuses.get(1), LAST_KICK_BONUS);
  assert.equal(result.bonuses.has(2), false);
  assert.equal(result.bonuses.has(3), false);
});

test('文字列型の数値も正しく比較できる（DBからの戻り値対応）', () => {
  const rows = [{ horse_number: 7, agari_3f_1: '36.8', agari_3f_2: '38.2' }];
  const result = computeLastKickBonuses(rows);
  assert.equal(result.bonuses.get(7), LAST_KICK_BONUS);
});
