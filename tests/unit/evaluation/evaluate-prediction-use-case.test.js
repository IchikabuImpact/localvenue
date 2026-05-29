'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const {
  EvaluatePredictionUseCase,
  PredictionMissingError,
  ResultMissingError,
} = require('../../../scripts/lib/evaluation/evaluate-prediction-use-case');

function silentLogger() { return { log() {}, warn() {}, error() {} }; }

function makeRepo(overrides = {}) {
  return {
    connect:              async () => {},
    close:                async () => {},
    findLatestPrediction: async () => ({
      model_version: 'yosou-v1',
      created_at: new Date('2026-05-29T00:00:00Z'),
      memo: { best: { horse_number: 7 }, items: [{ horse_number: 7, score: 10 }] },
    }),
    findResultRows:  async () => [{ horse_number: 7, horse_name: 'A', official_finish_position: 1 }],
    findPayoutRows:  async () => [
      { bet_type: 'WIN',   horse_number: 7, payout: 180 },
      { bet_type: 'PLACE', horse_number: 7, payout: 110 },
    ],
    upsertPredictionEval: async () => {},
    upsertPredictionROI:  async () => {},
    ...overrides,
  };
}

// ── 正常系 ────────────────────────────────────────────────────────
test('的中評価を保存して結果を返す', async () => {
  const evalSaved = [];
  const roiSaved  = [];
  const useCase = new EvaluatePredictionUseCase({
    logger: silentLogger(),
    evaluationRepository: makeRepo({
      upsertPredictionEval: async row => evalSaved.push(row),
      upsertPredictionROI:  async row => roiSaved.push(row),
    }),
  });

  const result = await useCase.execute({ raceId: '202605230131', stakeWin: 100, stakePlace: 100 });

  assert.equal(result.winHit, true);
  assert.equal(result.placeHit, true);
  assert.equal(evalSaved.length, 1);
  assert.equal(evalSaved[0].race_id, '202605230131');
  assert.equal(evalSaved[0].win_hit, true);
  assert.equal(roiSaved.length, 2);  // single + place
});

// ── 予想なし (exit code 2) ─────────────────────────────────────────
test('予想が存在しない場合は PredictionMissingError を投げる', async () => {
  const useCase = new EvaluatePredictionUseCase({
    logger: silentLogger(),
    evaluationRepository: makeRepo({ findLatestPrediction: async () => null }),
  });

  const err = await useCase.execute({ raceId: '202605230131' }).catch(e => e);
  assert.ok(err instanceof PredictionMissingError);
  assert.equal(err.exitCode, 2);
});

// ── 結果なし (exit code 3) ─────────────────────────────────────────
test('結果が存在しない場合は ResultMissingError を投げる', async () => {
  const useCase = new EvaluatePredictionUseCase({
    logger: silentLogger(),
    evaluationRepository: makeRepo({ findResultRows: async () => [] }),
  });

  const err = await useCase.execute({ raceId: '202605230131' }).catch(e => e);
  assert.ok(err instanceof ResultMissingError);
  assert.equal(err.exitCode, 3);
});

// ── close() が必ず呼ばれる ─────────────────────────────────────────
test('エラー発生時も close() が呼ばれる', async () => {
  let closeCalled = false;
  const useCase = new EvaluatePredictionUseCase({
    logger: silentLogger(),
    evaluationRepository: makeRepo({
      findLatestPrediction: async () => null,
      close: async () => { closeCalled = true; },
    }),
  });

  await useCase.execute({ raceId: '202605230131' }).catch(() => {});
  assert.equal(closeCalled, true);
});

// ── stake 指定なし（デフォルト0）────────────────────────────────
test('stake未指定の場合はROI行が空', async () => {
  const roiSaved = [];
  const useCase = new EvaluatePredictionUseCase({
    logger: silentLogger(),
    evaluationRepository: makeRepo({
      upsertPredictionROI: async row => roiSaved.push(row),
    }),
  });

  await useCase.execute({ raceId: '202605230131' }); // stakeWin・stakePlace省略 → 0
  assert.equal(roiSaved.length, 0);
});
