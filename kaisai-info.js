/**
 * Kaisai-info.js N月の開催情報をMysqlのDBに保存します。
 * Usage:
 *   node Kaisai-info.js           // 今月
 *   node Kaisai-info.js 2025 09   // 年 月
 */

const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const mysql = require('mysql2/promise');

// -------- 引数パース --------
function parseYearMonth(argv) {
  const a = argv[2], b = argv[3];
  const now = new Date();
  if (a && /^\d{6}$/.test(a)) return { year: a.slice(0, 4), month: a.slice(4, 6) };
  const year = a && /^\d{4}$/.test(a) ? a : String(now.getFullYear());
  const month = b && /^\d{1,2}$/.test(b) ? String(b).padStart(2, '0') : String(now.getMonth() + 1).padStart(2, '0');
  return { year, month };
}
const { year, month } = parseYearMonth(process.argv);


const options = new chrome.Options();
options.addArguments(
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--window-size=1366,1000',
  '--lang=ja-JP'
);
const driver = new Builder().forBrowser('chrome').setChromeOptions(options).build();


const venuePositionIndex = {
  "門別": 4,  "盛岡": 6, "水沢": 7, "浦和": 8, "船橋": 9,
  "大井": 10, "川崎": 11, "金沢": 12, "笠松": 13, "名古屋": 14, 
  "園田": 16, "姫路": 17, "高知": 18, "佐賀": 19
};
const VENUES = Object.keys(venuePositionIndex);

// -------- babaコードのフォールバック --------
const venueCodes = {
  10: "盛岡", 11: "水沢", 18: "浦和", 19: "船橋", 20: "大井", 21: "川崎",
  22: "金沢", 23: "笠松", 24: "名古屋",  27: "園田", 28: "姫路",
  31: "高知", 32: "佐賀", 36: "門別"
};

const fallbackMap = new Map(Object.entries(venueCodes).map(([k, v]) => [v, Number(k)]));
const toDate = s => `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;

async function openMonthlyPage() {
  const url = `https://www.keiba.go.jp/KeibaWeb/MonthlyConveneInfo/MonthlyConveneInfoTop?k_year=${year}&k_month=${month}`;
  await driver.get(url);

  // 同意/OKが出る場合のケア（出なければスルー）
  for (const xp of [
    "//button[contains(.,'同意')]", "//button[contains(.,'同意する')]",
    "//button[contains(.,'OK')]", "//a[contains(.,'同意')]"
  ]) {
    const els = await driver.findElements(By.xpath(xp));
    if (els.length) { try { await els[0].click(); } catch (_) { } break; }
  }


  const tbody = By.css('#mainContainer article table tbody');
  await driver.wait(until.elementLocated(tbody), 15000);
  const el = await driver.findElement(tbody);
  await driver.wait(until.elementIsVisible(el), 5000);
}

/**
 * readVenueOnce 1会場分を読む
 * @param {string} venue  name of venue 
 * @returns {Object} 例: {'20250902':'門別', ...}
 */
async function readVenueOnce(venue) {
  const results = {};
  console.log('readVenueOnce'+venue);
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
        const key = `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`;
        results[key] = venue;
      }
    }
  } catch (e) {
    console.error('[readVenueOnce]', venue, e.message);
  }
  return results;
}


function mergeResults(list) {
  const merged = new Map(); // key: yyyymmdd, value: Set(venues)
  for (const r of list) {
    for (const [d, v] of Object.entries(r)) {
      if (!merged.has(d)) merged.set(d, new Set());
      merged.get(d).add(v);
    }
  }
  return merged;
}


async function saveAllToMysql(merged) {
  const config = require('./config.js');
  let conn;
  try {
    const rows = [];
    for (const [key, venues] of merged) {
      const d = toDate(key);
      for (const v of venues) {
        const venucode = fallbackMap.get(v) || 0;
        if (!venucode) continue;
        rows.push([d, venucode, v]);
      }
    }
    if (rows.length === 0) {
      console.log('[INFO] まとめ保存対象なし');
      return;
    }

    conn = await mysql.createConnection({
      host: 'localhost',
      user: config.mysql.user,
      password: config.mysql.password,
      database: config.mysql.database,
    });
    await conn.beginTransaction();

    const chunkSize = 300;
    for (let i = 0; i < rows.length; i += chunkSize) {
      const chunk = rows.slice(i, i + chunkSize);
      const placeholders = chunk.map(() => '(?,?,?)').join(',');
      await conn.execute(
        `INSERT INTO calendar (race_date, venucode, venue)
         VALUES ${placeholders}
         ON DUPLICATE KEY UPDATE venue=VALUES(venue)`,
        chunk.flat()
      );
    }

    await conn.commit();
    console.log(`[OK] Bulk saved ${rows.length} rows to MySQL!`);
  } catch (e) {
    if (conn) { try { await conn.rollback(); } catch { } }
    console.error('[ERROR] saveAllToMysql:', e.message);
  } finally {
    if (conn) { try { await conn.end(); } catch { } }
  }
}

// main
(async () => {
  try {
    console.log(`[INFO] 取得対象: ${year}-${month}`);
    await openMonthlyPage();
    const resultsList = await Promise.all(VENUES.map(v => readVenueOnce(v)));
    resultsList.forEach(r => { if (Object.keys(r).length) console.log(r); });
    await saveAllToMysql(mergeResults(resultsList));
  } catch (e) {
    console.error('[FATAL]', e);
  } finally {
    try { await driver.quit(); } catch (_) { }
  }
})();
