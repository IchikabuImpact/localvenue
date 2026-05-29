'use strict';

function isValidYmd(value) {
  return /^\d{8}$/.test(value || '');
}

function parseYmdArg(argv) {
  const ymd = argv[2];
  if (!isValidYmd(ymd)) {
    throw new Error('Usage: node 003-list-race-ids.js YYYYMMDD');
  }
  return ymd;
}

module.exports = { isValidYmd, parseYmdArg };
