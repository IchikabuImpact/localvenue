#!/usr/bin/env node
/**
 * @file    001-save-monthly-calendar-rakuten.js
 * @role    【フォールバック】楽天競馬カレンダーから月間開催情報を取得してDBへ保存。
 *          keiba.go.jp が利用不可の場合に 001-save-monthly-calendar.js から自動で呼ばれる。
 *
 * 取得先:
 *   https://keiba.rakuten.co.jp/calendar  （POST: tYear, tMonth）
 *
 * @output  DB: calendar (race_date, venucode, venue) — ON DUPLICATE KEY UPDATE
 * @exitcodes 0=正常 / 1=失敗
 *
 * Usage:
 *   node 001-save-monthly-calendar-rakuten.js           // 今月
 *   node 001-save-monthly-calendar-rakuten.js 2026 06   // 年 月
 *   node 001-save-monthly-calendar-rakuten.js 20260526  // YYYYMMDD（年月のみ使用）
 *   node 001-save-monthly-calendar-rakuten.js 202606    // YYYYMM
 *
 * @copyright © 2026 IchikabuImpact
 * @license Commercial use prohibited without permission.
 */

'use strict';

const config = require('../config/config.js');
const { parseYearMonth } = require('./lib/calendar/parse-year-month');
const { RakutenCalendarClient } = require('./lib/calendar/rakuten-calendar-client');
const { RakutenCalendarParser } = require('./lib/calendar/rakuten-calendar-parser');
const { MySqlCalendarRepository } = require('./lib/calendar/mysql-calendar-repository');
const { SaveMonthlyCalendarUseCase } = require('./lib/calendar/save-monthly-calendar-use-case');

(async () => {
  const { year, month } = parseYearMonth(process.argv);
  console.log(`[INFO] 取得対象: ${year}-${month}（楽天競馬フォールバック）`);

  const useCase = new SaveMonthlyCalendarUseCase({
    calendarClient: new RakutenCalendarClient(),
    calendarParser: new RakutenCalendarParser(),
    calendarRepository: new MySqlCalendarRepository({
      mysqlConfig: config.mysql,
      useTransaction: false,
      successSuffix: ' (via Rakuten fallback)',
    }),
    logger: console,
  });

  await useCase.execute({ year, month });
  console.log('[INFO] 完了（楽天競馬フォールバック）');
})().catch((e) => {
  console.error('[FATAL]', e.message || e);
  process.exit(1);
});
