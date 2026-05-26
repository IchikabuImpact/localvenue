#!/usr/bin/env node
/**
 * fetch-sire-ranking.js
 * JBIS の種牡馬ランキング（地方ダート平地）上位100件を取得し
 * sire_ranking テーブルへ UPSERT する。
 * （axios+cheerio版 — Selenium不使用）
 *
 * Usage:
 *   node fetch-sire-ranking.js <distance_m>
 *   例: node fetch-sire-ranking.js 1300
 *
 * @copyright © 2026 IchikabuImpact
 * @license Commercial use prohibited without permission.
 */

'use strict';

const axios    = require('axios');
const cheerio  = require('cheerio');
const mysql    = require('mysql2/promise');
const config   = require('../config/config.js');
const throttle = require('./lib/jbis-throttle');

// -------- 定数 --------
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36';
const HTTP_TIMEOUT_MS = 30000;
const RETRY_MAX       = 3;
const RETRY_DELAY_MS  = 3000;

// -------- CLI 引数 --------
const distance = Number(process.argv[2]);
if (!Number.isFinite(distance) || distance <= 0) {
  console.error('Usage: node fetch-sire-ranking.js <distance_m>');
  console.error('Example: node fetch-sire-ranking.js 1300');
  process.exit(1);
}

// -------- URL 生成 --------
function buildUrl(dist) {
  const now  = new Date();
  const yTo  = now.getFullYear();
  const yFrom = yTo - 1;
  const y2   = yTo - 2;
  const q = new URLSearchParams({
    sort: 'ranking', order: 'A', items: '100',
    ranking: '7',
    y1: yTo, y2: y2, y3: yTo,
    kind: '1', division: '3',
    racetype1: '3', racetype2: '2',   // ダート平地
    y_f: yFrom, y_t: yTo, hold: '0',
    corse1: '', corse2: '', condition: '1',
    distance_f: dist, distance_t: dist,
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
 * .data-7__inner 内の div 行から順位・種牡馬ID・種牡馬名を抽出する。
 * 構造:
 *   <div class="data-7__inner ...">
 *     <div>  ← ヘッダー行（スキップ）
 *     <div>
 *       <div>1</div>                          ← 順位
 *       <div class="jc-left">
 *         <a href="/horse/0001240055/">ドレフォン(USA)</a>
 *       </div>
 *       ...
 *     </div>
 *     ...
 *   </div>
 *
 * @returns {{ rank: number, sireId: string, sireName: string }[]}
 */
function parse(html) {
  const $ = cheerio.load(html);
  const results = [];

  $('.data-7__inner > div').each((_, row) => {
    const children = $(row).children('div');
    if (!children.length) return;

    // 1列目: 順位
    const rankText = $(children[0]).text().trim();
    const rank = parseInt(rankText, 10);
    if (!Number.isFinite(rank) || rank < 1 || rank > 100) return;

    // 種牡馬リンク: .jc-left a[href*="/horse/"]
    // ジョッキーリンク (/horse/jockey/) を除外するため /horse/ + 数字のみ対象
    const a = $(row).find('.jc-left a').filter((_, el) => {
      const href = $(el).attr('href') || '';
      return /\/horse\/\d+\//.test(href);
    }).first();
    if (!a.length) return;

    const href = a.attr('href') || '';
    const m = href.match(/\/horse\/(\d+)\//);
    if (!m) return;

    const sireId   = m[1];
    const sireName = a.text().trim();
    if (!sireName) return;

    results.push({ rank, sireId, sireName });
  });

  // 順位でソートして重複排除（同一sireId）
  results.sort((a, b) => a.rank - b.rank);
  const seen = new Set();
  return results.filter(r => {
    if (seen.has(r.sireId)) return false;
    seen.add(r.sireId);
    return true;
  });
}

// -------- DB 保存 --------
async function save(rows, dist) {
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
      INSERT INTO sire_ranking (distance_m, sire_id, sire_name, score)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        sire_name = VALUES(sire_name),
        score     = VALUES(score)
    `;
    for (const r of rows) {
      const score = 101 - r.rank; // 1位→100点, 100位→1点
      await conn.execute(sql, [dist, r.sireId, r.sireName, score]);
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
  const url = buildUrl(distance);
  console.log(`[INFO] distance=${distance}m`);
  console.log(`[INFO] url=${url}`);

  try {
    // レート制限: 前回リクエストから十分な間隔を空ける
    await throttle.waitForRateLimit();

    const html = await fetchHtml(url);
    await throttle.logRequest(url, true);

    const rows = parse(html);
    console.log(`[INFO] scraped ${rows.length} rows`);

    if (!rows.length) throw new Error('0件しか取れませんでした（HTML構造変更の可能性）');

    const n = await save(rows, distance);
    console.log(`[OK] distance=${distance}m → saved ${n} rows`);

    // 上位3件をログ表示
    rows.slice(0, 3).forEach(r =>
      console.log(`  ${r.rank}位: ${r.sireName} (id=${r.sireId}, score=${101 - r.rank})`)
    );
  } catch (e) {
    await throttle.logRequest(url, false).catch(() => {});
    console.error('[FATAL]', e.message || e);
    process.exit(1);
  }
})();
