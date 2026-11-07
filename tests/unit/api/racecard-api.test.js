const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const {
  buildRaceId,
  buildRacecardText,
  formatDateJa,
  parseRacecardQuery,
} = require('../../../scripts/lib/api/racecard-text');
const { createApiApp } = require('../../../scripts/lib/api/api-app');

const VENUES = [{ code: 20, name: '大井' }, { code: 32, name: '佐賀' }];

const HORSE = {
  frame_number: 1, horse_number: 1, horse_name: 'レッドファイブ', sex_age: '牡3', hair: '黒鹿毛',
  sire: 'ダノンスマッシュ', dam: 'ゴールデンリーヴス', broodmare_sire: 'Tiznow', carried_weight: '56.0',
  jockey_name: '山田貴', affiliation: '佐賀', trainer_name: '頼本盛', owner: '馬主A', breeder: '生産者B',
  odds_morning: null, horse_weight: 486, horse_weight_diff: -4, remarks: null, running_style: '差し',
  agari_3f_1: '42.0', agari_3f_2: '41.9',
  trainerFullName: '頼本 盛行', trainerCourse: '佐賀', trainerAffiliation: '佐賀',
  pastRuns: [{ raceId: '202610251132', venue: '佐賀', raceNo: 11, title: 'C2-18組', distance: 1400, trackCondition: '稍重', position: 3, fieldSize: 12, oddsFinal: '5.6', jockey: '山田貴 (佐賀)' }],
};

test('parseRacecardQuery accepts code or venue name and validates input', () => {
  assert.deepEqual(parseRacecardQuery({ date: '20261108', baba: '32', race: '11' }, VENUES), { ok: true, date: '20261108', babaCode: 32, raceNo: 11 });
  assert.deepEqual(parseRacecardQuery({ date: '20261108', baba: '佐賀', race: '11' }, VENUES), { ok: true, date: '20261108', babaCode: 32, raceNo: 11 });
  assert.deepEqual(parseRacecardQuery({ date: '20261108' }, VENUES), { ok: true, date: '20261108', babaCode: null, raceNo: null });
  assert.equal(parseRacecardQuery({ date: '2026118' }, VENUES).ok, false);
  assert.equal(parseRacecardQuery({ date: '20261131', baba: '32', race: '1' }, VENUES).ok, false);
  assert.equal(parseRacecardQuery({ date: '20261108', baba: '99', race: '1' }, VENUES).ok, false);
  assert.equal(parseRacecardQuery({ date: '20261108', baba: '32', race: '13' }, VENUES).ok, false);
});

test('buildRaceId follows YYYYMMDDRRBB', () => {
  assert.equal(buildRaceId('20261108', 32, 1), '202611080132');
});

test('formatDateJa adds the weekday', () => {
  assert.equal(formatDateJa('20261108'), '2026年11月8日（日）');
});

test('buildRacecardText writes one labeled block per horse', () => {
  const text = buildRacecardText({
    raceId: '202611081132', date: '20261108', babaCode: 32, venue: '佐賀', raceNo: 11,
    info: { race_title: 'C2-18組', distance_m: 1400, track_condition: null, weather: null, race_start_time: '20:40' },
    horses: [HORSE, { ...HORSE, horse_number: 2, horse_name: 'ニバンメ', trainerFullName: undefined, pastRuns: [], horse_weight: null, agari_3f_1: null, agari_3f_2: null }],
  });
  assert.match(text, /^# 出馬表\n日付: 2026年11月8日（日）\n競馬場: 佐賀（馬場コード32）\nレース: 11R C2-18組/);
  assert.match(text, /馬場状態: 未発表/);
  assert.match(text, /出走頭数: 2頭/);
  assert.match(text, /## 項目の説明/);
  assert.match(text, /### 1番 レッドファイブ\n- 枠番: 1枠\n- 性齢: 牡3（黒鹿毛）\n- 斤量: 56.0kg\n- 騎手: 山田貴（佐賀所属）\n- 調教師: 頼本 盛行（佐賀所属、出馬表の表記は「頼本盛」）/);
  assert.match(text, /- 馬体重: 486kg（前走から -4kg）/);
  assert.match(text, /- 上がり3F: 前走 42.0秒 \/ 2走前 41.9秒/);
  assert.match(text, / {2}- 2026\/10\/25 佐賀11R C2-18組 1400m 馬場稍重 3着\/12頭 単勝5.6倍 騎手 山田貴（佐賀）/);
  assert.match(text, /### 2番 ニバンメ[\s\S]*- 調教師: 頼本盛\n[\s\S]*- 馬体重: 未発表[\s\S]*- 上がり3F: データなし[\s\S]*- 近走: データなし/);
});

function fakeRepository({ race = null, dayRaces = [] } = {}) {
  return {
    findVenues: async () => VENUES,
    findDayRaces: async () => dayRaces,
    findRace: async () => race,
  };
}

async function request(app, path) {
  const server = app.listen(0);
  try {
    const { port } = server.address();
    return await new Promise((resolve, reject) => {
      http.get({ host: '127.0.0.1', port, path }, (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve({ status: res.statusCode, type: res.headers['content-type'], body: Buffer.concat(chunks).toString('utf8') }));
      }).on('error', reject);
    });
  } finally {
    server.close();
  }
}

test('GET /racecard without arguments returns usage as UTF-8 JSON', async () => {
  const res = await request(createApiApp({ repository: fakeRepository() }), '/racecard');
  assert.equal(res.status, 200);
  assert.equal(res.type, 'application/json; charset=utf-8');
  const body = JSON.parse(res.body);
  assert.match(body.usage, /出馬表API/);
  assert.ok(res.body.includes('出馬表API'), 'Japanese is sent as UTF-8, not \\u escapes');
});

test('GET /racecard returns the race text and accepts a percent-encoded venue name', async () => {
  const race = { info: { race_title: 'C2-18組', distance_m: 1400, race_start_time: '20:40' }, horses: [HORSE] };
  const app = createApiApp({ repository: fakeRepository({ race }) });
  const res = await request(app, `/racecard?date=20261108&baba=${encodeURIComponent('佐賀')}&race=11`);
  assert.equal(res.status, 200);
  const body = JSON.parse(res.body);
  assert.equal(body.race_id, '202611081132');
  assert.equal(body.venue, '佐賀');
  assert.equal(body.horse_count, 1);
  assert.match(body.text, /### 1番 レッドファイブ/);

  const txt = await request(app, '/racecard?date=20261108&baba=32&race=11&format=text');
  assert.equal(txt.type, 'text/plain; charset=utf-8');
  assert.match(txt.body, /^# 出馬表/);
});

test('GET /racecard reports bad input with usage and missing races with the available ones', async () => {
  const bad = await request(createApiApp({ repository: fakeRepository() }), '/racecard?date=abc');
  assert.equal(bad.status, 400);
  assert.match(JSON.parse(bad.body).error, /YYYYMMDD/);

  const app = createApiApp({ repository: fakeRepository({ dayRaces: [{ babaCode: 32, raceNo: 1 }, { babaCode: 32, raceNo: 2 }] }) });
  const missing = await request(app, '/racecard?date=20261108&baba=32&race=11');
  assert.equal(missing.status, 404);
  assert.match(JSON.parse(missing.body).error, /1R, 2R/);
});
