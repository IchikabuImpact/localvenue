'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { PredictRaceUseCase } = require('../../../scripts/lib/prediction/predict-race-use-case');

function silentLogger() { return { log() {}, warn() {}, error() {} }; }

function makeRepos(overrides = {}) {
  return {
    predictionRepository: {
      connect: async () => {}, close: async () => {},
      savePrediction: async () => {},
      findRaceInfo: async () => null,
      findRecentResultsByHorseName: async () => [],
      findResultsWithDistanceByHorseName: async () => [],
      findLastRaceTitleByHorseName: async () => null,
      ...overrides.prediction,
    },
    racingFormRepository: {
      connect: async () => {}, close: async () => {},
      findByRaceId: async () => [{ horse_number: 1, horse_name: 'A', jockey: '', trainer: '', sire: '', sex_age: '牡5' }],
      ...overrides.racingForm,
    },
    rankingRepository: {
      connect: async () => {}, close: async () => {},
      findJockeyScores:   async () => [],
      findTrainerScores:  async () => [],
      findSireScores:     async () => [],
      findSireRawScores:  async () => [],
      ...overrides.ranking,
    },
  };
}

test('予想に必要なデータを取得してpredictionを保存する', async () => {
  const saved = [];
  const repos = makeRepos({ prediction: { savePrediction: async payload => saved.push(payload) } });
  const useCase = new PredictRaceUseCase({ ...repos, logger: silentLogger(), now: () => new Date('2026-05-29T00:00:00Z') });

  const memo = await useCase.execute({ raceId: '202605230131', year: 2026 });

  assert.equal(memo.best.horse_number, 1);
  assert.equal(saved[0].raceId, '202605230131');
  assert.equal(saved[0].modelVersion, 'yosou-v1');
});

test('scoringConfigをcalculatePredictionへ渡して保存する', async () => {
  const saved = [];
  const repos = makeRepos({
    prediction: { savePrediction: async payload => saved.push(payload) },
    racingForm: {
      findByRaceId: async () => [
        { horse_number: 1, horse_name: 'A', jockey: '', trainer: '', sire: 'ロードカナロア', sex_age: '牡5' },
      ],
    },
    ranking: {
      findSireScores: async () => [{ sire_name: 'ロードカナロア', score: 100 }],
    },
  });
  const useCase = new PredictRaceUseCase({
    ...repos,
    logger: silentLogger(),
    now: () => new Date('2026-07-01T00:00:00Z'),
    scoringConfig: {
      summerBonus: {
        startYmd: '20260701',
        endYmd: '20260930',
        fastTrackConditions: ['良'],
        wetTrackConditions: ['不良'],
        fastTrackSireRules: [{ name: 'ロードカナロア', pct: 20 }],
        fastTrackBroodmareSireRules: [],
        wetTrackSireRules: [],
        wetTrackBroodmareSireRules: [],
        damFamilyRules: [],
        weightAllowance: { pct: 0 },
      },
    },
  });

  const memo = await useCase.execute({ raceId: '202607010101', year: 2026 });

  assert.equal(memo.best.score, 128);
  assert.equal(saved[0].memo.best.breakdown.summerSire, 21);
});

test('馬別勝ちパターンルールを読み込み、該当馬にhorsePattern加点する', async () => {
  const saved = [];
  const repos = makeRepos({
    prediction: {
      findRaceInfo: async () => ({ track_condition: '良', distance_m: 1400, race_title: 'C1' }),
      findActiveHorsePatternRules: async () => [{
        rule_code: 'shishi_kochi_inner_type_s',
        horse_name: 'シシ',
        baba_code: 31,
        min_frame_number: 1,
        max_frame_number: 4,
        target_running_styles: ['逃げ', '先行'],
        max_escape_count_excluding_self: 0,
        max_front_runner_count: 3,
        bonus_pct: 10,
      }],
      savePrediction: async payload => saved.push(payload),
    },
    racingForm: {
      findByRaceId: async () => [
        { horse_number: 1, horse_name: 'シシ', frame_number: 2, running_style: '先行', jockey: '', trainer: '', sire: 'ロードカナロア', sex_age: '牡5' },
        { horse_number: 2, horse_name: 'A', frame_number: 5, running_style: '差し', jockey: '', trainer: '', sire: '', sex_age: '牡5' },
      ],
    },
    ranking: {
      findSireScores: async () => [{ sire_name: 'ロードカナロア', score: 100 }],
    },
  });
  const useCase = new PredictRaceUseCase({
    ...repos,
    logger: silentLogger(),
    now: () => new Date('2026-07-25T00:00:00Z'),
  });

  const memo = await useCase.execute({ raceId: '202607250131', year: 2026 });

  assert.equal(memo.best.horse_name, 'シシ');
  assert.equal(memo.best.breakdown.horsePattern, 11);
  assert.equal(saved[0].memo.best.breakdown.horsePattern, 11);
});

test('racing_formが空なら保存しない', async () => {
  let saved = false;
  const repos = makeRepos({
    racingForm: { findByRaceId: async () => [] },
    prediction: { savePrediction: async () => { saved = true; } },
  });
  const useCase = new PredictRaceUseCase({ ...repos, logger: silentLogger() });

  await assert.rejects(() => useCase.execute({ raceId: '202605230131', year: 2026 }), /racing_form が空/);
  assert.equal(saved, false);
});

test('エラー発生時もすべてのclose()が呼ばれる', async () => {
  const closed = { prediction: false, racingForm: false, ranking: false };
  const repos = makeRepos({
    racingForm: { findByRaceId: async () => [] },
    prediction: { close: async () => { closed.prediction = true; } },
  });
  // racingForm と ranking の close も上書き
  repos.racingFormRepository.close = async () => { closed.racingForm = true; };
  repos.rankingRepository.close    = async () => { closed.ranking = true; };

  const useCase = new PredictRaceUseCase({ ...repos, logger: silentLogger() });
  await useCase.execute({ raceId: '202605230131', year: 2026 }).catch(() => {});

  assert.equal(closed.prediction, true);
  assert.equal(closed.racingForm, true);
  assert.equal(closed.ranking, true);
});
