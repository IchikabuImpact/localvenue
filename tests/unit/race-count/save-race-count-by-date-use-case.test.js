'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { SaveRaceCountByDateUseCase } = require('../../../scripts/lib/race-count/save-race-count-by-date-use-case');

function silentLogger() {
  return { log() {}, warn() {}, error() {} };
}

test('calendarの会場ごとにRaceListを取得してレース数を保存する', async () => {
  const calls = [];
  const repository = {
    connect: async () => calls.push(['connect']),
    findVenueCodesByDate: async dateISO => { calls.push(['findVenueCodesByDate', dateISO]); return [31, 32]; },
    beginTransaction: async () => calls.push(['beginTransaction']),
    saveRaceCount: async payload => calls.push(['saveRaceCount', payload]),
    commit: async () => calls.push(['commit']),
    rollback: async () => calls.push(['rollback']),
    close: async () => calls.push(['close']),
  };
  const useCase = new SaveRaceCountByDateUseCase({
    raceListClient: { fetchRaceListHtml: async params => { calls.push(['fetchRaceListHtml', params]); return `<html>${params.babaCode}</html>`; } },
    raceCountParser: { parse: html => html.includes('31') ? 11 : 10 },
    raceCountRepository: repository,
    logger: silentLogger(),
  });

  const result = await useCase.execute({ dateISO: '2026-05-23' });

  assert.deepEqual(result, { total: 2, ok: 2, ng: 0, codes: [31, 32] });
  assert.deepEqual(calls[0], ['connect']);
  assert.deepEqual(calls[1], ['findVenueCodesByDate', '2026-05-23']);
  assert.deepEqual(calls[2], ['beginTransaction']);
  assert.deepEqual(calls[3], ['fetchRaceListHtml', { dateISO: '2026-05-23', babaCode: 31 }]);
  assert.deepEqual(calls[4], ['saveRaceCount', { ymd: '20260523', venueCode: 31, totalRaces: 11 }]);
  assert.deepEqual(calls[5], ['fetchRaceListHtml', { dateISO: '2026-05-23', babaCode: 32 }]);
  assert.deepEqual(calls[6], ['saveRaceCount', { ymd: '20260523', venueCode: 32, totalRaces: 10 }]);
  assert.deepEqual(calls[7], ['commit']);
  assert.deepEqual(calls[8], ['close']);
});

test('1会場強制実行はcalendarになくても対象にする', async () => {
  const saved = [];
  const useCase = new SaveRaceCountByDateUseCase({
    raceListClient: { fetchRaceListHtml: async () => '<a href="?k_raceNo=9">9R</a>' },
    raceCountParser: { parse: () => 9 },
    raceCountRepository: {
      connect: async () => {},
      findVenueCodesByDate: async () => [],
      beginTransaction: async () => {},
      saveRaceCount: async payload => saved.push(payload),
      commit: async () => {},
      rollback: async () => {},
      close: async () => {},
    },
    logger: silentLogger(),
  });

  const result = await useCase.execute({ dateISO: '2026-05-23', oneVenueCode: 31 });

  assert.deepEqual(result, { total: 1, ok: 1, ng: 0, codes: [31] });
  assert.deepEqual(saved, [{ ymd: '20260523', venueCode: 31, totalRaces: 9 }]);
});

test('calendarに会場がなく強制指定もない場合は保存せず終了する', async () => {
  let transactionStarted = false;
  const useCase = new SaveRaceCountByDateUseCase({
    raceListClient: { fetchRaceListHtml: async () => { throw new Error('should not fetch'); } },
    raceCountParser: { parse: () => 0 },
    raceCountRepository: {
      connect: async () => {},
      findVenueCodesByDate: async () => [],
      beginTransaction: async () => { transactionStarted = true; },
      saveRaceCount: async () => {},
      commit: async () => {},
      rollback: async () => {},
      close: async () => {},
    },
    logger: silentLogger(),
  });

  const result = await useCase.execute({ dateISO: '2026-05-23' });

  assert.deepEqual(result, { total: 0, ok: 0, ng: 0, codes: [] });
  assert.equal(transactionStarted, false);
});
