/**
 * Usage:
 *   node fetch-sire-ranking.js <distance_m> [--keep-dumps]
 *   KEEP_DUMPS=1 node fetch-sire-ranking.js <distance_m>
 * 例: node fetch-sire-ranking.js 1300
 */
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const config = require('../config/config.js');

const webdriver = require('selenium-webdriver');
const { By, until } = webdriver;
const chrome = require('selenium-webdriver/chrome');

const dumpsDir = path.resolve(__dirname, '..', 'data', 'dumps');

const pool = mysql.createPool({
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database,
  port: config.mysql.port,
  waitForConnections: true,
  connectionLimit: 8,
});

const dumpedFiles = [];
const KEEP_DUMPS =
  process.env.KEEP_DUMPS === '1' || process.argv.includes('--keep-dumps');

function safeUnlink(p) {
  try { fs.unlinkSync(p); } catch {}
}
function cleanupDumps() {
  if (KEEP_DUMPS) {
    console.log('[keep-dumps] オプション有効のため削除しません');
    return;
  }
  if (!dumpedFiles.length) return;
  console.log(`[cleanup] dumpファイル削除: ${dumpedFiles.length} 件`);
  for (const p of dumpedFiles) safeUnlink(p);
}

// 早期終了でも掃除できるようフックしておく
let cleanupDone = false;
async function finalizeAndExit(code = 0) {
  if (!cleanupDone) {
    cleanupDone = true;
    try { await pool.end(); } catch {}
    cleanupDumps(); // ★ 成功/失敗/中断でも必ず削除
  }
  process.exit(code);
}
process.on('SIGINT',  () => finalizeAndExit(130));
process.on('SIGTERM', () => finalizeAndExit(143));
process.on('uncaughtException', (err) => {
  console.error('[uncaughtException]', err?.message || err);
  finalizeAndExit(1);
});
process.on('unhandledRejection', (err) => {
  console.error('[unhandledRejection]', err?.message || err);
  finalizeAndExit(1);
});

// ---- URL（距離だけ可変。直近1年のダート平地/総合） ----
function buildUrl(distance) {
  const now = new Date();
  const yTo = now.getFullYear();
  const yFrom = yTo - 1;
  const y2 = yTo - 2;
  const q = new URLSearchParams({
    sort: 'ranking', order: 'A', items: '100',
    ranking: '7', y1: yTo, y2: y2, y3: yTo,
    kind: '1', division: '3', racetype1: '3', racetype2: '2',
    y_f: yFrom, y_t: yTo, hold: '0',
    corse1: '', corse2: '', condition: '1',
    distance_f: distance, distance_t: distance,
    horse: '', seqno: '', match: 'prefix',
  });
  return `https://www.jbis.or.jp/ranking/result/?${q.toString()}#`;
}

async function dump(driver, distance, step) {
  // PNGは作らない。HTMLのみ（最後に基本削除）
  const ts = Date.now();
  fs.mkdirSync(dumpsDir, { recursive: true });
  const base = path.join(dumpsDir, `dump_rank_${distance}_${step}_${ts}`);
  const htmlPath = `${base}.html`;

  try {
    const html = await driver.getPageSource();
    fs.writeFileSync(htmlPath, html, 'utf8');
    dumpedFiles.push(htmlPath);
    console.log(`[dump:html] ${htmlPath}`);
  } catch (e) {
    console.warn('[dump:html] 作成に失敗:', e?.message || e);
  }
}

async function acceptConsentIfAny(driver) {
  for (const xp of [
    "//button[contains(.,'同意') or contains(.,'OK')]",
    "//a[contains(.,'同意')]",
    "//button[contains(.,'許可')]",
  ]) {
    const els = await driver.findElements(By.xpath(xp));
    if (els.length) { try { await els[0].click(); } catch {} break; }
  }
}

// ---- 結果ページから上位100件を抽出（テーブル/グリッド両対応） ----
async function scrapeTop100(driver) {
  return await driver.executeScript(() => {
    const getRankFromRow = (row) => {
      if (!row) return null;
      const firstCell = row.querySelector('td,div,span');
      const txt = (firstCell?.textContent || row.textContent || '').trim();
      const m = txt.match(/(^|\D)(\d{1,3})(?=\D|$)/);
      const v = m ? Number(m[2]) : null;
      return (v && v <= 100) ? v : null;
    };

    const links = Array.from(document.querySelectorAll('a[href*="/horse/"]'));
    const items = [];
    for (const a of links) {
      const name = (a.textContent || '').trim();
      if (!name) continue;
      const href = a.getAttribute('href') || '';
      const m = href.match(/\/horse\/(\d{7,})\//);
      if (!m) continue;
      const sireId = m[1];

      const row = a.closest('tr') ||
                  a.closest('.data-row, .dataRow, .tbl-row, .table-row') ||
                  a.closest('li') || a.parentElement;

      let rank = getRankFromRow(row);
      if (!rank) {
        let cur = row;
        for (let k = 0; k < 3 && cur && !rank; k++) {
          cur = cur.previousElementSibling;
          rank = getRankFromRow(cur);
        }
      }
      if (!rank) continue;

      items.push({ rank, sireId, sireName: name });
    }

    items.sort((a,b) => a.rank - b.rank);
    const uniq = [];
    const seen = new Set();
    for (const x of items) {
      if (seen.has(x.sireId)) continue;
      seen.add(x.sireId);
      uniq.push(x);
      if (uniq.length >= 100) break;
    }
    return uniq;
  });
}

async function saveRows(rows, distance) {
  if (!rows.length) return 0;
  const sql = `
    INSERT INTO sire_ranking (distance_m, sire_id, sire_name, score)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      sire_name = VALUES(sire_name),
      score     = VALUES(score)
  `;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    for (const r of rows) {
      await conn.execute(sql, [distance, r.sireId, r.sireName, 101 - r.rank]);
    }
    await conn.commit();
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
  return rows.length;
}

(async function main() {
  const distance = Number(process.argv[2]);
  if (!Number.isFinite(distance)) {
    console.error('Usage: node fetch-sire-ranking.js <distance_m>');
    return finalizeAndExit(1);
  }
  const url = buildUrl(distance);
  console.log('[url]', url);

  const options = new chrome.Options()
    // 安定後は .addArguments('--headless=new') を有効化OK
    .addArguments(
      '--disable-gpu','--no-sandbox','--disable-dev-shm-usage',
      '--disable-blink-features=AutomationControlled',
      '--lang=ja-JP,ja',
      `--user-data-dir=${path.resolve('./.chrome-profile')}`,
      '--profile-directory=Default'
    )
    .windowSize({ width: 1400, height: 1600 });

  const driver = await new webdriver.Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  try {
    await driver.get('https://www.jbis.or.jp/ranking/');
    await acceptConsentIfAny(driver);
    try {
      await driver.executeScript(`Object.defineProperty(navigator,'webdriver',{get:()=>undefined});`);
    } catch {}
    await dump(driver, distance, 'step1_enter');

    await driver.executeScript((href) => {
      const a = document.createElement('a');
      a.href = href; a.rel = 'noopener'; a.textContent = 'go';
      document.body.appendChild(a); a.click();
    }, url);
    await driver.wait(until.urlContains('/ranking/result/'), 60000);
    await driver.sleep(1500);
    await dump(driver, distance, 'step2_result');

    await driver.wait(async () => {
      const cnt = await driver.executeScript(
        'return document.querySelectorAll(\'a[href*="/horse/"]\').length;'
      );
      return cnt > 0;
    }, 120000);
    await dump(driver, distance, 'step3_ready');

    const rows = await scrapeTop100(driver);
    console.log(`[info] scraped ${rows.length} rows`);
    if (!rows.length) throw new Error('no rows parsed');

    const n = await saveRows(rows, distance);
    console.log(`[OK] distance=${distance} → saved ${n} rows`);
  } catch (e) {
    console.error('[ERROR]', e && e.message ? e.message : e);
    process.exitCode = 1;
  } finally {
    try { await driver.quit(); } catch {}
    // プールは finalizeAndExit() で閉じる（順序の都合）
    await finalizeAndExit(process.exitCode || 0);
  }
})();
