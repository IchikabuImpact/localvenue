'use strict';

function stripMergeConflictMarkers(html) {
  return String(html)
    .split('\n')
    .filter((line) => !/^<{7} .+|^={7}$|^>{7} .+/.test(line.trim()))
    .join('\n');
}

function safeJSON(raw) {
  if (!raw) return null;
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  if (Buffer.isBuffer(raw)) {
    try {
      return JSON.parse(raw.toString('utf8'));
    } catch {
      return null;
    }
  }
  return raw;
}

function buildCutoffYmdFromBaseYmd(baseYmd, days = 30) {
  if (!/^\d{8}$/.test(String(baseYmd))) {
    throw new Error(`invalid base YYYYMMDD: ${baseYmd}`);
  }
  const base = new Date(Date.UTC(
    Number(baseYmd.slice(0, 4)),
    Number(baseYmd.slice(4, 6)) - 1,
    Number(baseYmd.slice(6, 8)),
    0,
    0,
    0
  ));
  base.setUTCDate(base.getUTCDate() - Number(days));
  const y = base.getUTCFullYear();
  const m = String(base.getUTCMonth() + 1).padStart(2, '0');
  const d = String(base.getUTCDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

module.exports = {
  buildCutoffYmdFromBaseYmd,
  safeJSON,
  stripMergeConflictMarkers,
};
