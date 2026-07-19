'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const {
  customScore,
  calculatePrediction,
  findSireScore,
  buildSireRows,
  matchesLimitedBonusSire,
  matchesLimitedBonusBroodmareSire,
  limitedSireBonus,
  limitedBroodmareSireBonus,
  summerBodyWeightMultiplier,
} = require('../../../scripts/lib/prediction/scoring');

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
  // raceTitle 未指定 → classLevel=null → multiplier=0.7 → trainer=Math.round(30*0.7)=21
  assert.deepEqual(memo.best.breakdown, {
    jockey: 50, trainer: 21, trainerJbis: 30, trainerMultiplier: 0.7,
    sire: 40, custom: 30,
    summerSire: 0,
    summerBroodmareSire: 0,
    bodyweightMultiplier: 1,
    bodyweightAdjustment: 0,
    horseWeightDiff: null,
  });
  assert.equal(memo.items.length, 2);
});

test('summerSireは9月末までジョーカプチーノまたはガルボ産駒を10%加点する', () => {
  assert.equal(matchesLimitedBonusSire('ジョーカプチーノ'), true);
  assert.equal(matchesLimitedBonusSire('ジョーカプチーノ産駒'), true);
  assert.equal(matchesLimitedBonusSire('ガルボ'), true);
  assert.equal(matchesLimitedBonusSire('トガルボ'), false);
  assert.equal(matchesLimitedBonusSire('ロードカナロア'), false);
  assert.equal(matchesLimitedBonusSire(''), false);

  assert.equal(limitedSireBonus(123, '202609300101', 'ジョーカプチーノ'), 12);
  assert.equal(limitedSireBonus(123, '202610010101', 'ジョーカプチーノ'), 0);
  assert.equal(limitedSireBonus(123, '202609300101', 'ロードカナロア'), 0);
});

test('summerBroodmareSireは9月末まで母父マンハッタンカフェを10%加点する', () => {
  assert.equal(matchesLimitedBonusBroodmareSire('マンハッタンカフェ'), true);
  assert.equal(matchesLimitedBonusBroodmareSire('マンハッタンカフェ系'), true);
  assert.equal(matchesLimitedBonusBroodmareSire('サンデーサイレンス'), false);
  assert.equal(matchesLimitedBonusBroodmareSire(''), false);

  assert.equal(limitedBroodmareSireBonus(123, '202609300101', 'マンハッタンカフェ'), 12);
  assert.equal(limitedBroodmareSireBonus(123, '202610010101', 'マンハッタンカフェ'), 0);
  assert.equal(limitedBroodmareSireBonus(123, '202609300101', 'サンデーサイレンス'), 0);
});

test('calculatePredictionはsummerSire加点を最終スコアに反映する', () => {
  const memo = calculatePrediction({
    raceId: '202608010101',
    generatedAt: 'fixed',
    racingFormRows: [
      { horse_number: 1, horse_name: 'A', jockey: '', trainer: '', sire: 'ジョーカプチーノ', sex_age: '牡5' },
    ],
    jockeyRows: [],
    trainerRows: [],
    sireRows: [{ sire_name: 'ジョーカプチーノ', score: 100 }],
  });

  assert.equal(memo.best.score, 118);
  assert.equal(memo.best.breakdown.summerSire, 11);
});

test('calculatePredictionはsummerBroodmareSire加点を最終スコアに反映する', () => {
  const memo = calculatePrediction({
    raceId: '202608010101',
    generatedAt: 'fixed',
    racingFormRows: [
      {
        horse_number: 1,
        horse_name: 'A',
        jockey: '',
        trainer: '',
        sire: 'ロードカナロア',
        broodmare_sire: 'マンハッタンカフェ',
        sex_age: '牡5',
      },
    ],
    jockeyRows: [],
    trainerRows: [],
    sireRows: [{ sire_name: 'ロードカナロア', score: 100 }],
  });

  assert.equal(memo.best.score, 118);
  assert.equal(memo.best.breakdown.summerBroodmareSire, 11);
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

test('summerBodyWeightMultiplierは7-9月だけ牝馬の馬体重増減を補正する', () => {
  assert.equal(summerBodyWeightMultiplier({ raceId: '202607010101', sexAge: '牝3', horseWeightDiff: 5 }), 1.05);
  assert.equal(summerBodyWeightMultiplier({ raceId: '202607010101', sexAge: '牝3', horseWeightDiff: 7 }), 1.05);
  assert.equal(summerBodyWeightMultiplier({ raceId: '202607010101', sexAge: '牝2', horseWeightDiff: 15 }), 1.05);
  assert.equal(summerBodyWeightMultiplier({ raceId: '202607150136', sexAge: '牝4', horseWeightDiff: 13 }), 1.05);
  assert.equal(summerBodyWeightMultiplier({ raceId: '202607010101', sexAge: '牝3', horseWeightDiff: 15 }), 1.05);
  assert.equal(summerBodyWeightMultiplier({ raceId: '202607010101', sexAge: '牝4', horseWeightDiff: 16 }), 1);
  assert.equal(summerBodyWeightMultiplier({ raceId: '202607010101', sexAge: '牝5', horseWeightDiff: 13 }), 1);
  assert.equal(summerBodyWeightMultiplier({ raceId: '202607010101', sexAge: '牝3', horseWeightDiff: -7 }), 0.95);
  assert.equal(summerBodyWeightMultiplier({ raceId: '202607010101', sexAge: '牝3', horseWeightDiff: -10 }), 0.95);
  assert.equal(summerBodyWeightMultiplier({ raceId: '202610010101', sexAge: '牝3', horseWeightDiff: 6 }), 1);
});

test('summerBodyWeightMultiplierは7-9月の牡馬10キロ以上減を割り引く', () => {
  assert.equal(summerBodyWeightMultiplier({ raceId: '202607010101', sexAge: '牡4', horseWeightDiff: -9 }), 1);
  assert.equal(summerBodyWeightMultiplier({ raceId: '202607010101', sexAge: '牡4', horseWeightDiff: -10 }), 0.95);
  assert.equal(summerBodyWeightMultiplier({ raceId: '202607010101', sexAge: '牡4', horseWeightDiff: -12 }), 0.95);
});

test('calculatePredictionは夏季馬体重補正を最終スコアに適用する', () => {
  const memo = calculatePrediction({
    raceId: '202607010101',
    generatedAt: 'fixed',
    racingFormRows: [{ horse_number: 1, horse_name: 'A', jockey: '', trainer: '', sire: '', sex_age: '牝3', horse_weight_diff: 6 }],
    jockeyRows: [],
    trainerRows: [],
    sireRows: [],
  });

  assert.equal(memo.best.score, 39);
  assert.equal(memo.best.breakdown.bodyweightMultiplier, 1.05);
  assert.equal(memo.best.breakdown.bodyweightAdjustment, 2);
  assert.equal(memo.best.breakdown.horseWeightDiff, 6);
});
