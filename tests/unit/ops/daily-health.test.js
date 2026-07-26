'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const test = require('node:test');
const assert = require('node:assert/strict');
const {
  countHtmlFiles,
  findNoPredictionFiles,
  healthFailures,
} = require('../../../scripts/lib/ops/daily-health');

test('countHtmlFiles counts only target-day race pages', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'localvenue-health-'));
  fs.writeFileSync(path.join(dir, '202607260110.html'), '');
  fs.writeFileSync(path.join(dir, '202607260210.html'), '');
  fs.writeFileSync(path.join(dir, '20260725.html'), '');
  fs.writeFileSync(path.join(dir, 'index.html'), '');

  assert.equal(countHtmlFiles(dir, '20260726'), 2);
});

test('findNoPredictionFiles detects no-prediction markers in generated pages', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'localvenue-health-'));
  fs.mkdirSync(path.join(dir, 'daily', '20260726'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), '<span>◎ - 予想なし</span>');
  fs.writeFileSync(path.join(dir, '202607260110.html'), '<span>◎ 2 A</span>');
  fs.writeFileSync(path.join(dir, 'daily', '20260726', 'index.html'), '<span>OK</span>');

  assert.deepEqual(findNoPredictionFiles(dir, '20260726'), ['index.html']);
});

test('healthFailures reports prediction/html mismatches and missing schema', () => {
  const failures = healthFailures({
    races: 30,
    predictions: 29,
    htmlTop: 30,
    htmlDaily: 28,
    noPredictionFiles: ['index.html'],
    hasHorsePatternRules: false,
  });

  assert.deepEqual(failures, [
    'horse_win_pattern_rules table missing',
    'prediction count mismatch: races=30 predictions=29',
    'daily html count mismatch: races=30 html=28',
    'no-prediction marker found: index.html',
  ]);
});
