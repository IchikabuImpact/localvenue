/**
 * save-race-count-by-date.js
 * 指定日の calendar から会場(venucode)を拾って、レース数(最終R)を全会場分DBに保存します
 *
 * USAGE:
 *   node save-race-count-by-date.js 20250914
 *   node save-race-count-by-date.js 2025-09-14
 *   # 引数なしなら Asia/Tokyo の「今日」
 */
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const mysql = require('mysql2/promise');
const moment = require('moment-timezone');
const config = require('./config.js');

function normalizeDateArg(arg) {
  if (!arg) return moment().tz('Asia/Tokyo').format('YYYY-MM-DD');
  const s = String(arg).replace(/-/g, '');
  if (!/^\d{8}$/.test(s)) throw new Error('Invalid date. Use YYYYMMDD or YYYY-MM-DD.');
  return `${s.slice(0,4)}-${s.slice(4,6)}-${s.slice(6,8)}`;
}
function toParam(dateStr) {
  const y = dateStr.slice(0,4), m = dateStr.slice(5,7), d = dateStr.slice(8,10);
  return encodeURIComponent(`${y}/${m}/${d}`); // YYYY%2FMM%2FDD
}

const options = new chrome.Options()
  .addArguments('--headless=new','--disable-gpu','--no-sandbox','--lang=ja-JP','--window-size=1280,1000');

async function acceptConsentIfAny(driver) {
  for (const xp of [
    "//button[contains(.,'同意')]",
    "//button[contains(.,'同意する')]",
    "//button[contains(.,'OK')]",
    "//a[contains(.,'同意')]",
  ]) {
    const els = await driver.findElements(By.xpath(xp));
    if (els.length) { try { await els[0].click(); } catch(_){} break; }
  }
}

async function scrapeRaceCount(driver, dateParam, babaCode) {
  const url = `https://www.keiba.go.jp/KeibaWeb/TodayRaceInfo/RaceList?k_raceDate=${dateParam}&k_babaCode=${babaCode}`;
  await driver.get(url);
  await acceptConsentIfAny(driver);
  await driver.wait(until.elementLocated(By.css('table')), 15000);

  const tables = await driver.findElements(By.css('table'));
  let maxRace = 0;
  for (const tbl of tables) {
    const rows = await tbl.findElements(By.css('tr'));
    for (const row of rows) {
      const tds = await row.findElements(By.css('td'));
      if (!tds.length) continue;
      const head = (await tds[0].getText()).trim();
      const m = head.match(/^(\d+)\s*[RＲ]$/i);
      if (m) maxRace = Math.max(maxRace, Number(m[1]));
    }
  }
  if (maxRace === 0) {
    const bodyText = await driver.findElement(By.css('body')).getText();
    const matches = bodyText.match(/\b(\d{1,2})\s*[RＲ]\b/g) || [];
    for (const tok of matches) {
      const n = Number(tok.match(/(\d{1,2})/)?.[1]);
      if (Number.isFinite(n)) maxRace = Math.max(maxRace, n);
    }
  }
  if (maxRace === 0) throw new Error(`レース数取得失敗 (code=${babaCode})`);
  return maxRace;
}

async function main() {
  const dateISO = normalizeDateArg(process.argv[2]);  // YYYY-MM-DD
  const oneCodeArg = process.argv[3] && String(process.argv[3]).trim();
  const oneCode = oneCodeArg && /^\d{1,3}$/.test(oneCodeArg) ? Number(oneCodeArg) : null;
  const dateParam = toParam(dateISO);                 // YYYY%2FMM%2FDD
  console.log(`[INFO] target date: ${dateISO}`);

  // DB から当日の会場コードを取得
  const conn = await mysql.createConnection({
    host: config.mysql.host || 'localhost',
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database || 'localkeiba',
  });
  const [rows] = await conn.execute(
    'SELECT venucode FROM calendar WHERE race_date = ? ORDER BY venucode',
    [dateISO]
  );
  if (rows.length === 0 && !oneCode) {
    console.log('[INFO] calendar に該当会場なし。終了');
    await conn.end();
    return;
  }
  let codes = rows.map(r => Number(r.venucode));
  if (oneCode) {
    // 引数で1会場のみ指定されたら、そのみに絞る
    if (!codes.includes(oneCode)) {
      console.warn(`[WARN] calendar に ${oneCode} が見つかりませんでしたが、強制実行します`);
      codes = [oneCode];
    } else {
      codes = [oneCode];
    }
  }
  console.log(`[INFO] venues: ${codes.join(', ')}`);

  const driver = new Builder().forBrowser('chrome').setChromeOptions(options).build();

  try {
    await conn.beginTransaction();
    let ok = 0, ng = 0;
    for (const code of codes) {
      try {
        const cnt = await scrapeRaceCount(driver, dateParam, code);
        const id = dateISO.replace(/-/g,'') + String(code);
        await conn.execute(
          `INSERT INTO race_cnt (id, cnt)
           VALUES (?, ?)
           ON DUPLICATE KEY UPDATE cnt = VALUES(cnt)`,
          [id, cnt]
        );
        console.log(`[OK] ${code}: ${cnt}`);
        ok++;
      } catch (e) {
        console.error(`[NG] ${code}: ${e.message || e}`);
        ng++;
      }
    }
    await conn.commit();
    console.log(`[DONE] total=${codes.length}, ok=${ok}, ng=${ng}`);
  } catch (e) {
    try { await conn.rollback(); } catch {}
    throw e;
  } finally {
    try { await conn.end(); } catch {}
    try { await driver.quit(); } catch {}
  }
}

main().catch(err => {
  console.error('[FATAL]', err.message || err);
  process.exit(1);
});
