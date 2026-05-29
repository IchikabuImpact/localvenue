'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { PredictRaceUseCase } = require('../../../scripts/lib/prediction/predict-race-use-case');

function silentLogger() { return { log() {}, warn() {}, error() {} }; }

test('予想に必要なデータを取得してpredictionを保存する', async () => {
  const saved = [];
  const useCase = new PredictRaceUseCase({
    now: () => 'fixed',
    logger: silentLogger(),
    predictionRepository: {
      connect: async () => {},
      findRacingFormRows: async () => [{ horse_number: 1, horse_name: 'A', jockey: '', trainer: '', sire: '', sex_age: '牡5' }],
      findJockeyScores: async () => [],
      findTrainerScores: async () => [],
      findSireScores: async () => [],
      savePrediction: async payload => saved.push(payload),
      close: async () => {},
    },
  });
  const memo = await useCase.execute({ raceId: '202605230131', year: 2026 });
  assert.equal(memo.best.horse_number, 1);
  assert.equal(saved[0].raceId, '202605230131');
  assert.equal(saved[0].modelVersion, 'yosou-v1');
});

test('racing_formが空なら保存しない', async () => {
  let saved = false;
  const useCase = new PredictRaceUseCase({
    logger: silentLogger(),
    predictionRepository: {
      connect: async () => {}, findRacingFormRows: async () => [], savePrediction: async () => { saved = true; }, close: async () => {},
    },
  });
  await assert.rejects(() => useCase.execute({ raceId: '202605230131', year: 2026 }), /racing_form が空/);
  assert.equal(saved, false);
});
