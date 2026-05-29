'use strict';

function parsePredictionRaceIdArg(argv) {
  const raceId = argv[2];
  if (!raceId || !/^\d{12}$/.test(raceId)) {
    throw new Error('Usage: node 005-predict-race.js YYYYMMDDRRBB');
  }
  return { raceId, year: Number(raceId.slice(0, 4)) };
}

module.exports = { parsePredictionRaceIdArg };
