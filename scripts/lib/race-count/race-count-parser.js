'use strict';

const cheerio = require('cheerio');

/**
 * keiba.go.jp RaceList HTMLから最大レース番号を抽出する。
 *
 * @param {string} html
 * @returns {number}
 */
function parseRaceCountFromRaceListHtml(html) {
  const $ = cheerio.load(html);
  let maxRace = 0;

  $('a[href*="k_raceNo"]').each((_, a) => {
    const href = $(a).attr('href') || '';
    const m = href.match(/k_raceNo=(\d+)/);
    if (m) maxRace = Math.max(maxRace, parseInt(m[1], 10));
  });

  if (maxRace === 0) {
    $('td, th').each((_, el) => {
      const t = $(el).text().trim();
      const m = t.match(/^(\d{1,2})\s*[RＲ]$/);
      if (m) maxRace = Math.max(maxRace, parseInt(m[1], 10));
    });
  }

  return maxRace;
}

class RaceCountParser {
  parse(html) {
    return parseRaceCountFromRaceListHtml(html);
  }
}

module.exports = {
  RaceCountParser,
  parseRaceCountFromRaceListHtml,
};
