'use strict';

const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');
const { MySqlCalendarRepository } = require('../../../scripts/lib/calendar/mysql-calendar-repository');

function silentLogger() {
  return { log() {}, warn() {}, error() {} };
}

test('calendar保存SQLはdata/schema.sqlのcalendar定義と互換性がある', () => {
  const schema = fs.readFileSync(path.join(__dirname, '../../../data/schema.sql'), 'utf8');
  const calendarTableMatch = schema.match(/CREATE TABLE `calendar` \([\s\S]*?\n\) ENGINE=/);

  assert.ok(calendarTableMatch, 'schema.sql に calendar テーブル定義が存在すること');
  const calendarTable = calendarTableMatch[0];

  assert.match(calendarTable, /`race_date` date NOT NULL/);
  assert.match(calendarTable, /`venucode` int NOT NULL/);
  assert.match(calendarTable, /`venue` varchar\(255\).*DEFAULT NULL/);
  assert.match(calendarTable, /PRIMARY KEY \(`race_date`,`venucode`\)/);
});

test('MySqlCalendarRepositoryはcalendar(race_date, venucode, venue)へupsertする', async () => {
  const calls = [];
  const conn = {
    beginTransaction: async () => calls.push(['beginTransaction']),
    execute: async (sql, params) => calls.push(['execute', sql, params]),
    commit: async () => calls.push(['commit']),
    rollback: async () => calls.push(['rollback']),
    end: async () => calls.push(['end']),
  };
  const mysqlClient = {
    createConnection: async config => {
      calls.push(['createConnection', config]);
      return conn;
    },
  };
  const repository = new MySqlCalendarRepository({
    mysqlConfig: {
      host: 'localhost',
      user: 'user',
      password: 'pass',
      database: 'localvenue_test',
      port: 3306,
    },
    mysqlClient,
    logger: silentLogger(),
  });
  const raceDays = new Map([
    ['20260502', [{ date: '2026-05-02', babaCode: 31, venue: '高知' }]],
  ]);

  const savedRows = await repository.saveRaceDays(raceDays);

  assert.equal(savedRows, 1);
  assert.deepEqual(calls[0], ['createConnection', {
    host: 'localhost',
    user: 'user',
    password: 'pass',
    database: 'localvenue_test',
    port: 3306,
    charset: 'utf8mb4',
  }]);
  assert.deepEqual(calls[1], ['beginTransaction']);
  assert.equal(calls[2][0], 'execute');
  assert.match(calls[2][1], /INSERT INTO calendar \(race_date, venucode, venue\)/);
  assert.match(calls[2][1], /ON DUPLICATE KEY UPDATE venue = VALUES\(venue\)/);
  assert.deepEqual(calls[2][2], ['2026-05-02', 31, '高知']);
  assert.deepEqual(calls[3], ['commit']);
  assert.deepEqual(calls[4], ['end']);
});
