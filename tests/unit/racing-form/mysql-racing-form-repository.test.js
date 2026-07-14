'use strict';
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');
const { buildRacingFormParams, buildRacingFormUpsert, RACING_FORM_COLUMNS } = require('../../../scripts/lib/racing-form/mysql-racing-form-repository');

test('racing_form保存列はdata/schema.sqlと互換性がある', () => {
  const schema = fs.readFileSync(path.join(__dirname, '../../../data/schema.sql'), 'utf8');
  const table = schema.match(/CREATE TABLE `racing_form` \([\s\S]*?\n\) ENGINE=/)[0];
  for (const col of RACING_FORM_COLUMNS) assert.match(table, new RegExp('`' + col + '`'));
  assert.match(table, /PRIMARY KEY \(`race_id`,`horse_number`\)/);
});

test('buildRacingFormUpsertはracing_formへupsertするSQLを作る', () => {
  const sql = buildRacingFormUpsert([{}]);
  assert.match(sql, /INSERT INTO racing_form/);
  assert.match(sql, /ON DUPLICATE KEY UPDATE/);
  assert.match(sql, /updated_at=CURRENT_TIMESTAMP/);
});

test('buildRacingFormParamsは既存カラム順でパラメータを作る', () => {
  const params = buildRacingFormParams({ raceId: '202605230131', rows: [{
    frame_number: 1, horse_number: 2, horse_name: '馬', sex_age: '牡3', hair: '鹿毛', birthyear: 23, birthymonth: 5,
    sire: '父', dam: '母', broodmare_sire: '母父', jockey: '騎手', affiliation: '高知', burden_weight: 56,
    trainer: '調教師', owner: '馬主', breeder: '生産者', horse_weight: 456, horse_weight_diff: -10,
  }] });
  assert.deepEqual(params, ['202605230131', 1, 2, '馬', '牡3', '鹿毛', 23, 5, '父', '母', '母父', '騎手', '高知', 56, '調教師', '馬主', '生産者', 456, -10, null, null, null]);
});
