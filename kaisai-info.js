/**
 * Kaisai-info.js
 * Usage:
 *   node Kaisai-info.js           // 今月
 *   node Kaisai-info.js 2025 09   // 年 月
 *   node Kaisai-info.js 202509    // 6桁(YYYYMM)
 */

const {Builder, By, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const mysql = require('mysql2/promise');

// -------- 引数パース --------
function parseYearMonth(argv) {
  const a = argv[2], b = argv[3];
  const now = new Date();
  if (a && /^\d{6}$/.test(a)) return { year: a.slice(0,4), month: a.slice(4,6) };
  const year  = a && /^\d{4}$/.test(a) ? a : String(now.getFullYear());
  const month = b && /^\d{1,2}$/.test(b) ? String(b).padStart(2,'0') : String(now.getMonth()+1).padStart(2,'0');
  return { year, month };
}
const { year, month } = parseYearMonth(process.argv);

// -------- Selenium --------
const options = new chrome.Options();
options.addArguments(
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--window-size=1366,1000',
  '--lang=ja-JP'
);
const driver = new Builder().forBrowser('chrome').setChromeOptions(options).build();

// -------- venue → テーブル行番号 --------
const venuePositionIndex = {
  "門別": 4, "札幌": 5, "盛岡": 6, "水沢": 7, "浦和": 8, "船橋": 9,
  "大井": 10, "川崎": 11, "金沢": 12, "笠松": 13, "名古屋": 14, "中京": 15,
  "園田": 16, "姫路": 17, "高知": 18, "佐賀": 19
};
const VENUES = Object.keys(venuePositionIndex);

// -------- babaコードのフォールバック --------
const venueCodes = {
  10: "盛岡", 11: "水沢", 18: "浦和", 19: "船橋", 20: "大井", 21: "川崎",
  22: "金沢", 23: "笠松", 24: "名古屋", 25: "中京", 27: "園田", 28: "姫路",
  31: "高知", 32: "佐賀", 36: "門別", 43: "岩手"
};
const fallbackMap = new Map(Object.entries(venueCodes).map(([k,v]) => [v, Number(k)]));

// -------- 共通ユーティリティ --------
const toDate = s => `${s.slice(0,4)}-${s.slice(4,6)}-${s.slice(6,8)}`;

async function openMonthlyPage() {
  const url = `https://www.keiba.go.jp/KeibaWeb/MonthlyConveneInfo/MonthlyConveneInfoTop?k_year=${year}&k_month=${month}`;
  await driver.get(url);

  // 同意/OKが出る場合のケア（出なければスルー）
  for (const xp of [
    "//button[contains(.,'同意')]", "//button[contains(.,'同意する')]",
    "//button[contains(.,'OK')]",   "//a[contains(.,'同意')]"
  ]) {
    const els = await driver.findElements(By.xpath(xp));
    if (els.length) { try { await els[0].click(); } catch(_){} break; }
  }

  // テーブルが出るまで待機
  const tbody = By.css('#mainContainer article table tbody');
  await driver.wait(until.elementLocated(tbody), 15000);
  const el = await driver.findElement(tbody);
  await driver.wait(until.elementIsVisible(el), 5000);
}

/**
 * 1会場分を読む
 * @param {string} venue
 * @returns {Object} 例: {'20250902':'門別', ...}
 */
async function readVenueOnce(venue) {
  const results = {};
  try {
    const row = venuePositionIndex[venue];
    if (!row) return results;

    // ★ その月の実日数を計算（例: 2025/09 → 30）
    const daysInMonth = new Date(Number(year), Number(month), 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const xp = `//*[@id="mainContainer"]/article/div/div[2]/table/tbody/tr[${row}]/td[${day}]`;
      const cells = await driver.findElements(By.xpath(xp));
      if (!cells.length) continue;
      const text = (await cells[0].getText()).trim();
      if (!text) continue;

      if (text.includes('●') || text.includes('Ｄ') || text.includes('☆')) {
        const key = `${year}${String(month).padStart(2,'0')}${String(day).padStart(2,'0')}`;
        results[key] = venue;
      }
    }
  } catch (e) {
    console.error('[readVenueOnce]', venue, e.message);
  }
  return results;
}

/**
 * 保存（results は 1会場ぶんの連想配列）
 */
async function saveResultToMysql(results) {
  const config = require('./config.js'); // { mysql: { user, password } }
  let connection;
  try {
    const keys = Object.keys(results || {});
    if (keys.length === 0) {
      console.log('[INFO] 空resultsのため保存スキップ');
      return;
    }

    connection = await mysql.createConnection({
      host: 'localhost',
      user: config.mysql.user,
      password: config.mysql.password,
      database: config.mysql.database,
    });

    await connection.beginTransaction();

    for (const k of keys) {
      const venue = results[k];
      // venue名→コード解決（baba未整備時のフォールバック）
      const codeStr = [...fallbackMap.entries()].find(([,name]) => name === venue)?.[0];
      const code = fallbackMap.get(venue) || 0;
      if (!code) {
        console.warn(`[WARN] コード未解決: ${venue} (${k}) → スキップ`);
        continue;
      }

      const d = toDate(k); // DATE型に適合させる
      await connection.execute(
        `INSERT INTO calendar (race_date, code, venue) VALUES (?,?,?) ON DUPLICATE KEY UPDATE venue=VALUES(venue)`,
        [d, code, venue]
      );
    }

    await connection.commit();
    console.log('[OK] Results saved to MySQL!');
  } catch (error) {
    if (connection) { try { await connection.rollback(); } catch(_){} } // ← ここが超重要
    console.error('[ERROR] saveResultToMysql:', error.message);
  } finally {
    if (connection) { try { await connection.end(); } catch(_){} }
  }
}

// ===== メイン =====
(async () => {
  try {
    console.log(`[INFO] 取得対象: ${year}-${month}`);
    await openMonthlyPage();

    const resultsList = await Promise.all(VENUES.map(v => readVenueOnce(v)));
    resultsList.forEach(r => console.log(r)); // ログ確認

    // 旧構造を踏襲：会場ごとに保存（空はスキップされる）
    for (const r of resultsList) {
      await saveResultToMysql(r);
    }
  } catch (e) {
    console.error('[FATAL]', e);
  } finally {
    try { await driver.quit(); } catch(_) {}
  }
})();
