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
      ...overrides.prediction,
    },
    racingFormRepository: {
      connect: async () => {}, close: async () => {},
      findByRaceId: async () => [{ horse_number: 1, horse_name: 'A', jockey: '', trainer: '', sire: '', sex_age: '牡5' }],
      ...overrides.racingForm,
    },
    rankingRepository: {
      connect: async () => {}, close: async () => {},
      findJockeyScores:  async () => [],
      findTrainerScores: async () => [],
      findSireScores:    async () => [],
      ...overrides.ranking,
    },
  };
}

test('予想に必要なデータを取得してpredictionを保存する', async () => {
  const saved = [];
  const repos = makeRepos({ prediction: { savePrediction: async payload => saved.push(payload) } });
  const useCase = new PredictRaceUseCase({ ...repos, logger: silentLogger(), now: () => 'fixed' });

  const memo = await useCase.execute({ raceId: '202605230131', year: 2026 });

  assert.equal(memo.best.horse_number, 1);
  assert.equal(saved[0].raceId, '202605230131');
  assert.equal(saved[0].modelVersion, 'yosou-v1');
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
