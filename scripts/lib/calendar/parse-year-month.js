'use strict';

/**
 * 001系カレンダースクリプトの年月引数を解釈する。
 *
 * Supported:
 *   - YYYYMMDD: 年月のみ使用
 *   - YYYYMM: 年月
 *   - YYYY [M|MM]: 年 + 月
 *   - 引数なし: now の年月
 *
 * @param {string[]} argv process.argv 互換の配列
 * @param {Date} [now] 引数なし/年のみ指定時に使う現在日時
 * @returns {{year:string, month:string}}
 */
function parseYearMonth(argv, now = new Date()) {
  const arg1 = argv[2];
  const arg2 = argv[3];

  if (arg1 && /^\d{8}$/.test(arg1)) {
    return { year: arg1.slice(0, 4), month: arg1.slice(4, 6) };
  }

  if (arg1 && /^\d{6}$/.test(arg1)) {
    return { year: arg1.slice(0, 4), month: arg1.slice(4, 6) };
  }

  if (arg1 && /^\d{4}$/.test(arg1)) {
    const month = arg2 && /^\d{1,2}$/.test(arg2)
      ? String(arg2).padStart(2, '0')
      : String(now.getMonth() + 1).padStart(2, '0');
    return { year: arg1, month };
  }

  return {
    year: String(now.getFullYear()),
    month: String(now.getMonth() + 1).padStart(2, '0'),
  };
}

module.exports = { parseYearMonth };
