'use strict';

const RAKUTEN_BABA_CODE = Object.freeze({
  '03': ['03041503'],
  '36': ['36011504'],
  '10': ['10060902'],
  '11': ['11060605'],
  '18': ['18131203'],
  '19': ['19140801'],
  '20': ['20151205'],
  '21': ['21350805'],
  '22': ['22181501'],
  '23': ['23201204'],
  '24': ['24332203'],
  '27': ['27261706'],
  '28': ['28260102'],
  '31': ['31291106'],
  '32': ['32302205'],
});

function parseRaceIdArg(argv, scriptName = '101-save-result-db.js') {
  const raceId = argv[2];
  if (!raceId || !/^\d{12}$/.test(raceId)) throw new Error(`Usage: node ${scriptName} YYYYMMDDRRBB`);
  return { raceId, ymd: raceId.slice(0, 8), rr: raceId.slice(8, 10), bb: raceId.slice(10, 12) };
}

function narToRakutenRaceIdCandidates(narId) {
  const ymd = narId.slice(0, 8);
  const rr = narId.slice(8, 10);
  const bb = narId.slice(10, 12);
  const codes = RAKUTEN_BABA_CODE[bb] || [];
  return codes.map(code8 => `${ymd}${code8}${rr}`);
}

function buildRakutenResultUrl(rakutenRaceId) {
  return `https://keiba.rakuten.co.jp/race_performance/list/RACEID/${rakutenRaceId}`;
}

module.exports = { RAKUTEN_BABA_CODE, parseRaceIdArg, narToRakutenRaceIdCandidates, buildRakutenResultUrl };
