'use strict';

const cheerio = require('cheerio');
const { THOROUGHBRED_VENUE_NAME_BY_BABA_CODE } = require('./venue-codes');
const { addRaceDay } = require('./race-days');

/**
 * table.schedule の tbody を解析してレース開催情報を返す。
 *
 * @param {string} html
 * @returns {Map<string, Array<{date:string, babaCode:number, venue:string}>>}
 */
function parseKeibaGoJpSchedule(html) {
  const $ = cheerio.load(html);
  const raceDays = new Map();

  $('table.schedule tbody tr').each((_, tr) => {
    if (!$(tr).find('td').length) return;

    $(tr).find('a[href*="k_raceDate"]').each((_, a) => {
      const href = $(a).attr('href') || '';
      const dateMatch = href.match(/k_raceDate=([^&"]+)/);
      const codeMatch = href.match(/k_babaCode=(\d+)/);
      if (!dateMatch || !codeMatch) return;

      const babaCode = parseInt(codeMatch[1], 10);
      const venueName = THOROUGHBRED_VENUE_NAME_BY_BABA_CODE[babaCode];
      if (!venueName) return;

      const rawDate = decodeURIComponent(dateMatch[1]);
      const parts = rawDate.split('/');
      if (parts.length !== 3) return;

      const y = parts[0];
      const m = parts[1].padStart(2, '0');
      const d = parts[2].padStart(2, '0');

      addRaceDay(raceDays, {
        ymd: `${y}${m}${d}`,
        date: `${y}-${m}-${d}`,
        babaCode,
        venue: venueName,
      });
    });
  });

  return raceDays;
}

class KeibaGoJpCalendarParser {
  parse(html) {
    return parseKeibaGoJpSchedule(html);
  }
}

module.exports = {
  KeibaGoJpCalendarParser,
  parseKeibaGoJpSchedule,
};
