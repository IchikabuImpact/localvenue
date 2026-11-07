const test = require('node:test');
const assert = require('node:assert/strict');
const {
  buildPeopleRankingUrl,
  buildSireRankingUrl,
  parsePeopleRanking,
  parseSireRanking,
  scoreFromRank,
} = require('../../../scripts/lib/ranking/jbis-ranking');

const html = `
<div class="data-7__inner">
  <div><div>順位</div></div>
  <div><div>2</div><div class="jc-left"><a href="/horse/jockey/222/">騎手B</a></div></div>
  <div><div>1</div><div class="jc-left"><a href="/horse/jockey/111/">騎手A</a></div></div>
  <div><div>1</div><div class="jc-left"><a href="/horse/jockey/999/">重複</a></div></div>
</div>`;

test('parsePeopleRanking extracts sorted unique people rows', () => {
  assert.deepEqual(parsePeopleRanking(html, { hrefContains: '/horse/jockey/', nameKey: 'jockeyName' }), [
    { rank: 1, jockeyName: '騎手A' },
    { rank: 2, jockeyName: '騎手B' },
  ]);
});

test('parseSireRanking extracts sire id/name and de-duplicates by sire id', () => {
  const sireHtml = `
  <div class="data-7__inner">
    <div><div>1</div><div class="jc-left"><a href="/horse/0001/">父A</a></div></div>
    <div><div>2</div><div class="jc-left"><a href="/horse/jockey/0002/">騎手</a><a href="/horse/0002/">父B</a></div></div>
    <div><div>3</div><div class="jc-left"><a href="/horse/0001/">父A重複</a></div></div>
  </div>`;
  assert.deepEqual(parseSireRanking(sireHtml), [
    { rank: 1, sireId: '0001', sireName: '父A' },
    { rank: 2, sireId: '0002', sireName: '父B' },
  ]);
});

test('ranking URL builders keep legacy query contract', () => {
  const peopleUrl = new URL(buildPeopleRankingUrl({ year: 2026, division: 3, ranking: '9' }));
  assert.equal(peopleUrl.searchParams.get('ranking'), '9');
  assert.equal(peopleUrl.searchParams.get('y2'), '2024');
  const sireUrl = new URL(buildSireRankingUrl(1300, new Date('2026-05-29T00:00:00Z')));
  assert.equal(sireUrl.searchParams.get('ranking'), '7');
  assert.equal(sireUrl.searchParams.get('distance_f'), '1300');
  assert.equal(sireUrl.searchParams.get('y_f'), '2025');
});

test('scoreFromRank maps rank 1 to 100 and rank 100 to 1', () => {
  assert.equal(scoreFromRank(1), 100);
  assert.equal(scoreFromRank(100), 1);
});

test('fetch-sire-ranking parseDistanceArg validates the CLI distance', () => {
  const { parseDistanceArg } = require('../../../scripts/fetch-sire-ranking');
  assert.equal(parseDistanceArg('1300'), 1300);
  assert.throws(() => parseDistanceArg('bad'), /Usage: node fetch-sire-ranking/);
});

test('splitCsvLine handles quoted commas and escaped quotes', () => {
  const { splitCsvLine } = require('../../../scripts/lib/ranking/jbis-ranking');
  assert.deepEqual(splitCsvLine('"1","a,b","c""d",""'), ['1', 'a,b', 'c"d', '']);
});

test('parseTrainerRankingCsv splits trainer name and affiliation', () => {
  const { parseTrainerRankingCsv } = require('../../../scripts/lib/ranking/jbis-ranking');
  const csv = [
    '"順位","調教師名","出走回数","重賞勝回数","1着","2着","3着","着外","勝率","連対率","複勝率","収得賞金（万円）"',
    '"1","笹野 博司(笠 松)","644","2","163","83","80","318","0.25","0.38","0.48","15868.3"',
    '"2","田中 淳司(北海道)","758","10","153","118","116","371","0.20","0.36","0.50","33580.8"',
    '',
  ].join('\r\n');
  assert.deepEqual(parseTrainerRankingCsv(csv), [
    { rank: 1, trainerName: '笹野 博司', affiliation: '笠松', starts: 644, wins: 163, winRate: 0.25, placeRate: 0.48, prizeMan: 15868.3 },
    { rank: 2, trainerName: '田中 淳司', affiliation: '北海道', starts: 758, wins: 153, winRate: 0.2, placeRate: 0.5, prizeMan: 33580.8 },
  ]);
});

test('buildPeopleRankingCsvUrl points to the JBIS csv endpoint with prize order', () => {
  const { buildPeopleRankingCsvUrl } = require('../../../scripts/lib/ranking/jbis-ranking');
  const url = new URL(buildPeopleRankingCsvUrl({ csvName: 'leadingTrainer', year: 2026, division: 3, ranking: '9' }));
  assert.equal(url.pathname, '/ranking/csv/leadingTrainer/');
  assert.equal(url.searchParams.get('sort'), 'prize');
  assert.equal(url.searchParams.get('order'), 'D');
  assert.equal(url.searchParams.get('division'), '3');
  assert.equal(url.searchParams.get('y_f'), '2026');
});
