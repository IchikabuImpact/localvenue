#!/usr/bin/env node
/**
 * 001-save-monthly-calendar.js
 * N月の開催情報をMySQLのDBに保存する（axios+cheerio版）
 *
 * Usage:
 *   node 001-save-monthly-calendar.js           // 今月
 *   node 001-save-monthly-calendar.js 2025 09   // 年 月
 *   node 001-save-monthly-calendar.js 20250913  // YYYYMMDD形式（年月のみ使用）
 *   node 001-save-monthly-calendar.js 202509    // YYYYMM形式
 *
 * @copyright © 2026 IchikabuImpact
 * @license Commercial use prohibited without permission.
 */

'use strict';

const axios   = require('axios');
const cheerio = require('cheerio');
const mysql   = require('mysql2/promise');

// -------- 定数 --------
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36';
const HTTP_TIMEOUT_MS = 30000;
const RETRY_MAX = 3;
const RETRY_DELAY_MS = 3000;

/**
 * NARサラブレッド競馬の場コード → 正式venue名
 * ※ 帯広ばんえい（babaCode=3）はサラブレッド競走でないため除外
 */
const VENUE_NAME_MAP = {
  10: '盛岡',
  11: '水沢',
  18: '浦和',
  19: '船橋',
  20: '大井',
  21: '川崎',
  22: '金沢',
  23: '笠松',
  24: '名古屋',
  27: '園田',
  28: '姫路',
  31: '高知',
  32: '佐賀',
  36: '門別',
};

// -------- 引数パース --------
function parseYearMonth(argv) {
  const now = new Date();
  const arg1 = argv[2];
  const arg2 = argv[3];

  // YYYYMMDD（例: 20250913）→ 年月のみ使用
  if (arg1 && /^\d{8}$/.test(arg1)) {
    return { year: arg1.slice(0, 4), month: arg1.slice(4, 6) };
  }
  // YYYYMM（例: 202509）
  if (arg1 && /^\d{6}$/.test(arg1)) {
    return { year: arg1.slice(0, 4), month: arg1.slice(4, 6) };
  }
  // YYYY [M|MM]（例: 2025 9 または 2025 09）
  if (arg1 && /^\d{4}$/.test(arg1)) {
    const month = arg2 && /^\d{1,2}$/.test(arg2)
      ? String(arg2).padStart(2, '0')
      : String(now.getMonth() + 1).padStart(2, '0');
    return { year: arg1, month };
  }
  // 引数なし → 今月
  return {
    year:  String(now.getFullYear()),
    month: String(now.getMonth() + 1).padStart(2, '0'),
  };
}

// -------- HTTPリトライ付き取得 --------
async function fetchPage(year, month) {
  const url = `https://www.keiba.go.jp/KeibaWeb/MonthlyConveneInfo/MonthlyConveneInfoTop?k_year=${year}&k_month=${month}`;
  console.log(`[INFO] Fetching: ${url}`);

  let lastErr;
  for (let attempt = 1; attempt <= RETRY_MAX; attempt++) {
    try {
      const res = await axios.get(url, {
        headers: {
          'User-Agent':      UA,
          'Accept':          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'ja,en-US;q=0.7,en;q=0.3',
          'Accept-Encoding': 'gzip, deflate, br',
          'Cache-Control':   'no-cache',
        },
        timeout: HTTP_TIMEOUT_MS,
        decompress: true,
      });
      if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
      return res.data;
    } catch (e) {
      lastErr = e;
      const status = e.response?.status;
      // 429（レート制限）のときはリトライ待機を長めに
      const wait = status === 429 ? RETRY_DELAY_MS * attempt * 2 : RETRY_DELAY_MS * attempt;
      console.warn(`[WARN] attempt ${attempt}/${RETRY_MAX} failed (${status || e.code || e.message}). retry in ${wait}ms...`);
      if (attempt < RETRY_MAX) await new Promise(r => setTimeout(r, wait));
    }
  }
  throw lastErr;
}

// -------- HTMLパース --------
/**
 * table.schedule の tbody を解析してレース開催情報を返す。
 *
 * 返り値: Map<ymd:string, Array<{date:string, babaCode:number, venue:string}>>
 *   ymd   … 'YYYYMMDD'
 *   date  … 'YYYY-MM-DD'
 */
function parseSchedule(html) {
  const $ = cheerio.load(html);
  /** @type {Map<string, Array<{date:string, babaCode:number, venue:string}>>} */
  const raceDays = new Map();

  $('table.schedule tbody tr').each((_, tr) => {
    // <th> だけの行（日付ヘッダー行・曜日行）はスキップ
    if (!$(tr).find('td').length) return;

    // レースリンク（k_raceDate と k_babaCode を持つ <a>）を走査
    $(tr).find('a[href*="k_raceDate"]').each((_, a) => {
      const href = $(a).attr('href') || '';
      const dateMatch = href.match(/k_raceDate=([^&"]+)/);
      const codeMatch = href.match(/k_babaCode=(\d+)/);
      if (!dateMatch || !codeMatch) return;

      const babaCode = parseInt(codeMatch[1], 10);
      // サラブレッド競馬場のみ対象（VENUE_NAME_MAPにないコードは除外）
      const venueName = VENUE_NAME_MAP[babaCode];
      if (!venueName) return;

      // URLエンコードされた日付を復元: 2026%2F05%2F02 → ['2026','05','02']
      const rawDate = decodeURIComponent(dateMatch[1]); // "2026/05/02"
      const parts   = rawDate.split('/');
      if (parts.length !== 3) return;

      const y   = parts[0];
      const m   = parts[1].padStart(2, '0');
      const d   = parts[2].padStart(2, '0');
      const ymd = `${y}${m}${d}`;            // "20260502"
      const iso = `${y}-${m}-${d}`;          // "2026-05-02"

      if (!raceDays.has(ymd)) raceDays.set(ymd, []);
      const list = raceDays.get(ymd);
      // 同一日・同一場の重複排除
      if (!list.some(r => r.babaCode === babaCode)) {
        list.push({ date: iso, babaCode, venue: venueName });
      }
    });
  });

  return raceDays;
}

// -------- MySQL保存 --------
async function saveToMysql(raceDays) {
  const config = require('../config/config.js');
  let conn;
  try {
    const rows = [];
    for (const entries of raceDays.values()) {
      for (const e of entries) {
        rows.push([e.date, e.babaCode, e.venue]);
      }
    }
    if (rows.length === 0) {
      console.log('[INFO] 保存対象なし（該当開催なし）');
      return;
    }

    conn = await mysql.createConnection({
      host:     config.mysql.host,
      user:     config.mysql.user,
      password: config.mysql.password,
      database: config.mysql.database,
      port:     config.mysql.port,
      charset:  'utf8mb4',
    });
    await conn.beginTransaction();

    const CHUNK = 300;
    for (let i = 0; i < rows.length; i += CHUNK) {
      const chunk = rows.slice(i, i + CHUNK);
      const placeholders = chunk.map(() => '(?,?,?)').join(',');
      await conn.execute(
        `INSERT INTO calendar (race_date, venucode, venue)
         VALUES ${placeholders}
         ON DUPLICATE KEY UPDATE venue = VALUES(venue)`,
        chunk.flat()
      );
    }

    await conn.commit();
    console.log(`[OK] ${rows.length} rows saved to calendar`);

    // 内訳ログ
    for (const [ymd, entries] of [...raceDays.entries()].sort()) {
      const names = entries.map(e => e.venue).join(', ');
      console.log(`  ${ymd}: ${names}`);
    }
  } catch (e) {
    if (conn) { try { await conn.rollback(); } catch { /* ignore */ } }
    throw e;
  } finally {
    if (conn) { try { await conn.end(); } catch { /* ignore */ } }
  }
}

// -------- エントリポイント --------
(async () => {
  const { year, month } = parseYearMonth(process.argv);
  console.log(`[INFO] 取得対象: ${year}-${month}`);

  try {
    const html    = await fetchPage(year, month);
    const raceDays = parseSchedule(html);

    let totalEntries = 0;
    for (const list of raceDays.values()) totalEntries += list.length;
    console.log(`[INFO] 開催日: ${raceDays.size}日、会場-日組み合わせ: ${totalEntries}件`);

    if (totalEntries === 0) {
      console.log('[INFO] 開催情報なし。終了。');
      return;
    }

    await saveToMysql(raceDays);
    console.log('[INFO] 完了');
  } catch (e) {
    console.error('[FATAL]', e.message || e);
    process.exit(1);
  }
})();
