'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { SaveRacingFormUseCase } = require('../../../scripts/lib/racing-form/save-racing-form-use-case');

function silentLogger() { return { log() {}, warn() {}, error() {} }; }

test('DebaTable取得・パース・保存を順に実行する', async () => {
  const calls = [];
  const rows = [{ horse_number: 1 }];
  const useCase = new SaveRacingFormUseCase({
    debaTableClient: { fetchHtml: async url => { calls.push(['fetchHtml', url]); return '<html></html>'; } },
    racingFormParser: { parse: (html, opts) => { calls.push(['parse', html, opts]); return rows; } },
    racingFormRepository: {
      connect: async () => calls.push(['connect']),
      saveRaceForm: async payload => { calls.push(['saveRaceForm', payload]); return 1; },
      close: async () => calls.push(['close']),
    },
    logger: silentLogger(),
  });

  const result = await useCase.execute({ raceId: '202605230131', yyyymmdd: '20260523', raceNo: 1, babaCode: '31', yy: 26 });
  assert.equal(result.savedRows, 1);
  assert.deepEqual(calls[1], ['parse', '<html></html>', { yy: 26 }]);
  assert.deepEqual(calls[3], ['saveRaceForm', { raceId: '202605230131', rows }]);
});

test('パース結果が0頭なら保存しない', async () => {
  let connected = false;
  const useCase = new SaveRacingFormUseCase({
    debaTableClient: { fetchHtml: async () => '<html></html>' },
    racingFormParser: { parse: () => [] },
    racingFormRepository: { connect: async () => { connected = true; }, saveRaceForm: async () => {}, close: async () => {} },
    logger: silentLogger(),
  });
  await assert.rejects(() => useCase.execute({ raceId: '202605230131', yyyymmdd: '20260523', raceNo: 1, babaCode: '31', yy: 26 }), /0頭/);
  assert.equal(connected, false);
});
