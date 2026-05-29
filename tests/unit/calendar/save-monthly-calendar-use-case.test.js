'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { SaveMonthlyCalendarUseCase } = require('../../../scripts/lib/calendar/save-monthly-calendar-use-case');

function silentLogger() {
  return { log() {}, warn() {}, error() {} };
}

test('開催情報がある場合はrepositoryへ保存する', async () => {
  const raceDays = new Map([
    ['20260502', [{ date: '2026-05-02', babaCode: 31, venue: '高知' }]],
  ]);
  const calls = [];
  const useCase = new SaveMonthlyCalendarUseCase({
    calendarClient: { fetchMonthlyCalendar: async params => { calls.push(['fetch', params]); return '<html></html>'; } },
    calendarParser: { parse: (html, params) => { calls.push(['parse', html, params]); return raceDays; } },
    calendarRepository: { saveRaceDays: async data => { calls.push(['save', data]); return 1; } },
    logger: silentLogger(),
  });

  const result = await useCase.execute({ year: '2026', month: '05' });

  assert.equal(result.totalEntries, 1);
  assert.equal(result.savedRows, 1);
  assert.deepEqual(calls[0], ['fetch', { year: '2026', month: '05' }]);
  assert.deepEqual(calls[1], ['parse', '<html></html>', { year: '2026', month: '05' }]);
  assert.equal(calls[2][0], 'save');
  assert.equal(calls[2][1], raceDays);
});

test('開催情報が空の場合は保存しない', async () => {
  let saved = false;
  const useCase = new SaveMonthlyCalendarUseCase({
    calendarClient: { fetchMonthlyCalendar: async () => '<html></html>' },
    calendarParser: { parse: () => new Map() },
    calendarRepository: { saveRaceDays: async () => { saved = true; } },
    logger: silentLogger(),
  });

  const result = await useCase.execute({ year: '2026', month: '05' });

  assert.equal(result.totalEntries, 0);
  assert.equal(result.savedRows, 0);
  assert.equal(saved, false);
});
