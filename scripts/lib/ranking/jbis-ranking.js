'use strict';

const axios = require('axios');
const cheerio = require('cheerio');
const mysql = require('mysql2/promise');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36';
const HTTP_TIMEOUT_MS = 30000;
const RETRY_MAX = 3;
const RETRY_DELAY_MS = 3000;

function buildRankingUrl(params) {
  const q = new URLSearchParams(params);
  return `https://www.jbis.or.jp/ranking/result/?${q.toString()}`;
}

function buildPeopleRankingUrl({ year, division, ranking, sort = 'prize', order = 'D', seqno = '' }) {
  return buildRankingUrl({
    sort,
    order,
    items: '100',
    ranking,
    y1: year,
    y2: year - 2,
    y3: year,
    kind: '1',
    division: String(division),
    racetype1: '',
    racetype2: '',
    y_f: year,
    y_t: year,
    hold: '0',
    corse1: '',
    corse2: '',
    condition: '1',
    distance_f: '',
    distance_t: '',
    horse: '',
    seqno: seqno ? String(seqno) : '',
    match: 'prefix',
  });
}

// 馬場状態コード（JBIS の condition パラメータ値 → ラベル）
const TRACK_CONDITION_MAP = {
  1: 'all',  // 総合（全馬場）
  2: '良',
  3: '稍重',
  4: '重',
  5: '不良',
};

// ラベル→コードの逆引き
const TRACK_CONDITION_CODES = Object.fromEntries(
  Object.entries(TRACK_CONDITION_MAP).map(([k, v]) => [v, Number(k)])
);

function buildSireRankingUrl(distance, conditionCode = 1, now = new Date()) {
  const yTo = now.getFullYear();
  const yFrom = yTo - 1;
  const y2 = yTo - 2;
  return buildRankingUrl({
    sort: 'ranking',
    order: 'A',
    items: '100',
    ranking: '7',
    y1: yTo,
    y2,
    y3: yTo,
    kind: '1',
    division: '3',
    racetype1: '3',
    racetype2: '2',
    y_f: yFrom,
    y_t: yTo,
    hold: '0',
    corse1: '',
    corse2: '',
    condition: String(conditionCode),
    distance_f: String(distance),
    distance_t: String(distance),
    horse: '',
    seqno: '',
    match: 'prefix',
  });
}

async function fetchHtml(url, { axiosClient = axios, retryMax = RETRY_MAX, retryDelayMs = RETRY_DELAY_MS } = {}) {
  let lastErr;
  for (let attempt = 1; attempt <= retryMax; attempt += 1) {
    try {
      const res = await axiosClient.get(url, {
        headers: {
          'User-Agent': UA,
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'ja,en-US;q=0.7,en;q=0.3',
          'Accept-Encoding': 'gzip, deflate, br',
          Referer: 'https://www.jbis.or.jp/ranking/',
        },
        timeout: HTTP_TIMEOUT_MS,
        decompress: true,
      });
      if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
      return res.data;
    } catch (e) {
      lastErr = e;
      const status = e.response?.status;
      const wait = status === 429 ? retryDelayMs * attempt * 2 : retryDelayMs * attempt;
      console.warn(`[WARN] attempt ${attempt}/${retryMax} failed (${status || e.code || e.message}), retry in ${wait}ms...`);
      if (attempt < retryMax) await new Promise((resolve) => setTimeout(resolve, wait));
    }
  }
  throw lastErr;
}

function uniqueSortedBy(rows, keyFn) {
  const seen = new Set();
  return rows
    .sort((a, b) => a.rank - b.rank)
    .filter((row) => {
      const key = keyFn(row);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function parsePeopleRanking(html, { hrefContains, nameKey, maxRank = 100 }) {
  const $ = cheerio.load(html);
  const rows = [];
  $('.data-7__inner > div').each((_, row) => {
    const children = $(row).children('div');
    if (!children.length) return;
    const rank = parseInt($(children[0]).text().trim(), 10);
    if (!Number.isFinite(rank) || rank < 1 || rank > maxRank) return;
    const a = $(row).find(`a[href*="${hrefContains}"]`).first();
    if (!a.length) return;
    const name = a.text().trim();
    if (!name) return;
    rows.push({ rank, [nameKey]: name });
  });
  return uniqueSortedBy(rows, (row) => row.rank);
}

function parseSireRanking(html) {
  const $ = cheerio.load(html);
  const rows = [];
  $('.data-7__inner > div').each((_, row) => {
    const children = $(row).children('div');
    if (!children.length) return;
    const rank = parseInt($(children[0]).text().trim(), 10);
    if (!Number.isFinite(rank) || rank < 1 || rank > 100) return;
    const a = $(row).find('.jc-left a').filter((_, el) => /\/horse\/\d+\//.test($(el).attr('href') || '')).first();
    if (!a.length) return;
    const href = a.attr('href') || '';
    const matched = href.match(/\/horse\/(\d+)\//);
    if (!matched) return;
    const sireName = a.text().trim();
    if (!sireName) return;
    rows.push({ rank, sireId: matched[1], sireName });
  });
  return uniqueSortedBy(rows, (row) => row.sireId);
}

// JBIS上の実際のrank番号からスコアを計算（地方調教師は rank300+ になりうるため負になることがある）
// 通常は scoreFromPosition を使うこと
function scoreFromRank(rank) {
  return Math.max(0, 101 - rank);
}

// 取得リスト内の0始まり順位からスコアを計算（実際のrank番号に依存しない）
// 0位→100点、99位→1点、100位以降→1点（"データなし"より常に高い）
function scoreFromPosition(position) {
  return Math.max(1, 100 - position);
}

function getAppConfig() {
  return require('../../../config/config.js');
}

async function createRankingConnection(mysqlClient = mysql, appConfig = getAppConfig()) {
  return mysqlClient.createConnection({
    host: appConfig.mysql.host,
    user: appConfig.mysql.user,
    password: appConfig.mysql.password,
    database: appConfig.mysql.database,
    port: appConfig.mysql.port,
    charset: 'utf8mb4',
  });
}

async function savePeopleRanking(rows, { year, table, nameColumn, nameKey, mysqlClient = mysql, appConfig }) {
  if (!rows.length) return 0;
  const conn = await createRankingConnection(mysqlClient, appConfig);
  try {
    await conn.beginTransaction();
    const sql = `
      INSERT INTO ${table} (year, ${nameColumn}, score)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE score = VALUES(score)
    `;
    // rank番号に依存しない順位ベーススコア（地方は rank300+ になりうるため）
    for (let i = 0; i < rows.length; i++) {
      await conn.execute(sql, [year, rows[i][nameKey], scoreFromPosition(i)]);
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

async function saveSireRanking(rows, { distance, trackCondition = 'all', mysqlClient = mysql, appConfig }) {
  if (!rows.length) return 0;
  const conn = await createRankingConnection(mysqlClient, appConfig);
  try {
    await conn.beginTransaction();
    const sql = `
      INSERT INTO sire_ranking (distance_m, sire_id, sire_name, score, track_condition)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        sire_name       = VALUES(sire_name),
        score           = VALUES(score)
    `;
    for (const row of rows) {
      await conn.execute(sql, [distance, row.sireId, row.sireName, scoreFromRank(row.rank), trackCondition]);
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

module.exports = {
  TRACK_CONDITION_MAP,
  TRACK_CONDITION_CODES,
  buildPeopleRankingUrl,
  buildRankingUrl,
  buildSireRankingUrl,
  fetchHtml,
  parsePeopleRanking,
  parseSireRanking,
  savePeopleRanking,
  saveSireRanking,
  scoreFromRank,
  scoreFromPosition,
};
