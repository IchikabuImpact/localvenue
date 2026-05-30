#!/usr/bin/env node
/**
 * @file    001-save-monthly-calendar.js
 * @pipeline [1/5 朝バッチ] 月間開催カレンダー取得 → DB保存
 * @role    keiba.go.jp の MonthlyConveneInfoTop をスクレイピングし、
 *          NAR全会場の開催日程を `calendar` テーブルへ保存する。
 *
 * @input   keiba.go.jp MonthlyConveneInfoTop（HTML、SSR）
 * @output  DB: calendar (race_date, venucode, venue) — ON DUPLICATE KEY UPDATE
 * @calledby daily-yosou-batch.js [1]
 *
 * Usage:
 *   node 001-save-monthly-calendar.js           // 今月
 *   node 001-save-monthly-calendar.js 2025 09   // 年 月
 *   node 001-save-monthly-calendar.js 20250913  // YYYYMMDD形式（年月のみ使用）
 *   node 001-save-monthly-calendar.js 202509    // YYYYMM形式
 *
 * @copyright © 2026 IchikabuImpact
 * @license Commercial use prohibited without permission.
 */

'use strict';

const { spawn } = require('child_process');
const path = require('path');
const config = require('../config/config.js');
const { parseYearMonth } = require('./lib/calendar/parse-year-month');
const { KeibaGoJpCalendarClient } = require('./lib/calendar/keiba-go-jp-calendar-client');
const { KeibaGoJpCalendarParser } = require('./lib/calendar/keiba-go-jp-calendar-parser');
const { MySqlCalendarRepository } = require('./lib/calendar/mysql-calendar-repository');
const { SaveMonthlyCalendarUseCase } = require('./lib/calendar/save-monthly-calendar-use-case');

function exitAfterLogs(code) {
  process.exitCode = code;
  process.stdout.write('', () => {
    process.stderr.write('', () => process.exit(code));
  });
}

function runRakutenFallback() {
  const fallbackScript = path.join(__dirname, '001-save-monthly-calendar-rakuten.js');
  console.warn('[WARN] 楽天競馬カレンダーへフォールバックします...');

  const fallback = spawn(process.execPath, [fallbackScript, ...process.argv.slice(2)], {
    stdio: 'inherit',
    cwd: __dirname,
  });
  fallback.on('exit', code => exitAfterLogs(code ?? 1));
  fallback.on('error', err => {
    console.error('[FATAL] フォールバック起動失敗:', err.message);
    exitAfterLogs(1);
  });
}

(async () => {
  const { year, month } = parseYearMonth(process.argv);
  console.log(`[INFO] 取得対象: ${year}-${month}`);

  const useCase = new SaveMonthlyCalendarUseCase({
    calendarClient: new KeibaGoJpCalendarClient(),
    calendarParser: new KeibaGoJpCalendarParser(),
    calendarRepository: new MySqlCalendarRepository({ mysqlConfig: config.mysql }),
    logger: console,
  });

  try {
    await useCase.execute({ year, month });
    console.log('[INFO] 完了');
    exitAfterLogs(0);
  } catch (e) {
    console.error('[ERROR] keiba.go.jp 取得失敗:', e.message || e);
    runRakutenFallback();
  }
})();
