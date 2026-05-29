'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { customScore, calculatePrediction, findSireScore, buildSireRows } = require('../../../scripts/lib/prediction/scoring');

test('customScoreは偶数馬番と年齢ボーナスを加算する', () => {
  assert.equal(customScore({ horse_number: 2, sex_age: '牡2' }), 42);
  assert.equal(customScore({ horse_number: 3, sex_age: '牝3' }), 30);
  assert.equal(customScore({ horse_number: 4, sex_age: '牡4' }), 24);
});

test('sire scoreは正規化後の前方一致で取得する', () => {
  const rows = buildSireRows([{ sire_name: 'ロードカナロア', score: 100 }, { sire_name: 'ロード', score: 10 }]);
  assert.equal(findSireScore(rows, 'ロードカナロア産駒'), 100);
});

test('calculatePredictionはスコア順でbestとitemsを作る', () => {
  const memo = calculatePrediction({
    raceId: '202605230131',
    generatedAt: '2026-05-29T00:00:00.000Z',
    racingFormRows: [
      { horse_number: 1, horse_name: 'A', jockey: '赤岡修次', trainer: '田中守', sire: 'ロードカナロア', sex_age: '牡3' },
      { horse_number: 2, horse_name: 'B', jockey: '下原理', trainer: '別府真司', sire: 'キズナ', sex_age: '牡2' },
    ],
    jockeyRows: [{ jockey_name: '赤岡修次', score: 50 }, { jockey_name: '下原理', score: 5 }],
    trainerRows: [{ trainer_name: '田中守', score: 30 }, { trainer_name: '別府真司', score: 5 }],
    sireRows: [{ sire_name: 'ロードカナロア', score: 40 }, { sire_name: 'キズナ', score: 1 }],
  });

  assert.equal(memo.model, 'yosou-v1');
  assert.equal(memo.best.horse_number, 1);
  assert.deepEqual(memo.best.breakdown, { jockey: 50, trainer: 30, sire: 40, custom: 30 });
  assert.equal(memo.items.length, 2);
});

test('スコア合計0の場合は馬番をフォールバック加算する', () => {
  const memo = calculatePrediction({
    raceId: '202605230131',
    generatedAt: 'fixed',
    racingFormRows: [{ horse_number: 7, horse_name: 'A', jockey: '', trainer: '', sire: '', sex_age: '牡5' }],
    jockeyRows: [], trainerRows: [], sireRows: [],
  });
  assert.equal(memo.best.score, 7);
});
