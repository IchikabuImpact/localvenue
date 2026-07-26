'use strict';
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');
const { MySqlPredictionRepository } = require('../../../scripts/lib/prediction/mysql-prediction-repository');

test('prediction保存SQLはdata/schema.sqlのprediction定義と互換性がある', () => {
  const schema = fs.readFileSync(path.join(__dirname, '../../../data/schema.sql'), 'utf8');
  const table = schema.match(/CREATE TABLE `prediction` \([\s\S]*?\n\) ENGINE=/)[0];
  assert.match(table, /`race_id` bigint NOT NULL/);
  assert.match(table, /`model_version` varchar\(32\)/);
  assert.match(table, /`memo` json NOT NULL/);
  assert.match(table, /UNIQUE KEY `uq_prediction_race_model` \(`race_id`,`model_version`\)/);
});

test('horse_win_pattern_rulesは1頭ごとの勝ちパターン条件を保持できる', () => {
  const schema = fs.readFileSync(path.join(__dirname, '../../../data/schema.sql'), 'utf8');
  const table = schema.match(/CREATE TABLE `horse_win_pattern_rules` \([\s\S]*?\n\) ENGINE=/)[0];
  assert.match(table, /`horse_name` varchar\(64\) NOT NULL/);
  assert.match(table, /`pattern_type` varchar\(32\)/);
  assert.match(table, /`baba_code` tinyint/);
  assert.match(table, /`min_frame_number` tinyint/);
  assert.match(table, /`max_frame_number` tinyint/);
  assert.match(table, /`target_running_styles` json/);
  assert.match(table, /`max_escape_count_excluding_self` tinyint/);
  assert.match(table, /`max_front_runner_count` tinyint/);
  assert.match(table, /`bonus_pct` decimal\(5,2\) NOT NULL/);
  assert.match(table, /UNIQUE KEY `uq_horse_win_pattern_rule_code` \(`rule_code`\)/);
});

test('MySqlPredictionRepositoryはprediction upsertを実行する', async () => {
  const calls = [];
  const mockPool = {
    execute: async (sql, params) => { calls.push({ sql, params }); return [{ affectedRows: 1 }]; },
  };
  const repo = new MySqlPredictionRepository({ pool: mockPool });
  await repo.connect();
  await repo.savePrediction({ raceId: '202605230131', modelVersion: 'yosou-v1', memo: { ok: true } });
  await repo.close();

  assert.equal(calls.length, 1);
  assert.match(calls[0].sql, /INSERT INTO prediction \(race_id, model_version, memo\)/);
  assert.deepEqual(calls[0].params, ['202605230131', 'yosou-v1', '{"ok":true}']);
});

test('MySqlPredictionRepositoryは有効な馬別勝ちパターンをrace_idの場コードと日付で取得する', async () => {
  const calls = [];
  const mockPool = {
    execute: async (sql, params) => {
      calls.push({ sql, params });
      return [[{ rule_code: 'shishi_kochi_inner_type_s' }]];
    },
  };
  const repo = new MySqlPredictionRepository({ pool: mockPool });
  const rows = await repo.findActiveHorsePatternRules('202607250131');

  assert.deepEqual(rows, [{ rule_code: 'shishi_kochi_inner_type_s' }]);
  assert.match(calls[0].sql, /FROM horse_win_pattern_rules/);
  assert.match(calls[0].sql, /baba_code IS NULL OR baba_code = \?/);
  assert.deepEqual(calls[0].params, [31, '20260725', '20260725']);
});

test('MySqlPredictionRepositoryは馬別勝ちパターンテーブル未作成なら空配列で予想を継続できる', async () => {
  const mockPool = {
    execute: async () => {
      const error = new Error("Table 'localvenue.horse_win_pattern_rules' doesn't exist");
      error.code = 'ER_NO_SUCH_TABLE';
      error.errno = 1146;
      throw error;
    },
  };
  const repo = new MySqlPredictionRepository({ pool: mockPool });
  const rows = await repo.findActiveHorsePatternRules('202607250131');

  assert.deepEqual(rows, []);
});
