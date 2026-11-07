const test = require('node:test');
const assert = require('node:assert/strict');
const {
  courseOfAffiliation,
  isSubsequenceName,
  matchAliases,
  methodOf,
} = require('../../../scripts/lib/trainer/trainer-master');

const M = (trainerId, fullName, affiliation) => ({ trainerId, fullName, affiliation, course: courseOfAffiliation(affiliation) });

test('courseOfAffiliation maps JBIS training centers to racecourses', () => {
  assert.equal(courseOfAffiliation('小林'), '大井');
  assert.equal(courseOfAffiliation('西脇'), '園田');
  assert.equal(courseOfAffiliation('浦和'), '浦和');
});

test('isSubsequenceName requires the same first char and in-order chars', () => {
  assert.equal(isSubsequenceName('佐々国', '佐々木 国明'), true);
  assert.equal(isSubsequenceName('櫻田樹', '櫻田 浩樹'), true);
  assert.equal(isSubsequenceName('入口由', '入口 由美子'), true);
  assert.equal(isSubsequenceName('田中人', '中田 人'), false);
  assert.equal(isSubsequenceName('加藤義', '加藤 和宏'), false);
});

test('methodOf distinguishes exact, prefix and subsequence', () => {
  assert.equal(methodOf('伊藤和', '伊藤 和'), 'exact');
  assert.equal(methodOf('入口由', '入口 由美子'), 'prefix');
  assert.equal(methodOf('佐々国', '佐々木 国明'), 'subsequence');
});

test('matchAliases narrows candidates by the course the trainer runs at', () => {
  const masters = [M(1, '佐藤 祐司', '水沢'), M(2, '佐藤 祐二', '川崎')];
  const { aliases } = matchAliases({ masters, shortNames: [{ shortName: '佐藤祐', venueCounts: { 10: 155, 11: 73 } }] });
  assert.deepEqual(aliases, [{ shortName: '佐藤祐', trainerId: 1, course: '水沢', matchMethod: 'prefix' }]);
});

test('matchAliases links one short name to two trainers when it runs at two separate courses', () => {
  const masters = [M(1, '佐藤 祐司', '水沢'), M(2, '佐藤 祐二', '川崎')];
  const { aliases } = matchAliases({ masters, shortNames: [{ shortName: '佐藤祐', venueCounts: { 10: 100, 21: 80 } }] });
  assert.deepEqual(aliases.map((a) => a.trainerId).sort(), [1, 2]);
});

test('matchAliases treats 小林 trainers as 大井', () => {
  const masters = [M(1, '橋本 和馬', '小林'), M(2, '橋本 忠明', '西脇')];
  const { aliases } = matchAliases({ masters, shortNames: [{ shortName: '橋本馬', venueCounts: { 20: 124, 19: 4 } }] });
  assert.equal(aliases[0].trainerId, 1);
});

test('matchAliases resolves an ambiguous name after the other candidate is claimed', () => {
  const masters = [M(1, '加藤 和義', '金沢'), M(2, '加藤 和宏', '金沢')];
  const { aliases, unresolved } = matchAliases({
    masters,
    shortNames: [
      { shortName: '加藤和', venueCounts: { 22: 405 } },
      { shortName: '加藤義', venueCounts: { 22: 168 } },
    ],
  });
  assert.deepEqual(unresolved, []);
  assert.deepEqual(Object.fromEntries(aliases.map((a) => [a.shortName, a.trainerId])), { 加藤和: 2, 加藤義: 1 });
});

test('matchAliases prefers an exact match over a longer prefix match', () => {
  const masters = [M(1, '伊藤 和', '水沢'), M(2, '伊藤 和忍', '水沢')];
  const { aliases } = matchAliases({
    masters,
    shortNames: [
      { shortName: '伊藤和', venueCounts: { 11: 126 } },
      { shortName: '伊藤忍', venueCounts: { 11: 143 } },
    ],
  });
  assert.deepEqual(Object.fromEntries(aliases.map((a) => [a.shortName, a.trainerId])), { 伊藤和: 1, 伊藤忍: 2 });
});

test('matchAliases falls back to JRA trainers for exchange races', () => {
  const masters = [M(1, '久保田 貴士', '中央'), M(2, '久保 隆', '浦和')];
  const { aliases } = matchAliases({ masters, shortNames: [{ shortName: '久保貴', venueCounts: { 20: 2 } }] });
  assert.equal(aliases[0].trainerId, 1);
});

test('matchAliases skips manual short names and reports unresolved ones', () => {
  const masters = [M(1, '入口 由美子', '浦和')];
  const { aliases, unresolved } = matchAliases({
    masters,
    shortNames: [
      { shortName: '入口由', venueCounts: { 18: 80 } },
      { shortName: '稲田彰', venueCounts: { 27: 131 }, starts: 131 },
    ],
    skip: new Set(['入口由']),
  });
  assert.deepEqual(aliases, []);
  assert.equal(unresolved.length, 1);
  assert.equal(unresolved[0].shortName, '稲田彰');
});
