'use strict';

const cheerio = require('cheerio');
const { RAKUTEN_VENUE_BY_NAME } = require('./venue-codes');
const { addRaceDay } = require('./race-days');

/**
 * 楽天競馬カレンダーの tbody tr.place を解析して開催情報を返す。
 *
 * @param {string} html
 * @param {{year:string, month:string, logger?:Console}} params
 * @returns {Map<string, Array<{date:string, babaCode:number, venue:string}>>}
 */
function parseRakutenSchedule(html, { year, month, logger = console }) {
  const $ = cheerio.load(html);
  const heading = $('h2').text();
  const expectedHeading = `${year}年${parseInt(month, 10)}月`;

  if (!heading.includes(expectedHeading)) {
    logger.warn(`[WARN] ページの見出し "${heading.trim()}" が期待値 "${expectedHeading}" と不一致`);
  } else {
    logger.log(`[INFO] ページ確認: ${heading.trim()}`);
  }

  const raceDays = new Map();

  $('tbody tr.place').each((_, tr) => {
    const venueTh = $(tr).find('th[scope="row"]').first();
    if (!venueTh.length) return;

    const rawVenueName = venueTh.text().trim();
    const venueInfo = RAKUTEN_VENUE_BY_NAME[rawVenueName];
    if (!venueInfo) {
      if (rawVenueName !== '帯広ば') {
        logger.warn(`[WARN] 未知の会場名: "${rawVenueName}" → スキップ`);
      }
      return;
    }

    const { babaCode, venue } = venueInfo;

    $(tr).find('td.held a[href]').each((_, a) => {
      const href = $(a).attr('href') || '';
      const raceIdMatch = href.match(/RACEID\/(\d{18})/);
      if (!raceIdMatch) return;

      const raceId = raceIdMatch[1];
      const ymd = raceId.slice(0, 8);
      const bbFromId = parseInt(raceId.slice(8, 10), 10);

      if (bbFromId !== babaCode) {
        logger.warn(`[WARN] RACEID ${raceId} の会場コード ${bbFromId} が ${venue}(${babaCode}) と不一致`);
      }

      addRaceDay(raceDays, {
        ymd,
        date: `${ymd.slice(0, 4)}-${ymd.slice(4, 6)}-${ymd.slice(6, 8)}`,
        babaCode,
        venue,
      });
    });
  });

  return raceDays;
}

class RakutenCalendarParser {
  constructor({ logger = console } = {}) {
    this.logger = logger;
  }

  parse(html, { year, month }) {
    return parseRakutenSchedule(html, { year, month, logger: this.logger });
  }
}

module.exports = {
  RakutenCalendarParser,
  parseRakutenSchedule,
};
