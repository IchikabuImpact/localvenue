'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { generateRaceIds, generateRaceIdsForVenue } = require('../../../scripts/lib/race-id/race-id-generator');

test('会場ごとのrace_idをYYYYMMDD + RR + BBで生成する', () => {
  assert.deepEqual(generateRaceIdsForVenue({ ymd: '20260523', venueCode: '31', totalRaces: 3 }), [
    '202605230131',
    '202605230231',
    '202605230331',
  ]);
});

test('1桁venue_codeは2桁にゼロ埋めする', () => {
  assert.deepEqual(generateRaceIdsForVenue({ ymd: '20260523', venueCode: 3, totalRaces: 2 }), [
    '202605230103',
    '202605230203',
  ]);
});

test('total_racesが0または数値化できない場合は空配列を返す', () => {
  assert.deepEqual(generateRaceIdsForVenue({ ymd: '20260523', venueCode: 31, totalRaces: 0 }), []);
  assert.deepEqual(generateRaceIdsForVenue({ ymd: '20260523', venueCode: 31, totalRaces: null }), []);
});

test('複数会場のrace_idをDB取得順に展開する', () => {
  assert.deepEqual(generateRaceIds({
    ymd: '20260523',
    raceCounts: [
      { venue_code: '31', total_races: 2 },
      { venue_code: '32', total_races: 1 },
    ],
  }), [
    '202605230131',
    '202605230231',
    '202605230132',
  ]);
});
