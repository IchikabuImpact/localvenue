/*
 * 004-racing-form-to-db.js  (babaCode解決版)
 * Usage:
 *   node 004-racing-form-to-db.js 202510130110   # YYYYMMDD + RR + BB
 */

/**
 * @copyright © 2026 IchikabuImpact
 * @license Commercial use prohibited without permission.
 */

const webdriver = require('selenium-webdriver');
const { By, until } = webdriver;
const chrome = require('selenium-webdriver/chrome');
const mysql = require('mysql2/promise');
const config = require('../config/config.js');

// ---- 引数 ----
const [, , id12] = process.argv;
if (!id12 || !/^\d{12}$/.test(id12)) {
  console.error('Usage: node 004-racing-form-to-db.js YYYYMMDDRRBB  (例: 202509141131)');
  process.exit(1);
}
const yyyymmdd = id12.slice(0, 8);
const raceNo2 = id12.slice(8, 10);
const raceNumber = Number(raceNo2);
const year = Number(yyyymmdd.slice(0, 4));
const yy = year % 100;
const raceDateStr = `${yyyymmdd.slice(0, 4)}/${yyyymmdd.slice(4, 6)}/${yyyymmdd.slice(6, 8)}`;
const race_id = id12;

// ===== babaCode 解決ユーティリティ =====
function encodeDateForQuery(ymd) {
  return `${ymd.slice(0, 4)}%2F${ymd.slice(4, 6)}%2F${ymd.slice(6, 8)}`;
}
async function getCandidateBabaCodesFromDB(ymd) {
  let conn;
  try {
    conn = await mysql.createConnection(config.mysql);
    await conn.query("SET NAMES utf8mb4 COLLATE utf8mb4_0900_ai_ci");
    const [r1] = await conn.execute("SELECT venue_code AS code FROM race_count_by_date WHERE ymd = ?", [ymd]);
    const [r2] = await conn.execute("SELECT LPAD((id % 100), 2, '0') AS code FROM race_cnt WHERE LEFT(CAST(id AS CHAR), 8) = ?", [ymd]);
    const codes = [...r1.map(x => String(x.code).trim()), ...r2.map(x => String(x.code).trim())].filter(Boolean);
    return [...new Set(codes)];
  } catch (e) {
    console.warn('[warn] getCandidateBabaCodesFromDB failed:', e.message);
    return [];
  } finally {
    if (conn) await conn.end();
  }
}

async function getCandidateBabaCodesFromWeb(driver, ymd) {
  const dateStr = `${ymd.slice(0, 4)}/${ymd.slice(4, 6)}/${ymd.slice(6, 8)}`;
  const url = `https://www.keiba.go.jp/KeibaWeb/TodayRaceInfo/RaceList?k_raceDate=${encodeURIComponent(dateStr)}`;
  await driver.get(url);
  await acceptConsentIfAny(driver);
  const sel = await driver.wait(until.elementLocated(By.css('select[name="k_babaCode"], #k_babaCode')), 15000);
  const opts = await sel.findElements(By.css('option'));
  const codes = [];
  for (const opt of opts) {
    const v = (await opt.getAttribute('value'))?.trim();
    if (v) codes.push(v);
  }
  return [...new Set(codes)];
}

async function tryOpenDebaTable(driver, ymd, raceNo, babaCode) {
  const url = `https://www.keiba.go.jp/KeibaWeb/TodayRaceInfo/DebaTable?k_raceDate=${encodeDateForQuery(ymd)}&k_raceNo=${raceNo}&k_babaCode=${babaCode}`;
  await driver.get(url);
  await acceptConsentIfAny(driver);
  try {
    await driver.wait(until.elementLocated(By.css('section.cardTable table, table.cardTable, .cardTable table')), 30000);
    console.log(`[info] DebaTable OK with k_babaCode=${babaCode} → ${url}`);
    return { ok: true, url };
  } catch (e) {
    try {
      const body = await driver.findElement(By.css('body')).getText();
      if (/該当|準備中|メンテ/i.test(body)) return { ok: false, url, reason: 'not-ready' };
    } catch { }
    return { ok: false, url, reason: 'timeout' };
  }
}

async function resolveAndOpenDebaTable(driver, ymd, raceNo, targetBaba = null) {
  let candidates = [];
  if (targetBaba) {
    candidates = [targetBaba];
  } else {
    const dbCodes = await getCandidateBabaCodesFromDB(ymd);
    const webCodes = await getCandidateBabaCodesFromWeb(driver, ymd).catch(() => []);
    candidates = [...new Set([...(dbCodes || []), ...(webCodes || [])])];
  }
  if (!candidates.length) throw new Error(`no k_babaCode candidates for ${ymd}`);
  for (const code of candidates) {
    const r = await tryOpenDebaTable(driver, ymd, raceNo, code);
    if (r.ok) return { babaCode: code, url: r.url };
  }
  throw new Error(`DebaTable not available for ${ymd} R${raceNo}. tried=${JSON.stringify(candidates)}`);
}

async function acceptConsentIfAny(driver) {
  for (const xp of ["//button[contains(.,'同意') or contains(.,'OK')]", "//a[contains(.,'同意')]"]) {
    const els = await driver.findElements(By.xpath(xp));
    if (els.length) { try { await els[0].click(); } catch { } break; }
  }
}

(async function main() {
  const options = new chrome.Options().addArguments(
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-cache',
    '--disable-dev-shm-usage',
    '--window-size=1280,2000',
    `--user-data-dir=/tmp/chrome-profile-${id12}`,
    '--user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome Safari'
  );
  const driver = await new webdriver.Builder().forBrowser('chrome').setChromeOptions(options).build();
  await driver.manage().deleteAllCookies();

  let conn;
  try {
    const baba2 = id12.slice(10, 12);
    const { babaCode } = await resolveAndOpenDebaTable(driver, yyyymmdd, raceNumber, baba2);
    console.log(`[info] using k_babaCode=${babaCode} for ${raceDateStr} R${raceNumber}`);

    const rows = await driver.executeScript((yy) => {
      const norm = (s) => (s || '').replace(/\s+/g, ' ').trim();
      const table = document.querySelector('section.cardTable > table') || document.querySelector('table.cardTable') || document.querySelector('.cardTable table');
      if (!table) return [];
      const trs = Array.from(table.querySelectorAll('tbody > tr'));
      const starts = [];
      trs.forEach((tr, i) => { if (tr.querySelector('td.horseNum')) starts.push(i); });
      if (!starts.length) return [];
      const hairRx = /鹿毛|黒鹿毛|栗毛|芦毛|栃栗毛|青毛|白毛|青鹿毛/;
      const timeRx = /\b\d{1,2}:\d{2}(?:\.\d)?\b/;
      const babaRx = /(良|稍重|重|不良)/;
      const asText = (tr, i) => { const td = tr?.querySelectorAll('td')?.[i]; return norm(td ? td.innerText : ''); };
      const weightStr = (s) => {
        const m = (s || '').match(/(▲|△|◇)?\s*(\d{2,3}\.\d)\b/);
        if (!m) return null;
        const v = parseFloat(m[2]);
        if (v < 40 || v > 65) return null;
        return m[1] ? `${m[1]} ${m[2]}` : m[2];
      };
      const out = [];
      let lastFrame = 0;
      for (let k = 0; k < starts.length; k++) {
        const s = starts[k], e = (k + 1 < starts.length) ? starts[k + 1] : trs.length;
        const block = trs.slice(s, e), r0 = block[0];
        const frameEl = r0.querySelector('td.courseNum:not(.waku)');
        let frame_number = frameEl ? Number(frameEl.textContent.trim()) : lastFrame;
        if (!Number.isFinite(frame_number)) frame_number = 0;
        if (frameEl) lastFrame = frame_number;
        const horse_number = Number(r0.querySelector('td.horseNum')?.textContent?.trim());
        const horse_name = norm(r0.querySelector('a.horseName')?.textContent || r0.querySelector('.horseName')?.textContent || '');
        let jockey = null, affiliation = null;
        const aJ = r0.querySelector('a.jockeyName');
        if (aJ) {
          let name = '';
          aJ.childNodes.forEach(n => { if (n.nodeType === Node.TEXT_NODE) name += n.textContent; });
          jockey = norm(name) || norm(aJ.textContent.replace(/\（[^）]+\）/, '')) || null;
          const area = aJ.querySelector('.jockeyarea');
          affiliation = area ? area.textContent.replace(/[()（）]/g, '').trim() : null;
        }
        let sex_age = null, hair = null, birthStr = null, burden_weight = null;
        for (const tr of block) {
          const t0 = asText(tr, 0), t1 = asText(tr, 1);
          if (/(牡|牝|騙)\s*\d+/.test(t0) && hairRx.test(t1)) { sex_age = t0; hair = t1; birthStr = asText(tr, 2); burden_weight = weightStr(asText(tr, 3)); break; }
        }
        let birthyear = 0, birthymonth = 0;
        const bm = (birthStr || '').match(/(\d{2})\.(\d{2})生/);
        if (bm) birthymonth = Number(bm[1]) || 0;
        const ageM = (sex_age || '').match(/(\d+)/);
        if (ageM) { const age = Number(ageM[1]); if (Number.isFinite(age)) { birthyear = yy - age; if (birthyear < 0) birthyear += 100; } }
        const geneCands = [];
        for (const tr of block) {
          const leftTd = tr.querySelector('td[colspan]'); if (!leftTd) continue;
          const left = norm(leftTd.innerText), right = norm((tr.querySelector('td[colspan] + td') || tr.querySelectorAll('td')[1])?.innerText || '');
          if (!left || /^[-－]+$/.test(left) || timeRx.test(left) || timeRx.test(right) || babaRx.test(right)) continue;
          geneCands.push({ tr, left, right });
        }
        let trainer = null, owner = null;
        for (const tr of block) {
          const tds = tr.querySelectorAll('td'); if (tds.length < 2) continue;
          const left = norm(tds[0].innerText), right = norm(tds[1].innerText);
          if (!trainer && /^調教師[:：]/.test(right)) trainer = right.replace(/^調教師[:：]\s*/, '').replace(/\s*[（(].*?[)）]\s*$/, '').trim() || null;
          if (!owner && /^馬主[:：]/.test(right)) owner = right.replace(/^馬主[:：]\s*/, '').replace(/\s*[（(].*?[)）]\s*$/, '').trim() || null;
        }
        const bmsIdx = geneCands.findIndex(x => /^[（(]/.test(x.left));
        let broodmare_sire = null, breeder = null;
        if (bmsIdx >= 0) { const x = geneCands.splice(bmsIdx, 1)[0]; broodmare_sire = x.left.replace(/^[（(]\s*|\s*[)）]$/g, '').trim() || null; breeder = x.right.replace(/^(生産牧場|生産者|生産)[:：]?\s*/, '').trim() || null; }
        const pureGeneRows = geneCands.filter(x => !/^調教師[:：]/.test(x.right) && !/^馬主[:：]/.test(x.right));
        let sire = null, dam = null;
        if (pureGeneRows.length >= 2) { sire = pureGeneRows[0].left || null; dam = pureGeneRows[1].left || null; }
        if (!Number.isFinite(horse_number) || horse_number < 1 || frame_number < 1 || frame_number > 8 || !horse_name) continue;
        out.push({ frame_number, horse_number, horse_name, sex_age, hair, birthyear, birthymonth, sire, dam, broodmare_sire, jockey, affiliation, burden_weight, trainer, owner, breeder });
      }
      return out;
    }, yy);

    if (!rows.length) throw new Error('出馬表の抽出に失敗しました');

    conn = await mysql.createConnection({ host: config.mysql.host || 'localhost', user: config.mysql.user, password: config.mysql.password, port: config.mysql.port, database: config.mysql.database || 'localkeiba', charset: 'utf8mb4' });
    const cols = ['race_id', 'frame_number', 'horse_number', 'horse_name', 'sex_age', 'hair', 'birthyear', 'birthymonth', 'sire', 'dam', 'broodmare_sire', 'jockey_name', 'affiliation', 'carried_weight', 'trainer_name', 'owner', 'breeder'];
    const placeholders = rows.map(() => '(' + cols.map(() => '?').join(',') + ')').join(',');
    const params = [];
    rows.forEach(r => {
      const carriedRaw = r.burden_weight ? parseFloat(String(r.burden_weight).replace(/[^\d.]/g, '')) : null;
      params.push(race_id, r.frame_number, r.horse_number, r.horse_name, r.sex_age, r.hair, r.birthyear, r.birthymonth, r.sire, r.dam, r.broodmare_sire, r.jockey, r.affiliation, Number.isFinite(carriedRaw) ? carriedRaw : null, r.trainer, r.owner, r.breeder);
    });
    const sql = `INSERT INTO racing_form (${cols.join(',')}) VALUES ${placeholders} ON DUPLICATE KEY UPDATE frame_number=VALUES(frame_number), horse_name=VALUES(horse_name), sex_age=VALUES(sex_age), hair=VALUES(hair), birthyear=VALUES(birthyear), birthymonth=VALUES(birthymonth), sire=VALUES(sire), dam=VALUES(dam), broodmare_sire=VALUES(broodmare_sire), jockey_name=VALUES(jockey_name), affiliation=VALUES(affiliation), carried_weight=VALUES(carried_weight), trainer_name=VALUES(trainer_name), owner=VALUES(owner), breeder=VALUES(breeder), updated_at=CURRENT_TIMESTAMP`;
    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await conn.execute('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');
        await conn.beginTransaction();
        await conn.execute(`DELETE FROM racing_form WHERE race_id = ?`, [race_id]);
        await conn.execute(sql, params);
        await conn.commit();
        break;
      } catch (txErr) {
        const msg = txErr && txErr.message ? txErr.message : '';
        const isDeadlock = txErr && (txErr.code === 'ER_LOCK_DEADLOCK' || /Deadlock found/i.test(msg));
        try { await conn.rollback(); } catch { }
        if (!isDeadlock || attempt === maxRetries) throw txErr;
        await new Promise(resolve => setTimeout(resolve, 200 * attempt));
      }
    }
    await conn.end();
    console.log(`[OK] race_id=${race_id} → upsert ${rows.length} rows`);
  } catch (err) {
    try { if (conn) await conn.rollback(); } catch { }
    console.error('[ERROR]', err && err.message ? err.message : err);
    process.exitCode = 1;
  } finally {
    try { await driver.quit(); } catch { }
  }
})();
