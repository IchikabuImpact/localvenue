'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const {
  ruleMatches,
  buildHorsePatternScoringFactor,
} = require('../../../scripts/lib/prediction/horse-pattern-factor');

const shishiRule = {
  horse_name: 'シシ',
  baba_code: 31,
  min_frame_number: 1,
  max_frame_number: 4,
  target_running_styles: '["逃げ","先行"]',
  max_escape_count_excluding_self: 0,
  max_front_runner_count: 3,
  bonus_pct: 10,
};

test('シシは高知の1-4枠で他に逃げ馬なし・先行勢3頭以下なら一致する', () => {
  const rows = [
    { horse_number: 1, horse_name: 'シシ', frame_number: 2, running_style: '先行' },
    { horse_number: 2, horse_name: 'A', frame_number: 5, running_style: '先行' },
    { horse_number: 3, horse_name: 'B', frame_number: 6, running_style: '差し' },
  ];

  assert.equal(ruleMatches(shishiRule, rows[0], { babaCode: 31, racingFormRows: rows }), true);
});

test('シシでも外枠・他の逃げ馬あり・先行勢過多は一致しない', () => {
  assert.equal(ruleMatches(shishiRule, { horse_number: 1, horse_name: 'シシ', frame_number: 5, running_style: '先行' }, {
    babaCode: 31,
    racingFormRows: [{ horse_number: 1, horse_name: 'シシ', frame_number: 5, running_style: '先行' }],
  }), false);

  assert.equal(ruleMatches(shishiRule, { horse_number: 1, horse_name: 'シシ', frame_number: 2, running_style: '先行' }, {
    babaCode: 31,
    racingFormRows: [
      { horse_number: 1, horse_name: 'シシ', running_style: '先行' },
      { horse_number: 2, horse_name: 'A', running_style: '逃げ' },
    ],
  }), false);

  assert.equal(ruleMatches(shishiRule, { horse_number: 1, horse_name: 'シシ', frame_number: 2, running_style: '先行' }, {
    babaCode: 31,
    racingFormRows: [
      { horse_number: 1, horse_name: 'シシ', running_style: '先行' },
      { horse_number: 2, horse_name: 'A', running_style: '先行' },
      { horse_number: 3, horse_name: 'B', running_style: '先行' },
      { horse_number: 4, horse_name: 'C', running_style: '先行' },
    ],
  }), false);
});

test('馬場状態を指定した個別パターンは対象馬場だけに一致する', () => {
  const rule = {
    horse_name: 'ハニーベリー',
    target_track_conditions: '["良"]',
    bonus_pct: 15,
  };
  const row = { horse_number: 11, horse_name: 'ハニーベリー' };

  assert.equal(ruleMatches(rule, row, { trackCondition: '良', racingFormRows: [row] }), true);
  assert.equal(ruleMatches(rule, row, { trackCondition: '稍重', racingFormRows: [row] }), false);
});

test('馬体重帯を指定した個別パターンは範囲内の馬体重だけに一致する', () => {
  const rule = {
    horse_name: 'ケンオーシャン',
    baba_code: 20,
    min_horse_weight: 486,
    max_horse_weight: 495,
    bonus_pct: 10,
  };

  assert.equal(ruleMatches(rule, { horse_name: 'ケンオーシャン', horse_weight: 486 }, { babaCode: 20, racingFormRows: [] }), true);
  assert.equal(ruleMatches(rule, { horse_name: 'ケンオーシャン', horse_weight: 495 }, { babaCode: 20, racingFormRows: [] }), true);
  assert.equal(ruleMatches(rule, { horse_name: 'ケンオーシャン', horse_weight: 485 }, { babaCode: 20, racingFormRows: [] }), false);
  assert.equal(ruleMatches(rule, { horse_name: 'ケンオーシャン', horse_weight: 496 }, { babaCode: 20, racingFormRows: [] }), false);
  assert.equal(ruleMatches(rule, { horse_name: 'ケンオーシャン', horse_weight: null }, { babaCode: 20, racingFormRows: [] }), false);
  assert.equal(ruleMatches(rule, { horse_name: 'ケンオーシャン', horse_weight: 490 }, { babaCode: 21, racingFormRows: [] }), false);
});

test('horsePatternファクターは一致したルールのbonus_pctをコアスコアに掛ける', () => {
  const factor = buildHorsePatternScoringFactor([shishiRule]);
  const row = { horse_number: 1, horse_name: 'シシ', frame_number: 1, running_style: '逃げ' };
  const bonus = factor.compute({
    row,
    coreScore: 123,
    raceContext: { babaCode: 31, racingFormRows: [row] },
  });

  assert.equal(factor.name, 'horsePattern');
  assert.equal(bonus, 12);
});
