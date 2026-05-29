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
