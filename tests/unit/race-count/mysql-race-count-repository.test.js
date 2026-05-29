'use strict';

const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');
const { MySqlRaceCountRepository } = require('../../../scripts/lib/race-count/mysql-race-count-repository');

test('race_count_by_date保存SQLはdata/schema.sqlの定義と互換性がある', () => {
  const schema = fs.readFileSync(path.join(__dirname, '../../../data/schema.sql'), 'utf8');
  const tableMatch = schema.match(/CREATE TABLE `race_count_by_date` \([\s\S]*?\n\) ENGINE=/);

  assert.ok(tableMatch, 'schema.sql に race_count_by_date テーブル定義が存在すること');
  const table = tableMatch[0];

  assert.match(table, /`ymd` char\(8\) NOT NULL/);
  assert.match(table, /`venue_code` varchar\(4\) NOT NULL/);
  assert.match(table, /`total_races` int NOT NULL/);
  assert.match(table, /PRIMARY KEY \(`ymd`,`venue_code`\)/);
});

test('race_cnt互換保存SQLはdata/schema.sqlの定義と互換性がある', () => {
  const schema = fs.readFileSync(path.join(__dirname, '../../../data/schema.sql'), 'utf8');
  const tableMatch = schema.match(/CREATE TABLE `race_cnt` \([\s\S]*?\n\) ENGINE=/);

  assert.ok(tableMatch, 'schema.sql に race_cnt テーブル定義が存在すること');
  const table = tableMatch[0];

  assert.match(table, /`id` varchar\(10\).*NOT NULL/);
  assert.match(table, /`cnt` int NOT NULL/);
  assert.match(table, /PRIMARY KEY \(`id`\)/);
});

test('MySqlRaceCountRepositoryはcalendarから会場を読みrace_cntとrace_count_by_dateへupsertする', async () => {
  const calls = [];
  const conn = {
    execute: async (sql, params) => {
      calls.push(['execute', sql, params]);
      if (/SELECT venucode FROM calendar/.test(sql)) return [[{ venucode: 31 }, { venucode: 32 }]];
      return [{ affectedRows: 1 }];
    },
    beginTransaction: async () => calls.push(['beginTransaction']),
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
  const repository = new MySqlRaceCountRepository({
    mysqlConfig: {
      host: 'localhost',
      user: 'user',
      password: 'pass',
      port: 3306,
      database: 'localvenue_test',
    },
    mysqlClient,
  });

  await repository.connect();
  const codes = await repository.findVenueCodesByDate('2026-05-23');
  await repository.beginTransaction();
  await repository.saveRaceCount({ ymd: '20260523', venueCode: 31, totalRaces: 11 });
  await repository.commit();
  await repository.close();

  assert.deepEqual(codes, [31, 32]);
  assert.match(calls[1][1], /SELECT venucode FROM calendar WHERE race_date = \? ORDER BY venucode/);
  assert.deepEqual(calls[1][2], ['2026-05-23']);
  assert.deepEqual(calls[2], ['beginTransaction']);
  assert.match(calls[3][1], /INSERT INTO race_cnt \(id, cnt\)/);
  assert.deepEqual(calls[3][2], ['2026052331', 11]);
  assert.match(calls[4][1], /INSERT INTO race_count_by_date \(ymd, venue_code, total_races\)/);
  assert.deepEqual(calls[4][2], ['20260523', '31', 11]);
  assert.deepEqual(calls[5], ['commit']);
  assert.deepEqual(calls[6], ['end']);
});
