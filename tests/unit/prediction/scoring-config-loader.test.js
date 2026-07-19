'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {
  DEFAULT_SCORING_CONFIG_PATH,
  deepMerge,
  resolveScoringConfigPath,
  validateScoringConfig,
  loadScoringConfig,
} = require('../../../scripts/lib/prediction/scoring-config-loader');

test('resolveScoringConfigPathは指定なしなら既定JSONを返す', () => {
  assert.equal(resolveScoringConfigPath(null, { env: {} }), DEFAULT_SCORING_CONFIG_PATH);
});

test('resolveScoringConfigPathは相対パスをprojectRoot基準で解決する', () => {
  assert.equal(
    resolveScoringConfigPath('config/scoring/default.json', { env: {}, projectRoot: '/tmp/project' }),
    path.join('/tmp/project', 'config/scoring/default.json')
  );
});

test('deepMergeは部分設定を既定値へ重ねる', () => {
  assert.deepEqual(
    deepMerge({ a: 1, b: { c: 2, d: [1] } }, { b: { c: 3 } }),
    { a: 1, b: { c: 3, d: [1] } }
  );
});

test('loadScoringConfigはJSONを読み込み不足項目を既定値で補完する', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'localvenue-scoring-'));
  const file = path.join(dir, 'scoring.json');
  fs.writeFileSync(file, JSON.stringify({
    version: 'test-config',
    summerBonus: {
      fastTrackSireRules: [{ name: 'ロードカナロア', pct: 20 }],
    },
  }));

  const loaded = loadScoringConfig({ configPath: file, env: {} });

  assert.equal(loaded.path, file);
  assert.equal(loaded.config.version, 'test-config');
  assert.deepEqual(loaded.config.summerBonus.fastTrackSireRules, [{ name: 'ロードカナロア', pct: 20 }]);
  assert.equal(loaded.config.summerBonus.startYmd, '20260701');
  assert.equal(loaded.config.summerBonus.weightAllowance.pct, 3);
});

test('validateScoringConfigは壊れた補正ルールを拒否する', () => {
  assert.throws(
    () => validateScoringConfig({
      summerBonus: {
        startYmd: '20260701',
        endYmd: '20260930',
        fastTrackConditions: [],
        wetTrackConditions: [],
        fastTrackSireRules: [{ name: '', pct: 10 }],
      },
    }),
    /name must be a non-empty string/
  );
});
