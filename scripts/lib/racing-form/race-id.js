'use strict';

function parseRaceIdArg(argv, scriptName = '004-racing-form-to-db.js') {
  const id12 = argv[2];
  if (!id12 || !/^\d{12}$/.test(id12)) {
    throw new Error(`Usage: node ${scriptName} YYYYMMDDRRBB`);
  }
  return parseRaceId(id12);
}

function parseRaceId(id12) {
  if (!/^\d{12}$/.test(id12 || '')) throw new Error('Invalid race_id. Use YYYYMMDDRRBB.');
  const yyyymmdd = id12.slice(0, 8);
  const raceNo = Number(id12.slice(8, 10));
  const babaCode = id12.slice(10, 12);
  const year = Number(yyyymmdd.slice(0, 4));
  return {
    raceId: id12,
    yyyymmdd,
    raceNo,
    babaCode,
    year,
    yy: year % 100,
  };
}

module.exports = { parseRaceId, parseRaceIdArg };
