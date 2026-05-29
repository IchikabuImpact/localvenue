'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { buildRaceListUrl } = require('../../../scripts/lib/race-count/race-list-url');
const { parseRaceCountFromRaceListHtml } = require('../../../scripts/lib/race-count/race-count-parser');

test('RaceList URLを既存形式で組み立てる', () => {
  assert.equal(
    buildRaceListUrl({ dateISO: '2026-05-23', babaCode: 31 }),
    'https://www.keiba.go.jp/KeibaWeb/TodayRaceInfo/RaceList?k_raceDate=2026%2F05%2F23&k_babaCode=31'
  );
});

test('hrefのk_raceNoから最大レース番号を取得する', () => {
  const html = `
    <a href="/Race?k_raceNo=1">1R</a>
    <a href="/Race?k_raceNo=11">11R</a>
    <a href="/Race?k_raceNo=7">7R</a>
  `;

  assert.equal(parseRaceCountFromRaceListHtml(html), 11);
});

test('k_raceNoがない場合はセルテキストのNR表記を使う', () => {
  const html = `
    <table><tr><td>1R</td><td>10Ｒ</td><td>not race</td></tr></table>
  `;

  assert.equal(parseRaceCountFromRaceListHtml(html), 10);
});

test('レース番号が見つからない場合は0を返す', () => {
  assert.equal(parseRaceCountFromRaceListHtml('<html><body>no races</body></html>'), 0);
});
