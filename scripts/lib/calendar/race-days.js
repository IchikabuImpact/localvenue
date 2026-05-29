'use strict';

function addRaceDay(raceDays, entry) {
  const { ymd, date, babaCode, venue } = entry;
  if (!raceDays.has(ymd)) raceDays.set(ymd, []);
  const list = raceDays.get(ymd);
  if (!list.some(r => r.babaCode === babaCode)) {
    list.push({ date, babaCode, venue });
  }
}

function countRaceDayEntries(raceDays) {
  let total = 0;
  for (const list of raceDays.values()) total += list.length;
  return total;
}

function raceDaysToRows(raceDays) {
  const rows = [];
  for (const entries of raceDays.values()) {
    for (const e of entries) rows.push([e.date, e.babaCode, e.venue]);
  }
  return rows;
}

function logRaceDays(raceDays, logger = console) {
  for (const [ymd, entries] of [...raceDays.entries()].sort()) {
    const names = entries.map(e => e.venue).join(', ');
    logger.log(`  ${ymd}: ${names}`);
  }
}

module.exports = {
  addRaceDay,
  countRaceDayEntries,
  raceDaysToRows,
  logRaceDays,
};
