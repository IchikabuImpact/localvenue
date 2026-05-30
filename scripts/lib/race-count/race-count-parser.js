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

/**
 * keiba.go.jp RaceList HTML から1レース毎の天候・馬場状態・距離等を抽出する。
 *
 * PHPのRaceListScraperが参照していた列インデックス:
 *   col 0: レース番号（リンクあり）
 *   col 1: 開始時刻
 *   col 4: タイトル
 *   col 5: コース（例: "ダ1400m左"）
 *   col 6: 天候
 *   col 7: 馬場状態
 *
 * @param {string} html
 * @param {string|number} babaCode  NARの2桁会場コード
 * @param {string} ymd              YYYYMMDD
 * @returns {Array<{raceId, raceNo, startTime, title, distanceM, weather, trackCondition}>}
 */
function parseRaceInfoFromRaceListHtml(html, babaCode, ymd) {
  const $ = cheerio.load(html);
  const norm = s => (s || '').replace(/\s+/g, ' ').trim();

  const bb = String(babaCode).padStart(2, '0');
  const seen = new Set();
  const result = [];

  $('a[href*="k_raceNo"]').each((_, a) => {
    const href = $(a).attr('href') || '';
    const m = href.match(/k_raceNo=(\d+)/);
    if (!m) return;
    const raceNo = parseInt(m[1], 10);
    if (isNaN(raceNo) || raceNo < 1 || raceNo > 20) return;

    const raceId = `${ymd}${String(raceNo).padStart(2, '0')}${bb}`;
    if (seen.has(raceId)) return;
    seen.add(raceId);

    const $tr = $(a).closest('tr');
    if (!$tr.length) return;

    const cells = $tr.find('td');
    const cell = i => norm(cells.eq(i).text());

    const startTime   = cell(1) || null;
    const title       = cell(4) || null;
    const courseRaw   = cell(5);
    const weatherRaw  = cell(6);
    const babaRaw     = cell(7);

    // "ダ1400m左" や "芝1600m" から距離を抽出
    const distMatch = courseRaw.match(/(\d{3,4})\s*m/i);
    const distanceM = distMatch ? parseInt(distMatch[1], 10) : null;

    // 空文字・"？" は null に正規化
    const clean = s => (!s || s === '?' || s === '？') ? null : s;

    result.push({
      raceId,
      raceNo,
      startTime,
      title,
      distanceM,
      weather:        clean(weatherRaw),
      trackCondition: clean(babaRaw),
    });
  });

  return result;
}

class RaceCountParser {
  parse(html) {
    return parseRaceCountFromRaceListHtml(html);
  }

  parseRaceInfo(html, babaCode, ymd) {
    return parseRaceInfoFromRaceListHtml(html, babaCode, ymd);
  }
}

module.exports = {
  RaceCountParser,
  parseRaceCountFromRaceListHtml,
  parseRaceInfoFromRaceListHtml,
};
