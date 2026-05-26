#!/usr/bin/env node
/**
 * @file    001-save-monthly-calendar-rakuten.js
 * @role    【フォールバック】楽天競馬カレンダーから月間開催情報を取得してDBへ保存。
 *          keiba.go.jp が利用不可の場合に 001-save-monthly-calendar.js から自動で呼ばれる。
 *
 * 取得先:
 *   https://keiba.rakuten.co.jp/calendar  （POST: tYear, tMonth）
 *
 * 解析方法:
 *   - tbody の <tr class="place"> を会場行として走査
 *   - <th scope="row"> テキストを会場名として NAR babaCode にマッピング
 *   - <td class="...held"> 内の <a href> から RACEID を取り出し日付を復元
 *   - RACEID フォーマット: YYYYMMDD + BB (NAR 2桁コード) + 残り8桁
 *   - 帯広ばんえいは除外（VENUE_NAME_MAP に含まない）
 *
 * @output  DB: calendar (race_date, venucode, venue) — ON DUPLICATE KEY UPDATE
 * @exitcodes 0=正常 / 1=失敗
 *
 * Usage:
 *   node 001-save-monthly-calendar-rakuten.js           // 今月
 *   node 001-save-monthly-calendar-rakuten.js 2026 06   // 年 月
 *   node 001-save-monthly-calendar-rakuten.js 20260526  // YYYYMMDD（年月のみ使用）
 *   node 001-save-monthly-calendar-rakuten.js 202606    // YYYYMM
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
const CALENDAR_URL = 'https://keiba.rakuten.co.jp/calendar';

/**
 * 楽天競馬カレンダーの <th scope="row"> テキスト → NAR babaCode + 正式会場名
 * 帯広ばんえい（帯広ば）はサラブレッド競走でないため除外。
 */
const VENUE_NAME_MAP = {
  '盛岡':   { babaCode: 10, venue: '盛岡'   },
  '水沢':   { babaCode: 11, venue: '水沢'   },
  '浦和':   { babaCode: 18, venue: '浦和'   },
  '船橋':   { babaCode: 19, venue: '船橋'   },
  '大井':   { babaCode: 20, venue: '大井'   },
  '川崎':   { babaCode: 21, venue: '川崎'   },
  '金沢':   { babaCode: 22, venue: '金沢'   },
  '笠松':   { babaCode: 23, venue: '笠松'   },
  '名古屋': { babaCode: 24, venue: '名古屋' },
  '園田':   { babaCode: 27, venue: '園田'   },
  '姫路':   { babaCode: 28, venue: '姫路'   },
  '高知':   { babaCode: 31, venue: '高知'   },
  '佐賀':   { babaCode: 32, venue: '佐賀'   },
  '門別':   { babaCode: 36, venue: '門別'   },
  // '帯広ば': ばんえい競馬のため除外
};

// -------- 引数パース（001と同じ仕様） --------
function parseYearMonth(argv) {
  const now = new Date();
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
    year:  String(now.getFullYear()),
    month: String(now.getMonth() + 1).padStart(2, '0'),
  };
}

// -------- HTTP取得（POSTでの年月指定） --------
async function fetchPage(year, month) {
  const monthNum = parseInt(month, 10); // '05' → 5
  console.log(`[INFO] Rakuten カレンダー取得: ${year}-${month}`);
  console.log(`[INFO] URL: ${CALENDAR_URL} (POST tYear=${year}&tMonth=${monthNum})`);

  let lastErr;
  for (let attempt = 1; attempt <= RETRY_MAX; attempt++) {
    try {
      const res = await axios.post(
        CALENDAR_URL,
        new URLSearchParams({ tYear: year, tMonth: String(monthNum) }).toString(),
        {
          headers: {
            'User-Agent':   UA,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept':       'text/html,application/xhtml+xml,*/*;q=0.8',
            'Accept-Language': 'ja,en-US;q=0.7,en;q=0.3',
            'Origin':       'https://keiba.rakuten.co.jp',
            'Referer':      CALENDAR_URL,
          },
          timeout: HTTP_TIMEOUT_MS,
        }
      );
      if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
      return res.data;
    } catch (e) {
      lastErr = e;
      const status = e.response?.status;
      const wait = status === 429 ? RETRY_DELAY_MS * attempt * 2 : RETRY_DELAY_MS * attempt;
      console.warn(`[WARN] attempt ${attempt}/${RETRY_MAX} failed (${status || e.code || e.message}). retry in ${wait}ms...`);
      if (attempt < RETRY_MAX) await new Promise(r => setTimeout(r, wait));
    }
  }
  throw lastErr;
}

// -------- HTMLパース --------
/**
 * 楽天競馬カレンダーの HTML を解析してレース開催情報を返す。
 *
 * 構造:
 *   <tr class="place">
 *     <th scope="row">高知</th>       ← 会場名
 *     <td class="held"><a href="…RACEID/20260501311234…"></td>  ← 開催あり
 *     <td class=""></td>              ← 開催なし
 *   </tr>
 *
 * RACEID先頭10文字: YYYYMMDD + BB（NARの2桁babaCode）
 *
 * @returns {Map<string, Array<{date:string, babaCode:number, venue:string}>>}
 */
function parseSchedule(html, year, month) {
  const $ = cheerio.load(html);

  // ページが要求した年月を含むか確認
  const heading = $('h2').text();
  const expectedHeading = `${year}年${parseInt(month, 10)}月`;
  if (!heading.includes(expectedHeading)) {
    console.warn(`[WARN] ページの見出し "${heading.trim()}" が期待値 "${expectedHeading}" と不一致`);
    // 続行はするが警告を残す
  } else {
    console.log(`[INFO] ページ確認: ${heading.trim()}`);
  }

  /** @type {Map<string, Array<{date:string, babaCode:number, venue:string}>>} */
  const raceDays = new Map();

  $('tbody tr.place').each((_, tr) => {
    // 会場名を取得
    const venueTh = $(tr).find('th[scope="row"]').first();
    if (!venueTh.length) return;

    const rawVenueName = venueTh.text().trim();
    const venueInfo = VENUE_NAME_MAP[rawVenueName];
    if (!venueInfo) {
      // 帯広ばんえいなどは静かにスキップ
      if (rawVenueName !== '帯広ば') {
        console.warn(`[WARN] 未知の会場名: "${rawVenueName}" → スキップ`);
      }
      return;
    }

    const { babaCode, venue } = venueInfo;

    // 開催あり（held）セルの <a> リンクから RACEID → 日付を取得
    $(tr).find('td.held a[href]').each((_, a) => {
      const href = $(a).attr('href') || '';
      // https://keiba.rakuten.co.jp/race_card/list/RACEID/YYYYMMDDBB????????
      const raceIdMatch = href.match(/RACEID\/(\d{18})/);
      if (!raceIdMatch) return;

      const raceId = raceIdMatch[1];
      const ymd = raceId.slice(0, 8); // YYYYMMDD
      const bbFromId = parseInt(raceId.slice(8, 10), 10); // NAR 2桁コード

      // 念のため会場コード整合チェック
      if (bbFromId !== babaCode) {
        console.warn(`[WARN] RACEID ${raceId} の会場コード ${bbFromId} が ${venue}(${babaCode}) と不一致`);
      }

      const y = ymd.slice(0, 4);
      const m = ymd.slice(4, 6);
      const d = ymd.slice(6, 8);
      const iso = `${y}-${m}-${d}`;

      if (!raceDays.has(ymd)) raceDays.set(ymd, []);
      const list = raceDays.get(ymd);
      if (!list.some(r => r.babaCode === babaCode)) {
        list.push({ date: iso, babaCode, venue });
      }
    });
  });

  return raceDays;
}

// -------- MySQL保存（001と同一ロジック） --------
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

    console.log(`[OK] ${rows.length} rows saved to calendar (via Rakuten fallback)`);

    for (const [ymd, entries] of [...raceDays.entries()].sort()) {
      const names = entries.map(e => e.venue).join(', ');
      console.log(`  ${ymd}: ${names}`);
    }
  } finally {
    if (conn) { try { await conn.end(); } catch { /* ignore */ } }
  }
}

// -------- エントリポイント --------
(async () => {
  const { year, month } = parseYearMonth(process.argv);
  console.log(`[INFO] 取得対象: ${year}-${month}（楽天競馬フォールバック）`);

  const html     = await fetchPage(year, month);
  const raceDays = parseSchedule(html, year, month);

  let totalEntries = 0;
  for (const list of raceDays.values()) totalEntries += list.length;
  console.log(`[INFO] 開催日: ${raceDays.size}日、会場-日組み合わせ: ${totalEntries}件`);

  if (totalEntries === 0) {
    console.log('[INFO] 開催情報なし。終了。');
    return;
  }

  await saveToMysql(raceDays);
  console.log('[INFO] 完了（楽天競馬フォールバック）');
})().catch((e) => {
  console.error('[FATAL]', e.message || e);
  process.exit(1);
});
