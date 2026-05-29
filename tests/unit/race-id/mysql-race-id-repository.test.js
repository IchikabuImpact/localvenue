'use strict';

const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');
const { MySqlRaceIdRepository } = require('../../../scripts/lib/race-id/mysql-race-id-repository');

test('race_id生成元SQLはdata/schema.sqlのrace_count_by_date定義と互換性がある', () => {
  const schema = fs.readFileSync(path.join(__dirname, '../../../data/schema.sql'), 'utf8');
  const tableMatch = schema.match(/CREATE TABLE `race_count_by_date` \([\s\S]*?\n\) ENGINE=/);

  assert.ok(tableMatch, 'schema.sql に race_count_by_date テーブル定義が存在すること');
  const table = tableMatch[0];

  assert.match(table, /`ymd` char\(8\) NOT NULL/);
  assert.match(table, /`venue_code` varchar\(4\) NOT NULL/);
  assert.match(table, /`total_races` int NOT NULL/);
  assert.match(table, /PRIMARY KEY \(`ymd`,`venue_code`\)/);
});

test('MySqlRaceIdRepositoryはrace_count_by_dateからvenue_codeとtotal_racesをymd順条件で取得する', async () => {
  const calls = [];
  const rows = [{ venue_code: '31', total_races: 11 }];
  const conn = {
    execute: async (sql, params) => {
      calls.push(['execute', sql, params]);
      return [rows];
    },
    end: async () => calls.push(['end']),
  };
  const mysqlClient = {
    createConnection: async config => {
      calls.push(['createConnection', config]);
      return conn;
    },
  };
  const repository = new MySqlRaceIdRepository({
    mysqlConfig: {
      host: 'localhost',
      user: 'user',
      password: 'pass',
      database: 'localvenue_test',
      port: 3306,
    },
    mysqlClient,
  });

  await repository.connect();
  const result = await repository.findRaceCountsByYmd('20260523');
  await repository.close();

  assert.equal(result, rows);
  assert.deepEqual(calls[0], ['createConnection', {
    host: 'localhost',
    user: 'user',
    password: 'pass',
    database: 'localvenue_test',
    port: 3306,
  }]);
  assert.equal(calls[1][0], 'execute');
  assert.match(calls[1][1], /SELECT venue_code, total_races/);
  assert.match(calls[1][1], /FROM race_count_by_date/);
  assert.match(calls[1][1], /WHERE ymd = \?/);
  assert.match(calls[1][1], /ORDER BY venue_code/);
  assert.deepEqual(calls[1][2], ['20260523']);
  assert.deepEqual(calls[2], ['end']);
});
