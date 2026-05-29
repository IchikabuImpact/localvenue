'use strict';

/**
 * 1会場のみ強制実行するための任意babaCode引数を解釈する。
 * 既存仕様に合わせ、不正値は null として無視する。
 *
 * @param {string | undefined} arg
 * @returns {number | null}
 */
function parseOneVenueCode(arg) {
  const value = arg && String(arg).trim();
  return value && /^\d{1,3}$/.test(value) ? Number(value) : null;
}

module.exports = { parseOneVenueCode };
