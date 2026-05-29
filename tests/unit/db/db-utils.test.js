const test = require('node:test');
const assert = require('node:assert/strict');
const { buildServerConnectionConfig, resolveDbConfig } = require('../../../scripts/lib/db/init-database');
const { predictionRoiDailyTableSql } = require('../../../scripts/lib/db/setup-phase1');
const { escapeMarkdownTableValue, rowsToMarkdown, schemaToMarkdown } = require('../../../scripts/lib/db/dump-db-context');

test('resolveDbConfig prefers config.db over config.mysql', () => {
  assert.deepEqual(resolveDbConfig({ db: { database: 'a' }, mysql: { database: 'b' } }), { database: 'a' });
});

test('buildServerConnectionConfig removes database and defaults host/port', () => {
  assert.deepEqual(buildServerConnectionConfig({ user: 'u', password: 'p', database: 'd' }), {
    host: 'localhost',
    user: 'u',
    password: 'p',
    port: 3306,
  });
});

test('predictionRoiDailyTableSql contains the expected table contract', () => {
  const sql = predictionRoiDailyTableSql();
  assert.match(sql, /CREATE TABLE IF NOT EXISTS prediction_roi_daily/);
  assert.match(sql, /PRIMARY KEY \(ymd, model_version, strategy\)/);
});

test('dump DB markdown helpers escape table data', () => {
  assert.equal(escapeMarkdownTableValue('a|b\nc'), 'a\\|b<br>c');
  assert.match(schemaToMarkdown([{ Field: 'id', Type: 'int', Null: 'NO', Key: 'PRI', Default: null, Extra: '' }]), /\| id \| int \|/);
  assert.match(rowsToMarkdown([{ memo: 'a|b' }]), /a\\\|b/);
});
