'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const {
  DEFAULT_SCORING_CONFIG,
  customScore,
  calculatePrediction,
  findSireScore,
  buildSireRows,
  matchesLimitedBonusSire,
  matchesLimitedBonusBroodmareSire,
  limitedSireBonus,
  limitedBroodmareSireBonus,
  summerDamFamilyBonus,
  summerWeightAllowanceBonus,
  summerTrackType,
  summerBodyWeightMultiplier,
  buildDefaultScoringFactors,
  applyScoringFactors,
  isYoungRace,
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
    youngRace: true,
    youngSireBoost: 12,
    juvenileSireRank: 0,
    juvenileSireRankingBonus: 0,
    summerSire: 0,
    summerBroodmareSire: 0,
    summerDamFamily: 0,
    summerWeightAllowance: 0,
    bodyweightMultiplier: 1,
    bodyweightAdjustment: 0,
    horseWeightDiff: null,
  });
  assert.equal(memo.items.length, 2);
});

test('isYoungRaceは若い馬中心かレース名で若駒戦を判定する', () => {
  assert.equal(isYoungRace([{ sex_age: '牡2' }, { sex_age: '牝3' }, { sex_age: '牡4' }], ''), true);
  assert.equal(isYoungRace([{ sex_age: '牡4' }, { sex_age: '牝5' }], '2歳新馬'), true);
  assert.equal(isYoungRace([{ sex_age: '牡4' }, { sex_age: '牝5' }], ''), false);
});

test('calculatePredictionは若駒戦だけ2歳種牡馬ランキングを加点する', () => {
  const memo = calculatePrediction({
    raceId: '202608010101',
    generatedAt: 'fixed',
    racingFormRows: [
      { horse_number: 1, horse_name: 'A', jockey: '', trainer: '', sire: 'モーニン', sex_age: '牡2' },
    ],
    jockeyRows: [],
    trainerRows: [],
    sireRows: [{ sire_name: 'モーニン', score: 80 }],
    juvenileSireRows: [{ sire_name: 'モーニン', score: 100 }],
  });

  assert.equal(memo.best.breakdown.youngRace, true);
  assert.equal(memo.best.breakdown.youngSireBoost, 24);
  assert.equal(memo.best.breakdown.juvenileSireRank, 100);
  assert.equal(memo.best.breakdown.juvenileSireRankingBonus, 15);
});

test('summerSireは7月から9月末まで夏向き父系を加点する', () => {
  assert.equal(matchesLimitedBonusSire('ジョーカプチーノ'), true);
  assert.equal(matchesLimitedBonusSire('ジョーカプチーノ産駒'), true);
  assert.equal(matchesLimitedBonusSire('ガルボ'), true);
  assert.equal(matchesLimitedBonusSire('トガルボ'), false);
  assert.equal(matchesLimitedBonusSire('ロードカナロア'), false);
  assert.equal(matchesLimitedBonusSire(''), false);

  assert.equal(limitedSireBonus(123, '202609300101', 'ジョーカプチーノ'), 12);
  assert.equal(limitedSireBonus(123, '202609300101', 'ルヴァンスレーヴ'), 12);
  assert.equal(limitedSireBonus(123, '202606300101', 'ジョーカプチーノ'), 0);
  assert.equal(limitedSireBonus(123, '202610010101', 'ジョーカプチーノ'), 0);
  assert.equal(limitedSireBonus(123, '202609300101', 'ロードカナロア'), 0);
});

test('summerBroodmareSireは7月から9月末まで母父の夏向き血統を強弱付きで加点する', () => {
  assert.equal(matchesLimitedBonusBroodmareSire('マンハッタンカフェ'), true);
  assert.equal(matchesLimitedBonusBroodmareSire('マンハッタンカフェ系'), true);
  assert.equal(matchesLimitedBonusBroodmareSire('ゴールドアリュール'), true);
  assert.equal(matchesLimitedBonusBroodmareSire('シンボリクリスエス'), true);
  assert.equal(matchesLimitedBonusBroodmareSire('サンデーサイレンス'), false);
  assert.equal(matchesLimitedBonusBroodmareSire(''), false);

  assert.equal(limitedBroodmareSireBonus(123, '202609300101', 'マンハッタンカフェ'), 12);
  assert.equal(limitedBroodmareSireBonus(123, '202609300101', 'ゴールドアリュール'), 10);
  assert.equal(limitedBroodmareSireBonus(123, '202609300101', 'シンボリクリスエス'), 6);
  assert.equal(limitedBroodmareSireBonus(123, '202606300101', 'マンハッタンカフェ'), 0);
  assert.equal(limitedBroodmareSireBonus(123, '202610010101', 'マンハッタンカフェ'), 0);
  assert.equal(limitedBroodmareSireBonus(123, '202609300101', 'サンデーサイレンス'), 0);
});

test('summer blood補正は良/稍重と重/不良で対象を分ける', () => {
  assert.equal(summerTrackType('良'), 'fast');
  assert.equal(summerTrackType('稍重'), 'fast');
  assert.equal(summerTrackType('重'), 'wet');
  assert.equal(summerTrackType('不良'), 'wet');

  assert.equal(limitedSireBonus(100, '202608010101', 'ジョーカプチーノ', '良'), 10);
  assert.equal(limitedSireBonus(100, '202608010101', 'ジョーカプチーノ', '不良'), 0);
  assert.equal(limitedSireBonus(100, '202608010101', 'キズナ', '良'), 0);
  assert.equal(limitedSireBonus(100, '202608010101', 'キズナ', '不良'), 5);

  assert.equal(limitedBroodmareSireBonus(100, '202608010101', 'Frankel', '良'), 0);
  assert.equal(limitedBroodmareSireBonus(100, '202608010101', 'Frankel', '不良'), 5);
  assert.equal(limitedBroodmareSireBonus(100, '202608010101', 'ゴールドアリュール', '良'), 8);
  assert.equal(limitedBroodmareSireBonus(100, '202608010101', 'ゴールドアリュール', '不良'), 8);
});

test('summerDamFamilyはニキーヤ牝系を夏だけ控えめに加点する', () => {
  assert.equal(summerDamFamilyBonus(100, '202608010101', 'ニキーヤ'), 5);
  assert.equal(summerDamFamilyBonus(100, '202608010101', 'ヌチバナ'), 5);
  assert.equal(summerDamFamilyBonus(100, '202608010101', 'オリエントチャーム'), 5);
  assert.equal(summerDamFamilyBonus(100, '202606300101', 'ニキーヤ'), 0);
  assert.equal(summerDamFamilyBonus(100, '202610010101', 'ニキーヤ'), 0);
  assert.equal(summerDamFamilyBonus(100, '202608010101', '別牝系'), 0);
});

test('summerWeightAllowanceは夏に2kg以上軽い3歳牝馬や小柄な牝馬を3%加点する', () => {
  assert.equal(summerWeightAllowanceBonus(100, '202608010101', 54, 56, '牝3', 480), 3);
  assert.equal(summerWeightAllowanceBonus(100, '202608010101', 54, 56, '牝5', 440), 3);
  assert.equal(summerWeightAllowanceBonus(100, '202608010101', 54, 56, '牡3', 440), 0);
  assert.equal(summerWeightAllowanceBonus(100, '202608010101', 54, 56, '牝5', 470), 0);
  assert.equal(summerWeightAllowanceBonus(100, '202608010101', 54.5, 56, '牝3', 440), 0);
  assert.equal(summerWeightAllowanceBonus(100, '202606300101', 54, 56, '牝3', 440), 0);
  assert.equal(summerWeightAllowanceBonus(100, '202610010101', 54, 56, '牝3', 440), 0);
  assert.equal(summerWeightAllowanceBonus(100, '202608010101', null, 56, '牝3', 440), 0);
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

test('calculatePredictionはsummerDamFamily加点を最終スコアに反映する', () => {
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
        dam: 'ヌチバナ',
        broodmare_sire: 'キングカメハメハ',
        sex_age: '牡5',
      },
    ],
    jockeyRows: [],
    trainerRows: [],
    sireRows: [{ sire_name: 'ロードカナロア', score: 100 }],
  });

  assert.equal(memo.best.score, 112);
  assert.equal(memo.best.breakdown.summerDamFamily, 5);
});

test('calculatePredictionは夏の斤量差3%加点を最終スコアに反映する', () => {
  const memo = calculatePrediction({
    raceId: '202608010101',
    generatedAt: 'fixed',
    scoringConfig: {
      summerBonus: {
        ...DEFAULT_SCORING_CONFIG.summerBonus,
        youngRace: {
          ...DEFAULT_SCORING_CONFIG.summerBonus.youngRace,
          sireBoostPct: 0,
          juvenileSireRankingBonusPct: 0,
        },
      },
    },
    racingFormRows: [
      {
        horse_number: 1,
        horse_name: 'A',
        jockey: '',
        trainer: '',
        sire: 'ロードカナロア',
        sex_age: '牝3',
        carried_weight: 54,
        horse_weight: 440,
      },
      {
        horse_number: 2,
        horse_name: 'B',
        jockey: '',
        trainer: '',
        sire: 'ロードカナロア',
        sex_age: '牝3',
        carried_weight: 56,
        horse_weight: 460,
      },
    ],
    jockeyRows: [],
    trainerRows: [],
    sireRows: [{ sire_name: 'ロードカナロア', score: 100 }],
  });

  const item = memo.items.find(row => row.horse_number === 1);
  assert.equal(item.score, 141);
  assert.equal(item.breakdown.summerWeightAllowance, 4);
});

test('calculatePredictionはscoringConfigで補正値を差し替えられる', () => {
  const scoringConfig = {
    summerBonus: {
      ...DEFAULT_SCORING_CONFIG.summerBonus,
      fastTrackSireRules: [{ name: 'ロードカナロア', pct: 20 }],
      fastTrackBroodmareSireRules: [],
      wetTrackSireRules: [],
      wetTrackBroodmareSireRules: [],
      damFamilyRules: [],
      weightAllowance: { ...DEFAULT_SCORING_CONFIG.summerBonus.weightAllowance, pct: 0 },
    },
  };
  const memo = calculatePrediction({
    raceId: '202608010101',
    generatedAt: 'fixed',
    trackCondition: '良',
    scoringConfig,
    racingFormRows: [
      { horse_number: 1, horse_name: 'A', jockey: '', trainer: '', sire: 'ロードカナロア', sex_age: '牡5' },
    ],
    jockeyRows: [],
    trainerRows: [],
    sireRows: [{ sire_name: 'ロードカナロア', score: 100 }],
  });

  assert.equal(memo.best.score, 128);
  assert.equal(memo.best.breakdown.summerSire, 21);
});

test('calculatePredictionはscoringFactorsを注入できる', () => {
  const memo = calculatePrediction({
    raceId: '202608010101',
    generatedAt: 'fixed',
    scoringFactors: [
      { name: 'testFactor', compute: ({ row }) => row.horse_number === 1 ? 9 : 0 },
    ],
    racingFormRows: [
      { horse_number: 1, horse_name: 'A', jockey: '', trainer: '', sire: '', sex_age: '牡5' },
    ],
    jockeyRows: [],
    trainerRows: [],
    sireRows: [],
  });

  assert.equal(memo.best.score, 16);
  assert.equal(memo.best.breakdown.testFactor, 9);
  assert.equal('summerSire' in memo.best.breakdown, false);
});

test('buildDefaultScoringFactorsとapplyScoringFactorsはfactor内訳を返す', () => {
  const factors = buildDefaultScoringFactors();
  const result = applyScoringFactors({
    factors,
    coreScore: 100,
    row: { sire: 'ジョーカプチーノ', sex_age: '牡5' },
    raceContext: { raceId: '202608010101', trackCondition: '良', raceMaxCarriedWeight: null },
  });

  assert.equal(result.totalBonus, 10);
  assert.equal(result.breakdown.summerSire, 10);
  assert.equal(result.breakdown.summerBroodmareSire, 0);
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
