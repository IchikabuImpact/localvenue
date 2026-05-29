'use strict';

function buildRaceListUrl({ dateISO, babaCode }) {
  const dateParam = encodeURIComponent(
    `${dateISO.slice(0, 4)}/${dateISO.slice(5, 7)}/${dateISO.slice(8, 10)}`
  );
  return `https://www.keiba.go.jp/KeibaWeb/TodayRaceInfo/RaceList?k_raceDate=${dateParam}&k_babaCode=${babaCode}`;
}

module.exports = { buildRaceListUrl };
