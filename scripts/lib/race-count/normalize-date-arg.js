'use strict';

/**
 * 002系スクリプトの対象日引数を YYYY-MM-DD へ正規化する。
 *
 * Supported:
 *   - YYYYMMDD
 *   - YYYY-MM-DD
 *   - 引数なし: JST今日
 *
 * @param {string | undefined} arg
 * @param {Date} [now]
 * @returns {string}
 */
function normalizeDateArg(arg, now = new Date()) {
  if (!arg) {
    const jst = new Date(now.getTime() + 9 * 3600 * 1000);
    const y = jst.getUTCFullYear();
    const m = String(jst.getUTCMonth() + 1).padStart(2, '0');
    const d = String(jst.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  const s = String(arg).replace(/-/g, '');
  if (!/^\d{8}$/.test(s)) throw new Error('Invalid date. Use YYYYMMDD or YYYY-MM-DD.');
  return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
}

function toYmd(dateISO) {
  return String(dateISO).replace(/-/g, '');
}

module.exports = { normalizeDateArg, toYmd };
