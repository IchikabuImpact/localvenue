/**
 * Usage:
 *   node fetch-jockey-ranking.js [--keep-dumps] [--division=<1|2|3>] [--year=YYYY]
 *   KEEP_DUMPS=1 node fetch-jockey-ranking.js
 *
 * 既定: division=3(地方), year=現在の西暦
 *
 * 取得データ:
 *   上位100件の { 年度, 騎手名, スコア(=101-順位) } を DB(jockey_ranking) へUPSERT
 */
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const config = require('./config.js');

const webdriver = require('selenium-webdriver');
const { By, until } = webdriver;

const { buildDriver } = require('./lib/webdriver');

// ===== DB Pool =====
const pool = mysql.createPool({
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database,
  port: config.mysql.port,
  waitForConnections: true,
  connectionLimit: 8,
});

// ===== オプション =====
const KEEP_DUMPS =
  process.env.KEEP_DUMPS === '1' || process.argv.includes('--keep-dumps');

function getCliOpt(name, defVal) {
  const hit = process.argv.find(a => a.startsWith(`--${name}=`));
  if (!hit) return defVal;
  return hit.split('=')[1];
}

const division = Number(getCliOpt('division', '3')); // 1:総合 2:中央 3:地方
const yearOpt = getCliOpt('year', '');
const now = new Date();
const theYear = Number(yearOpt) || now.getFullYear();

// ===== dump / cleanup =====
const dumpedFiles = [];
function safeUnlink(p) { try { fs.unlinkSync(p); } catch {} }
function cleanupDumps() {
  if (KEEP_DUMPS) {
    console.log('[keep-dumps] オプション有効のため削除しません');
    return;
  }
  if (!dumpedFiles.length) return;
  console.log(`[cleanup] dumpファイル削除: ${dumpedFiles.length} 件`);
  for (const p of dumpedFiles) safeUnlink(p);
}

// 早期終了でも後始末できるように
let cleanupDone = false;
async function finalizeAndExit(code = 0) {
  if (!cleanupDone) {
    cleanupDone = true;
    try { await pool.end(); } catch {}
    cleanupDumps();
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

// ===== URL組み立て（リーディングジョッキー: ranking=8, items=100）=====
function buildUrl(year, division) {
  // JBISのリクエストは y1(年度) y2(出生年?) y3(年度) y_f/y_t(期間) を投げている
  // 実運用: 今年のデータ1年分でOK
  const yTo = year;
  const yFrom = year; // 期間は同一年
  const y2 = year - 2;

  const q = new URLSearchParams({
    sort: 'ranking', order: 'A', items: '100',
    ranking: '8',                       // リーディングジョッキー
    y1: yTo, y2: y2, y3: yTo,
    kind: '1',                          // サラ系
    division: String(division),         // 1:総合 2:中央 3:地方（既定=地方）
    racetype1: '', racetype2: '',       // 総合/平地は画面側で既定
    y_f: yFrom, y_t: yTo, hold: '0',    // 期間=同年, 開催=すべて
    corse1: '', corse2: '', condition: '1',
    distance_f: '', distance_t: '',
    horse: '', seqno: '', match: 'prefix',
  });
  return `https://www.jbis.or.jp/ranking/result/?${q.toString()}#`;
}

async function dump(driver, tag) {
  const ts = Date.now();
  const base = path.resolve(`./dump_jockey_${theYear}_${tag}_${ts}`);
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

// ===== 画面から上位100件抽出 =====
// ページ構造（例）: .data-7__inner 内にヘッダー行 + データ行が <div> で並ぶ
// 各データ行の第1セル=順位, 第2セル( .jc-left )に <a href="/horse/jockey/...">騎手名</a>
async function scrapeTop100(driver) {
  return await driver.executeScript(() => {
    const container = document.querySelector('.data-7__inner');
    if (!container) return [];

    const rows = Array.from(container.querySelectorAll(':scope > div'));
    const out = [];

    for (const row of rows) {
      // ヘッダー行は第1セルに「順位」リンクがあるので除外
      const first = row.children && row.children[0];
      if (!first) continue;
      const firstTxt = (first.textContent || '').trim();
      const rank = Number(firstTxt);
      if (!Number.isFinite(rank) || rank < 1 || rank > 100) continue;

      const a = row.querySelector('a[href*="/horse/jockey/"]');
      if (!a) continue;
      const name = (a.textContent || '').trim();
      if (!name) continue;

      out.push({ rank, jockeyName: name });
      if (out.length >= 100) break;
    }
    // 念のため順位で昇順に整える
    out.sort((a,b) => a.rank - b.rank);
    return out;
  });
}

async function saveRows(rows, year) {
  if (!rows.length) return 0;
  const sql = `
    INSERT INTO jockey_ranking (year, jockey_name, score)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE
      score = VALUES(score)
  `;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    for (const r of rows) {
      const score = 101 - r.rank; // 1位→100点, 100位→1点
      await conn.execute(sql, [year, r.jockeyName, score]);
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
  const url = buildUrl(theYear, division);
  console.log('[year]', theYear, '[division]', division);
  console.log('[url]', url);
const driver = await buildDriver({
  // 並列実行(2本とか)があるなら、プロファイル共有は事故りやすいので分ける
  userDataDir: path.resolve(`./.chrome-profile/jockey-${process.pid}`),
  windowSize: { width: 1400, height: 1600 },
  extraArgs: [
    '--disable-blink-features=AutomationControlled',
    '--lang=ja-JP,ja',
    '--profile-directory=Default',
  ],
});

  try {
    // 1) ランキングTOP → 同意処理 → dump
    await driver.get('https://www.jbis.or.jp/ranking/');
    await acceptConsentIfAny(driver);
    try {
      await driver.executeScript(
        `Object.defineProperty(navigator,'webdriver',{get:()=>undefined});`
      );
    } catch {}
    await dump(driver, 'step1_enter');

    // 2) 結果ページへ（Referer維持のため in-page <a> click）
    await driver.executeScript((href) => {
      const a = document.createElement('a');
      a.href = href; a.rel = 'noopener'; a.textContent = 'go';
      document.body.appendChild(a); a.click();
    }, url);

    await driver.wait(until.urlContains('/ranking/result/'), 60000);
    await driver.sleep(1500);
    await dump(driver, 'step2_result');

    // 3) ジョッキーリンクが出るまで待機
    await driver.wait(async () => {
      const cnt = await driver.executeScript(
        `return document.querySelectorAll('.data-7__inner a[href*="/horse/jockey/"]').length;`
      );
      return cnt > 0;
    }, 120000);
    await dump(driver, 'step3_ready');

    // 4) 1ページ（上位100件）抽出 → 保存
    const rows = await scrapeTop100(driver);
    console.log(`[info] scraped ${rows.length} rows`);
    if (!rows.length) throw new Error('no rows parsed');

    const n = await saveRows(rows, theYear);
    console.log(`[OK] year=${theYear} division=${division} → saved ${n} rows`);
  } catch (e) {
    console.error('[ERROR]', e && e.message ? e.message : e);
    process.exitCode = 1;
  } finally {
    try { await driver.quit(); } catch {}
    await finalizeAndExit(process.exitCode || 0);
  }
})();
