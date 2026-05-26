#!/usr/bin/env node
/**
 * @file    002-save-race-count-by-date.js
 * @pipeline [2/5 朝バッチ] 会場別レース数取得 → DB保存
 * @role    `calendar` テーブルから指定日の開催会場を取り出し、
 *          keiba.go.jp RaceList をスクレイピングして会場ごとの
 *          最終レース番号（＝レース数）を `race_count_by_date` へ保存する。
 *          ここで保存した値が 003 の race_id 生成の元になる。
 *
 * @input   DB: calendar / keiba.go.jp RaceList（HTML、SSR）
 * @output  DB: race_count_by_date (race_date, venue_code, race_count)
 * @calledby daily-yosou-batch.js [2]
 *
 * Usage:
 *   node 002-save-race-count-by-date.js 20251116
 *   node 002-save-race-count-by-date.js 2025-09-14
 *   node 002-save-race-count-by-date.js          # 省略 → JST 今日
 *   node 002-save-race-count-by-date.js 20251116 31  # 1会場のみ強制実行
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
const HTTP_TIMEOUT_MS = 20000;
const RETRY_MAX       = 3;
const RETRY_DELAY_MS  = 2000;

// -------- 日付正規化 --------
function normalizeDateArg(arg) {
  if (!arg) {
    // JST 今日
    const jst = new Date(Date.now() + 9 * 3600 * 1000);
    const y = jst.getUTCFullYear();
    const m = String(jst.getUTCMonth() + 1).padStart(2, '0');
    const d = String(jst.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  const s = String(arg).replace(/-/g, '');
  if (!/^\d{8}$/.test(s)) throw new Error('Invalid date. Use YYYYMMDD or YYYY-MM-DD.');
  return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
}

// -------- HTTPリトライ付き取得 --------
async function fetchHtml(url) {
  let lastErr;
  for (let attempt = 1; attempt <= RETRY_MAX; attempt++) {
    try {
      const res = await axios.get(url, {
        headers: {
          'User-Agent':      UA,
          'Accept':          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'ja,en-US;q=0.7,en;q=0.3',
          'Accept-Encoding': 'gzip, deflate, br',
        },
        timeout: HTTP_TIMEOUT_MS,
        decompress: true,
      });
      if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
      return res.data;
    } catch (e) {
      lastErr = e;
      const status = e.response?.status;
      const wait = status === 429
        ? RETRY_DELAY_MS * attempt * 2
        : RETRY_DELAY_MS * attempt;
      console.warn(`  [WARN] attempt ${attempt}/${RETRY_MAX} failed (${status || e.code || e.message}), retry in ${wait}ms...`);
      if (attempt < RETRY_MAX) await new Promise(r => setTimeout(r, wait));
    }
  }
  throw lastErr;
}

// -------- レース数スクレイプ --------
async function scrapeRaceCount(dateISO, babaCode) {
  const dateParam = encodeURIComponent(
    `${dateISO.slice(0, 4)}/${dateISO.slice(5, 7)}/${dateISO.slice(8, 10)}`
  );
  const url = `https://www.keiba.go.jp/KeibaWeb/TodayRaceInfo/RaceList?k_raceDate=${dateParam}&k_babaCode=${babaCode}`;

  const html = await fetchHtml(url);
  const $ = cheerio.load(html);

  let maxRace = 0;

  // 方法1: href の k_raceNo パラメータから最大値を取得（最も確実）
  $('a[href*="k_raceNo"]').each((_, a) => {
    const href = $(a).attr('href') || '';
    const m = href.match(/k_raceNo=(\d+)/);
    if (m) maxRace = Math.max(maxRace, parseInt(m[1], 10));
  });

  // 方法2: テキストセルの「NR」パターンをフォールバックとして使用
  if (maxRace === 0) {
    $('td, th').each((_, el) => {
      const t = $(el).text().trim();
      const m = t.match(/^(\d{1,2})\s*[RＲ]$/);
      if (m) maxRace = Math.max(maxRace, parseInt(m[1], 10));
    });
  }

  if (maxRace === 0) throw new Error(`レース数取得失敗 (babaCode=${babaCode}, url=${url})`);
  return maxRace;
}

// -------- メイン --------
async function main() {
  const dateISO    = normalizeDateArg(process.argv[2]);  // YYYY-MM-DD
  const oneCodeArg = process.argv[3] && String(process.argv[3]).trim();
  const oneCode    = oneCodeArg && /^\d{1,3}$/.test(oneCodeArg)
    ? Number(oneCodeArg) : null;

  const ymd = dateISO.replace(/-/g, '');  // YYYYMMDD
  console.log(`[INFO] target date: ${dateISO}`);

  const config = require('../config/config.js');
  const conn = await mysql.createConnection({
    host:     config.mysql.host || 'localhost',
    user:     config.mysql.user,
    password: config.mysql.password,
    port:     config.mysql.port,
    database: config.mysql.database || 'localkeiba',
    charset:  'utf8mb4',
  });

  try {
    // calendar から当日の会場コードを取得
    const [rows] = await conn.execute(
      'SELECT venucode FROM calendar WHERE race_date = ? ORDER BY venucode',
      [dateISO]
    );

    if (rows.length === 0 && !oneCode) {
      console.log('[INFO] calendar に該当会場なし。終了。');
      return;
    }

    let codes = rows.map(r => Number(r.venucode));
    if (oneCode) {
      if (!codes.includes(oneCode)) {
        console.warn(`[WARN] calendar に ${oneCode} がありませんが強制実行します`);
        codes = [oneCode];
      } else {
        codes = [oneCode];
      }
    }
    console.log(`[INFO] venues: ${codes.join(', ')}`);

    await conn.beginTransaction();
    let ok = 0, ng = 0;

    for (const code of codes) {
      try {
        const cnt = await scrapeRaceCount(dateISO, code);
        const id  = `${ymd}${code}`;

        // ① 旧テーブル: race_cnt（互換用）
        await conn.execute(
          `INSERT INTO race_cnt (id, cnt)
           VALUES (?, ?)
           ON DUPLICATE KEY UPDATE cnt = VALUES(cnt)`,
          [id, cnt]
        );

        // ② 新テーブル: race_count_by_date（正テーブル）
        await conn.execute(
          `INSERT INTO race_count_by_date (ymd, venue_code, total_races)
           VALUES (?, ?, ?)
           ON DUPLICATE KEY UPDATE total_races = VALUES(total_races)`,
          [ymd, String(code), cnt]
        );

        console.log(`[OK] ${code}: ${cnt}R`);
        ok++;
      } catch (e) {
        console.error(`[NG] ${code}: ${e.message || e}`);
        ng++;
      }
    }

    await conn.commit();
    console.log(`[DONE] total=${codes.length}, ok=${ok}, ng=${ng}`);
  } catch (e) {
    try { await conn.rollback(); } catch { /* ignore */ }
    throw e;
  } finally {
    try { await conn.end(); } catch { /* ignore */ }
  }
}

main().catch(err => {
  console.error('[FATAL]', err.message || err);
  process.exit(1);
});
