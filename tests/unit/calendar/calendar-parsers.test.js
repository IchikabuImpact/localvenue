'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { parseKeibaGoJpSchedule } = require('../../../scripts/lib/calendar/keiba-go-jp-calendar-parser');
const { parseRakutenSchedule } = require('../../../scripts/lib/calendar/rakuten-calendar-parser');

function entriesOf(raceDays, ymd) {
  return raceDays.get(ymd) || [];
}

function silentLogger() {
  return { log() {}, warn() {}, error() {} };
}

test('keiba.go.jpの月間開催HTMLから対象会場だけを抽出し重複を除外する', () => {
  const html = `
    <table class="schedule"><tbody>
      <tr><th>header</th></tr>
      <tr>
        <td><a href="/KeibaWeb/TodayRaceInfo/RaceList?k_raceDate=2026%2F05%2F02&k_babaCode=31">高知</a></td>
        <td><a href="/KeibaWeb/TodayRaceInfo/RaceList?k_raceDate=2026%2F05%2F02&k_babaCode=31">高知 duplicated</a></td>
        <td><a href="/KeibaWeb/TodayRaceInfo/RaceList?k_raceDate=2026%2F05%2F03&k_babaCode=20">大井</a></td>
        <td><a href="/KeibaWeb/TodayRaceInfo/RaceList?k_raceDate=2026%2F05%2F04&k_babaCode=3">帯広ば</a></td>
      </tr>
    </tbody></table>
  `;

  const raceDays = parseKeibaGoJpSchedule(html);

  assert.equal(raceDays.size, 2);
  assert.deepEqual(entriesOf(raceDays, '20260502'), [
    { date: '2026-05-02', babaCode: 31, venue: '高知' },
  ]);
  assert.deepEqual(entriesOf(raceDays, '20260503'), [
    { date: '2026-05-03', babaCode: 20, venue: '大井' },
  ]);
  assert.equal(raceDays.has('20260504'), false);
});

test('楽天競馬カレンダーHTMLから開催日をRACEIDで復元する', () => {
  const html = `
    <html><body>
      <h2>2026年5月 開催日程</h2>
      <table><tbody>
        <tr class="place">
          <th scope="row">高知</th>
          <td class="held"><a href="https://keiba.rakuten.co.jp/race_card/list/RACEID/202605023100000000">held</a></td>
          <td class="held"><a href="https://keiba.rakuten.co.jp/race_card/list/RACEID/202605023100000001">duplicated</a></td>
        </tr>
        <tr class="place">
          <th scope="row">帯広ば</th>
          <td class="held"><a href="https://keiba.rakuten.co.jp/race_card/list/RACEID/202605040300000000">held</a></td>
        </tr>
      </tbody></table>
    </body></html>
  `;

  const raceDays = parseRakutenSchedule(html, {
    year: '2026',
    month: '05',
    logger: silentLogger(),
  });

  assert.equal(raceDays.size, 1);
  assert.deepEqual(entriesOf(raceDays, '20260502'), [
    { date: '2026-05-02', babaCode: 31, venue: '高知' },
  ]);
  assert.equal(raceDays.has('20260504'), false);
});
