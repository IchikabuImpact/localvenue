#!/usr/bin/env node
/**
 * @file    fetch-trainer-ranking.js
 * @role    JBIS のリーディングトレーナーランキング（地方）上位100件を取得し
 *          trainer_ranking テーブルへ UPSERT する。
 *          （axios+cheerio版 — Selenium不使用）
 *
 * @input   https://www.jbis.or.jp/ranking/result/?ranking=9&division=3&...
 * @output  DB: trainer_ranking (year, trainer_name, score)
 *          score = 101 - rank（1位→100点、100位→1点）
 *
 * Usage:
 *   node fetch-trainer-ranking.js [--division=<1|2|3>] [--year=YYYY]
 *
 * division: 1=総合, 2=中央, 3=地方（既定=3）
 * year:     取得年度（既定=今年）
 *
 * @copyright © 2026 IchikabuImpact
 * @license Commercial use prohibited without permission.
 */

'use strict';

const axios   = require('axios');
const cheerio = require('cheerio');
const mysql   = require('mysql2/promise');
const config  = require('../config/config.js');

// -------- 定数 --------
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36';
const HTTP_TIMEOUT_MS = 30000;
const RETRY_MAX       = 3;
const RETRY_DELAY_MS  = 3000;

// -------- CLI オプション --------
function getOpt(name, defVal) {
  const hit = process.argv.find(a => a.startsWith(`--${name}=`));
  return hit ? hit.split('=')[1] : defVal;
}

const now      = new Date();
const theYear  = Number(getOpt('year', '')) || now.getFullYear();
const division = Number(getOpt('division', '3')); // 1:総合 2:中央 3:地方

// -------- URL 生成 --------
function buildUrl(year, div) {
  const q = new URLSearchParams({
    sort: 'prize', order: 'D', items: '100',
    ranking: '9',          // 9 = リーディングトレーナー
    y1: year, y2: year - 2, y3: year,
    kind: '1',
    division: String(div),
    racetype1: '', racetype2: '',
    y_f: year, y_t: year, hold: '0',
    corse1: '', corse2: '', condition: '1',
    distance_f: '', distance_t: '',
    horse: '', seqno: '', match: 'prefix',
  });
  return `https://www.jbis.or.jp/ranking/result/?${q.toString()}`;
}

// -------- HTTP リトライ付き取得 --------
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
          'Referer':         'https://www.jbis.or.jp/ranking/',
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
      console.warn(`[WARN] attempt ${attempt}/${RETRY_MAX} failed (${status || e.code || e.message}), retry in ${wait}ms...`);
      if (attempt < RETRY_MAX) await new Promise(r => setTimeout(r, wait));
    }
  }
  throw lastErr;
}

// -------- HTML パース --------
/**
 * .data-7__inner 内の div 行からトレーナー名を抽出する。
 * 構造:
 *   <div class="data-7__inner ...">
 *     <div>  ← ヘッダー行（スキップ）
 *     <div>
 *       <div>1</div>                    ← 順位
 *       <div class="jc-left">
 *         <a href="/horse/trainer/XXXXXX/">山本 正司</a>(高 知)
 *       </div>
 *       <div class="jc-right">...</div> ← 出走頭数
 *       ... (計12列)
 *       <div class="jc-right">28126.8万円</div> ← 獲得賞金（最終列）
 *     </div>
 *     ...
 *   </div>
 *
 * @returns {{ rank: number, trainerName: string }[]}
 */
function parse(html) {
  const $ = cheerio.load(html);
  const results = [];

  $('.data-7__inner > div').each((_, row) => {
    const children = $(row).children('div');
    if (!children.length) return;

    // 1列目: 順位（数値でなければヘッダー行としてスキップ）
    const rankText = $(children[0]).text().trim();
    const rank = parseInt(rankText, 10);
    if (!Number.isFinite(rank) || rank < 1 || rank > 999) return;

    // トレーナー名: .jc-left a[href*="/horse/trainer/"]
    const a = $(row).find('a[href*="/horse/trainer/"]').first();
    if (!a.length) return;
    const name = a.text().trim();
    if (!name) return;

    results.push({ rank, trainerName: name });
  });

  // 順位でソートして重複排除
  results.sort((a, b) => a.rank - b.rank);
  const seen = new Set();
  return results.filter(r => {
    if (seen.has(r.rank)) return false;
    seen.add(r.rank);
    return true;
  });
}

// -------- DB 保存 --------
async function save(rows, year) {
  if (!rows.length) return 0;

  const conn = await mysql.createConnection({
    host:     config.mysql.host,
    user:     config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
    port:     config.mysql.port,
    charset:  'utf8mb4',
  });

  try {
    await conn.beginTransaction();
    const sql = `
      INSERT INTO trainer_ranking (year, trainer_name, score)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE score = VALUES(score)
    `;
    for (const r of rows) {
      const score = 101 - r.rank; // 1位→100点、100位→1点
      await conn.execute(sql, [year, r.trainerName, score]);
    }
    await conn.commit();
    return rows.length;
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    await conn.end();
  }
}

// -------- メイン --------
(async () => {
  const url = buildUrl(theYear, division);
  console.log(`[INFO] year=${theYear} division=${division}`);
  console.log(`[INFO] url=${url}`);

  try {
    const html = await fetchHtml(url);
    const rows = parse(html);
    console.log(`[INFO] scraped ${rows.length} rows`);

    if (!rows.length) throw new Error('0件しか取れませんでした（HTML構造変更の可能性）');

    const n = await save(rows, theYear);
    console.log(`[OK] year=${theYear} division=${division} → saved ${n} rows`);

    // 上位5件をログ表示
    rows.slice(0, 5).forEach(r =>
      console.log(`  ${r.rank}位: ${r.trainerName} (score=${101 - r.rank})`)
    );
  } catch (e) {
    console.error('[FATAL]', e.message || e);
    process.exit(1);
  }
})();
