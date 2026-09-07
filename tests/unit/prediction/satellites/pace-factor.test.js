'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { computePaceBonuses, classifyPace, CAP_PCT } = require('../../../../scripts/lib/prediction/satellites/pace-factor');

function row(horse_number, running_style) {
  return { horse_number, running_style };
}

test('逃げ+先行が4頭以上でハイペース判定', () => {
  const rows = [
    row(1, '逃げ'), row(2, '先行'), row(3, '先行'), row(4, '先行'),
    row(5, '差し'), row(6, '追込'),
  ];
  assert.equal(classifyPace(rows), 'high');
});

test('逃げ+先行が1頭以下でスローペース判定', () => {
  const rows = [
    row(1, '逃げ'), row(2, '差し'), row(3, '差し'), row(4, '追込'),
  ];
  assert.equal(classifyPace(rows), 'slow');
});

test('逃げ+先行が0頭でもスローペース判定', () => {
  const rows = [row(1, '差し'), row(2, '追込')];
  assert.equal(classifyPace(rows), 'slow');
});

test('逃げ+先行が2〜3頭でミドルペース判定', () => {
  const rows = [row(1, '逃げ'), row(2, '先行'), row(3, '差し')];
  assert.equal(classifyPace(rows), 'middle');
});

test('running_styleがnullの馬は集計から除外される', () => {
  const rows = [row(1, '逃げ'), row(2, null), row(3, null), row(4, null)];
  assert.equal(classifyPace(rows), 'slow');
});

test('ハイペース時は差し・追込にボーナス、逃げ・先行にはなし', () => {
  const rows = [
    row(1, '逃げ'), row(2, '先行'), row(3, '先行'), row(4, '先行'),
    row(5, '差し'), row(6, '追込'),
  ];
  const result = computePaceBonuses(rows);
  assert.equal(result.paceType, 'high');
  assert.equal(result.bonuses.has(1), false);
  assert.equal(result.bonuses.has(2), false);
  assert.ok(result.bonuses.get(5) > 0);
  assert.ok(result.bonuses.get(6) > 0);
  assert.equal(result.capPct, CAP_PCT);
});

test('スローペース時は逃げ・先行にボーナス、差し・追込にはなし', () => {
  const rows = [row(1, '逃げ'), row(2, '差し'), row(3, '追込')];
  const result = computePaceBonuses(rows);
  assert.equal(result.paceType, 'slow');
  assert.ok(result.bonuses.get(1) > 0);
  assert.equal(result.bonuses.has(2), false);
  assert.equal(result.bonuses.has(3), false);
});
