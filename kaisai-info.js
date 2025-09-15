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
  '--window-size=1366,1200',
  '--lang=ja-JP'
);
const driver = new Builder().forBrowser('chrome').setChromeOptions(options).build();

// -------- 会場一覧（表示名に合わせる）--------
const VENUES = [
  "門別","盛岡","水沢","浦和","船橋",
  "大井","川崎","金沢","笠松","名古屋",
  "園田","姫路","高知","佐賀"
];

// -------- babaコードのフォールバック（hrefに無い場合の保険）--------
const venueCodes = {
  10: "盛岡", 11: "水沢", 18: "浦和", 19: "船橋", 20: "大井", 21: "川崎",
  22: "金沢", 23: "笠松", 24: "名古屋",  27: "園田", 28: "姫路",
  31: "高知", 32: "佐賀", 36: "門別"
};
const fallbackMap = new Map(Object.entries(venueCodes).map(([k, v]) => [v, Number(k)]));

// util
const toDate = s => `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
const pad2 = n => String(n).padStart(2, '0');
const daysInMonth = (y, m) => new Date(Number(y), Number(m), 0).getDate();

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

// -------- href のパラメータ抽出（k_raceDate, k_babaCode）--------
function extractParamsFromHref(href) {
  if (!href) return {};
  try {
    const url = new URL(href, 'https://www.keiba.go.jp');
    const raceDate = url.searchParams.get('k_raceDate');  // 例: 2025/09/15
    const babaCode = url.searchParams.get('k_babaCode');  // 例: 31
    return { raceDate, babaCode: babaCode ? Number(babaCode) : undefined };
  } catch {
    return {};
  }
}

// -------- colspan 展開：行の td を 1..days にマッピング（先頭の会場名セルは除外）--------
async function mapCellsByDay(rowEl, y, m) {
  let tds = await rowEl.findElements(By.css('td'));
  if (tds.length === 0) return [];
  // 先頭の td は会場名（例: <td>門別</td>）なのでスキップ
  tds = tds.slice(1);

  const dmax = daysInMonth(y, m);
  const byDay = new Array(dmax + 1).fill(null); // 1基点
  let cur = 1;
  for (const td of tds) {
    const cs = parseInt(await td.getAttribute('colspan') || '1', 10);
    for (let k = 0; k < cs && cur <= dmax; k++) {
      if (!byDay[cur]) byDay[cur] = td;
      cur++;
    }
    if (cur > dmax) break;
  }
  return byDay;
}

// -------- 記号→開催/非開催 判定（img@alt 優先、テキストはフォールバック）--------
async function judgeCell(cellEl) {
  // return { holding: boolean, deltaOnly: boolean, anchorHref?: string }
  const imgs = await cellEl.findElements(By.css('img'));
  let sawHolding = false; // ●/☆/Ｄ
  let sawDelta   = false; // △
  if (imgs.length) {
    for (const img of imgs) {
      const alt = (await img.getAttribute('alt')) || '';
      if (/[●☆Ｄ]/.test(alt)) sawHolding = true;
      if (/△/.test(alt))       sawDelta   = true;
    }
  } else {
    const text = (await cellEl.getText()).trim();
    if (/[●☆Ｄ]/.test(text)) sawHolding = true;
    if (/△/.test(text))       sawDelta   = true;
  }

  // a の href を拾って公式日付/コードを優先利用
  const anchors = await cellEl.findElements(By.css('a'));
  let anchorHref = '';
  if (anchors.length) {
    let picked = null;
    for (const a of anchors) {
      const cls = (await a.getAttribute('class')) || '';
      if (/\b(day|night)\b/.test(cls)) { picked = a; break; }
      picked = picked || a;
    }
    anchorHref = picked ? (await picked.getAttribute('href')) : '';
  }

  return { holding: sawHolding, deltaOnly: sawDelta && !sawHolding, anchorHref };
}

/**
 * 1会場行を読む（会場名<td>で行を特定、colspan対応、href優先）
 */
async function readVenueOnce(venue) {
  const results = {}; // {'yyyymmdd':'会場名', ...}
  console.log('readVenueOnce ' + venue);
  try {
    const dmax = daysInMonth(year, month);

    // ✅ 会場行は<th>ではなく<td>：先頭セルが会場名
    const rowXpath = `//*[@id="mainContainer"]//article[contains(@class,'monthlySchedule')]//table//tbody//tr[td[1][normalize-space()='${venue}']]`;
    const rows = await driver.findElements(By.xpath(rowXpath));
    if (!rows.length) {
      console.warn(`[WARN] venue row not found: ${venue}`);
      return results;
    }
    const row = rows[0];

    // day→td
    const byDay = await mapCellsByDay(row, year, month);

    for (let day = 1; day <= dmax; day++) {
      const cell = byDay[day];
      if (!cell) continue;

      const { holding, deltaOnly, anchorHref } = await judgeCell(cell);
      if (deltaOnly || !holding) continue; // △のみ or マーク無しは不採用

      // 1) href があればそこから公式の date/code を使う（最優先）
      let key = `${year}${pad2(month)}${pad2(day)}`;
      // venucode は保存時にフォールバックで付与（results は venue名のみ保持）
      if (anchorHref) {
        const { raceDate } = extractParamsFromHref(anchorHref);
        if (raceDate) {
          const [yy, mm, dd] = raceDate.split('/').map(s => s.padStart(2, '0'));
          key = `${yy}${mm}${dd}`;
        }
      }

      results[key] = venue;
    }
  } catch (e) {
    console.error('[readVenueOnce]', venue, e.message);
  }
  return results;
}

function mergeResults(list) {
  const merged = new Map(); // key: yyyymmdd, value: Set(venueNames)
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
      console.log('[INFO] まとめ保存対象なし]');
      return;
    }

    conn = await mysql.createConnection({
      host: config.mysql.host,
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
