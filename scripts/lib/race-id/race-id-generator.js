'use strict';

function generateRaceIdsForVenue({ ymd, venueCode, totalRaces }) {
  const vc = String(venueCode).padStart(2, '0');
  const maxR = Number(totalRaces) || 0;
  const raceIds = [];

  for (let rr = 1; rr <= maxR; rr++) {
    const rr2 = String(rr).padStart(2, '0');
    raceIds.push(`${ymd}${rr2}${vc}`);
  }

  return raceIds;
}

function generateRaceIds({ ymd, raceCounts }) {
  return raceCounts.flatMap(row => generateRaceIdsForVenue({
    ymd,
    venueCode: row.venue_code,
    totalRaces: row.total_races,
  }));
}

module.exports = {
  generateRaceIds,
  generateRaceIdsForVenue,
};
