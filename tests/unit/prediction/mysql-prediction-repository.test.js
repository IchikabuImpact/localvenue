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

test('MySqlPredictionRepositoryは必要なSELECTとprediction upsertを実行する', async () => {
  const calls = [];
  const conn = {
    execute: async (sql, params) => { calls.push(['execute', sql, params]); return [[]]; },
    end: async () => calls.push(['end']),
  };
  const repository = new MySqlPredictionRepository({
    mysqlConfig: { host: 'localhost', user: 'u', password: 'p', port: 3306, database: 'db' },
    mysqlClient: { createConnection: async config => { calls.push(['createConnection', config]); return conn; } },
  });
  await repository.connect();
  await repository.findRacingFormRows('202605230131');
  await repository.findJockeyScores(2026);
  await repository.findTrainerScores(2026);
  await repository.findSireScores();
  await repository.savePrediction({ raceId: '202605230131', modelVersion: 'yosou-v1', memo: { ok: true } });
  await repository.close();

  assert.match(calls[1][1], /FROM racing_form/);
  assert.match(calls[2][1], /FROM jockey_ranking/);
  assert.match(calls[3][1], /FROM trainer_ranking/);
  assert.match(calls[4][1], /FROM sire_ranking/);
  assert.match(calls[5][1], /INSERT INTO prediction \(race_id, model_version, memo\)/);
  assert.deepEqual(calls[5][2], ['202605230131', 'yosou-v1', '{"ok":true}']);
});
