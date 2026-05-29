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
