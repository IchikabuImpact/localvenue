#!/usr/bin/env node
/**
 * test-http.js
 * 外部サイトへの HTTP 疎通確認テスト。
 * 各エンドポイントに axios でアクセスし、200 OK と
 * 期待するキーワードが HTML に含まれているかを検証する。
 *
 * Usage:
 *   node tests/test-http.js
 *
 * @copyright © 2026 IchikabuImpact
 * @license Commercial use prohibited without permission.
 */

'use strict';

const axios = require('axios');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36';
const TIMEOUT = 20000;

// JST 今日を YYYY/MM/DD 形式で返す
function jstToday() {
  const jst = new Date(Date.now() + 9 * 3600 * 1000);
  const y = jst.getUTCFullYear();
  const m = String(jst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(jst.getUTCDate()).padStart(2, '0');
  return `${y}/${m}/${d}`;
}

// 確認するエンドポイント
const today = jstToday();
const year  = new Date().getFullYear();
const ENDPOINTS = [
  {
    label: 'keiba.go.jp — 月間開催カレンダー',
    url: 'https://www.keiba.go.jp/KeibaWeb/MonthlyConveneInfo/MonthlyConveneInfoTop',
    contains: '開催',
  },
  {
    label: 'keiba.go.jp — レース一覧（高知）',
    url: `https://www.keiba.go.jp/KeibaWeb/TodayRaceInfo/RaceList?k_raceDate=${encodeURIComponent(today)}&k_babaCode=31`,
    contains: null,  // 200 OK のみ確認
  },
  {
    label: 'jbis.or.jp — 騎手ランキング（地方）',
    url: `https://www.jbis.or.jp/ranking/result/?sort=ranking&order=A&items=100&ranking=8&y1=${year}&y2=${year - 2}&y3=${year}&kind=1&division=3&racetype1=&racetype2=&y_f=${year}&y_t=${year}&hold=0&corse1=&corse2=&condition=1&distance_f=&distance_t=&horse=&seqno=&match=prefix`,
    contains: 'data-7__inner',
  },
  {
    label: 'jbis.or.jp — 種牡馬ランキング（1400m）',
    url: `https://www.jbis.or.jp/ranking/result/?sort=ranking&order=A&items=100&ranking=7&y1=${year}&y2=${year - 2}&y3=${year}&kind=1&division=3&racetype1=3&racetype2=2&y_f=${year - 1}&y_t=${year}&hold=0&corse1=&corse2=&condition=1&distance_f=1400&distance_t=1400&horse=&seqno=&match=prefix`,
    contains: 'data-7__inner',
  },
  {
    label: '楽天競馬 — レース結果ページ',
    url: 'https://keiba.rakuten.co.jp/',
    contains: '楽天競馬',
  },
];

let passed = 0;
let failed = 0;

function ok(label, note = '') {
  console.log(`  ✅ ${label}${note ? `  (${note})` : ''}`);
  passed++;
}
function ng(label, reason) {
  console.error(`  ❌ ${label} — ${reason}`);
  failed++;
}

async function check({ label, url, contains }) {
  try {
    const res = await axios.get(url, {
      headers: {
        'User-Agent':      UA,
        'Accept':          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ja,en-US;q=0.7,en;q=0.3',
        'Accept-Encoding': 'gzip, deflate, br',
      },
      timeout: TIMEOUT,
      decompress: true,
      maxRedirects: 5,
    });

    if (res.status !== 200) {
      ng(label, `HTTP ${res.status}`);
      return;
    }

    if (contains && !res.data.includes(contains)) {
      ng(label, `"${contains}" が HTML に見つかりません`);
      return;
    }

    const size = Math.round(Buffer.byteLength(res.data, 'utf8') / 1024);
    ok(label, `HTTP 200 / ${size} KB`);
  } catch (e) {
    const status = e.response?.status;
    ng(label, status ? `HTTP ${status}` : (e.code || e.message));
  }
}

(async () => {
  console.log(`\n[HTTP疎通確認] ${new Date().toLocaleString('ja-JP')}`);
  console.log(`対象日: ${today}\n`);

  for (const ep of ENDPOINTS) {
    await check(ep);
  }

  console.log(`\n${'─'.repeat(40)}`);
  console.log(`結果: ${passed} passed / ${failed} failed`);
  if (failed > 0) process.exit(1);
})();
