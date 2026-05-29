'use strict';

function buildDebaTableUrl({ yyyymmdd, raceNo, babaCode }) {
  const d = `${yyyymmdd.slice(0, 4)}%2F${yyyymmdd.slice(4, 6)}%2F${yyyymmdd.slice(6, 8)}`;
  return `https://www.keiba.go.jp/KeibaWeb/TodayRaceInfo/DebaTable?k_raceDate=${d}&k_raceNo=${raceNo}&k_babaCode=${babaCode}`;
}

module.exports = { buildDebaTableUrl };
