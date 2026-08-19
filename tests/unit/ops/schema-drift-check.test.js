'use strict';

const fs = require('fs');
const path = require('path');
const test = require('node:test');
const assert = require('node:assert/strict');
const { parseSchemaColumns, findSchemaDrift } = require('../../../scripts/lib/ops/schema-drift-check');

const SAMPLE_SCHEMA = `
CREATE TABLE \`sample_rules\` (
  \`rule_id\` bigint NOT NULL AUTO_INCREMENT,
  \`horse_name\` varchar(64) NOT NULL,
  \`min_horse_weight\` smallint DEFAULT NULL,
  \`max_horse_weight\` smallint DEFAULT NULL,
  PRIMARY KEY (\`rule_id\`),
  UNIQUE KEY \`uq_sample_rules\` (\`rule_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

test('parseSchemaColumnsはCREATE TABLE本文からカラム名だけを抽出しKEY行を無視する', () => {
  const tables = parseSchemaColumns(SAMPLE_SCHEMA);
  assert.deepEqual(tables, {
    sample_rules: ['rule_id', 'horse_name', 'min_horse_weight', 'max_horse_weight'],
  });
});

test('findSchemaDriftは実DBに存在しないカラムをmissing_columnsとして報告する', async () => {
  const mockPool = {
    execute: async () => [[{ COLUMN_NAME: 'rule_id' }, { COLUMN_NAME: 'horse_name' }]],
  };

  const drift = await findSchemaDrift({ pool: mockPool, schemaSql: SAMPLE_SCHEMA });

  assert.deepEqual(drift, [
    { table: 'sample_rules', status: 'missing_columns', missingColumns: ['min_horse_weight', 'max_horse_weight'] },
  ]);
});

test('findSchemaDriftは実DBにテーブルが存在しない場合missing_tableを報告する', async () => {
  const mockPool = { execute: async () => [[]] };

  const drift = await findSchemaDrift({ pool: mockPool, schemaSql: SAMPLE_SCHEMA });

  assert.deepEqual(drift, [{ table: 'sample_rules', status: 'missing_table' }]);
});

test('findSchemaDriftはカラムが揃っていれば空配列を返す', async () => {
  const mockPool = {
    execute: async () => [[
      { COLUMN_NAME: 'rule_id' },
      { COLUMN_NAME: 'horse_name' },
      { COLUMN_NAME: 'min_horse_weight' },
      { COLUMN_NAME: 'max_horse_weight' },
    ]],
  };

  const drift = await findSchemaDrift({ pool: mockPool, schemaSql: SAMPLE_SCHEMA });

  assert.deepEqual(drift, []);
});

test('実プロジェクトのdata/schema.sqlをパースしてhorse_win_pattern_rulesに馬体重カラムが定義されている', () => {
  const schemaSql = fs.readFileSync(path.join(__dirname, '../../../data/schema.sql'), 'utf8');
  const tables = parseSchemaColumns(schemaSql);

  assert.ok(tables.horse_win_pattern_rules, 'horse_win_pattern_rules がパースできること');
  assert.ok(tables.horse_win_pattern_rules.includes('min_horse_weight'));
  assert.ok(tables.horse_win_pattern_rules.includes('max_horse_weight'));
});
