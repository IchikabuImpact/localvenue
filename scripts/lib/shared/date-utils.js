'use strict';

function pad2(value) {
  return String(value).padStart(2, '0');
}

function jstTodayYmd(now = new Date()) {
  const jst = new Date(now.getTime() + 9 * 3600 * 1000);
  const year = jst.getUTCFullYear();
  const month = pad2(jst.getUTCMonth() + 1);
  const day = pad2(jst.getUTCDate());
  return `${year}${month}${day}`;
}

function ymdToIso(ymd) {
  if (!/^\d{8}$/.test(String(ymd))) {
    throw new Error(`invalid YYYYMMDD: ${ymd}`);
  }
  return `${ymd.slice(0, 4)}-${ymd.slice(4, 6)}-${ymd.slice(6, 8)}`;
}

function parseYmdOrToday(value, now = new Date()) {
  return /^\d{8}$/.test(String(value || '')) ? String(value) : jstTodayYmd(now);
}

function buildCutoffYmd(days = 30, now = new Date()) {
  const d = new Date(now.getTime() - Number(days) * 24 * 60 * 60 * 1000);
  const yyyy = d.getFullYear();
  const mm = pad2(d.getMonth() + 1);
  const dd = pad2(d.getDate());
  return `${yyyy}${mm}${dd}`;
}

module.exports = {
  buildCutoffYmd,
  jstTodayYmd,
  parseYmdOrToday,
  ymdToIso,
};
