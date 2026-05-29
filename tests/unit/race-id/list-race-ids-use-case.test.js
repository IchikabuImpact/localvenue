'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { ListRaceIdsUseCase } = require('../../../scripts/lib/race-id/list-race-ids-use-case');

function silentLogger(warnings = []) {
  return {
    log() {},
    warn(message) { warnings.push(message); },
    error(message) { warnings.push(message); },
  };
}

test('race_count_by_dateの行からrace_idをstdout相当へ出力する', async () => {
  const calls = [];
  const output = [];
  const useCase = new ListRaceIdsUseCase({
    raceIdRepository: {
      connect: async () => calls.push(['connect']),
      findRaceCountsByYmd: async ymd => {
        calls.push(['findRaceCountsByYmd', ymd]);
        return [
          { venue_code: '31', total_races: 2 },
          { venue_code: '32', total_races: 1 },
        ];
      },
      close: async () => calls.push(['close']),
    },
    output: raceId => output.push(raceId),
    logger: silentLogger(),
  });

  const result = await useCase.execute({ ymd: '20260523' });

  assert.deepEqual(output, ['202605230131', '202605230231', '202605230132']);
  assert.deepEqual(result, { raceIds: output, count: 3 });
  assert.deepEqual(calls, [
    ['connect'],
    ['findRaceCountsByYmd', '20260523'],
    ['close'],
  ]);
});

test('race_count_by_dateが空の場合は警告して正常終了する', async () => {
  const warnings = [];
  const output = [];
  const useCase = new ListRaceIdsUseCase({
    raceIdRepository: {
      connect: async () => {},
      findRaceCountsByYmd: async () => [],
      close: async () => {},
    },
    output: raceId => output.push(raceId),
    logger: silentLogger(warnings),
  });

  const result = await useCase.execute({ ymd: '20260523' });

  assert.deepEqual(output, []);
  assert.deepEqual(result, { raceIds: [], count: 0 });
  assert.deepEqual(warnings, ['(warn) race_count_by_date に 20260523 のデータがありません。']);
});
