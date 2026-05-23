#!/usr/bin/env node
/**
 * @file    004-racing-form-to-db.js
 * @pipeline [4/5 朝バッチ] 出馬表スクレイピング → DB保存
 * @role    keiba.go.jp の DebaTable（出馬表）を axios+cheerio でパースし、
 *          馬名・騎手・父・母・斤量等を `racing_form` テーブルへ保存する。
 *          同一 race_id への同時書き込みを GET_LOCK でシリアライズ（デッドロック対策）。
 *
 * @input   keiba.go.jp DebaTable（HTML、SSR）
 * @output  DB: racing_form（DELETE→INSERT でリフレッシュ、race_id 単位）
 * @calledby daily-yosou-batch.js [4] (並列実行)
 *
 * Usage:
 *   node 004-racing-form-to-db.js YYYYMMDDRRBB  (例: 202509141131)
 *
 * HTML構造（keiba.go.jp DebaTable）— 馬1頭につき5行ブロック:
 *   行1 (tr.tBorder): 枠番(.courseNum) / 馬番(.horseNum) / 馬名(a.horseName) / 騎手(a.jockeyName)
 *   行2              : 性齢(td.noBorder span) / 毛色(td.noBorder) / 生月("MM.DD生") / 斤量("57.0 ...")
 *   行3              : 父(td[colspan=3]) / 調教師(td[colspan=1] a)
 *   行4              : 母(td[colspan=3]) / 馬主(td[colspan=1])
 *   行5              : 母父(td[colspan=3], 括弧付き) / 生産者(td[colspan=1])
 *
 * @copyright © 2026 IchikabuImpact
 * @license Commercial use prohibited without permission.
 */

'use strict';

const axios   = require('axios');
const cheerio = require('cheerio');
const mysql   = require('mysql2/promise');
const config  = require('../config/config.js');

// ---- 引数 ----
const [, , id12] = process.argv;
if (!id12 || !/^\d{12}$/.test(id12)) {
  console.error('Usage: node 004-racing-form-to-db.js YYYYMMDDRRBB  (例: 202509141131)');
  process.exit(1);
}

const yyyymmdd = id12.slice(0, 8);
const raceNo   = Number(id12.slice(8, 10));
const babaCode = id12.slice(10, 12);
const year     = Number(yyyymmdd.slice(0, 4));
const yy       = year % 100;  // 生年計算用（年齢から逆算）
const race_id  = id12;

// ---- 定数 ----
const UA              = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36';
const HTTP_TIMEOUT_MS = 30000;
const RETRY_MAX       = 3;
const RETRY_DELAY_MS  = 3000;

// ---- URL 生成 ----
function buildUrl(ymd, no, baba) {
  const d = `${ymd.slice(0, 4)}%2F${ymd.slice(4, 6)}%2F${ymd.slice(6, 8)}`;
  return `https://www.keiba.go.jp/KeibaWeb/TodayRaceInfo/DebaTable?k_raceDate=${d}&k_raceNo=${no}&k_babaCode=${baba}`;
}

// ---- HTTP リトライ付き取得 ----
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
          'Referer':         'https://www.keiba.go.jp/KeibaWeb/TodayRaceInfo/RaceList',
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

// ---- HTML パース ----
function parse(html, yy) {
  const $ = cheerio.load(html);

  if (!$('section.cardTable table').length) {
    throw new Error('出馬表テーブルが見つかりません（準備中または該当レースなし）');
  }

  const results = [];

  // 馬1頭 = tr.tBorder から始まる連続5行
  $('section.cardTable table tbody tr.tBorder').each((_, tr1el) => {
    const $r1 = $(tr1el);
    const $r2 = $r1.next('tr');
    const $r3 = $r2.next('tr');
    const $r4 = $r3.next('tr');
    const $r5 = $r4.next('tr');

    // ---- 行1: 枠番・馬番・馬名・騎手 ----
    const frame_number = Number($r1.find('td.courseNum').text().trim());
    const horse_number = Number($r1.find('td.horseNum').text().trim());
    const horse_name   = $r1.find('a.horseName').text().trim();
    if (!frame_number || !horse_number || !horse_name) return;

    // 騎手名: jockeyarea（所属）span を除いたテキストノードのみ
    const $jockeyA = $r1.find('a.jockeyName');
    let jockey = null, affiliation = null;
    if ($jockeyA.length) {
      const $c = $jockeyA.clone();
      affiliation = $c.find('span.jockeyarea').text().replace(/[()（）]/g, '').trim() || null;
      $c.find('span').remove();
      jockey = $c.text().trim() || null;
    }

    // ---- 行2: 性齢・毛色・生月・斤量 ----
    const $noBorder = $r2.find('td.noBorder');
    const sex_age   = $noBorder.eq(0).find('span').text().trim()
                   || $noBorder.eq(0).text().trim()
                   || null;
    const hair      = $noBorder.eq(1).text().trim() || null;

    let birthStr = '', burden_weight = null;
    $r2.find('td').each((_, td) => {
      const t = $(td).text().trim();
      // 生月: "MM.DD生" 形式
      if (!birthStr && /\d{2}\.\d{2}生/.test(t)) {
        birthStr = t;
      }
      // 斤量: 先頭が "NN.N" の形式で 40〜65 の範囲
      if (burden_weight === null) {
        const m = t.replace(/[　\s]+/g, ' ').match(/^(\d{2,3}\.\d)\b/);
        if (m) {
          const v = parseFloat(m[1]);
          if (v >= 40 && v <= 65) burden_weight = v;
        }
      }
    });

    let birthymonth = 0, birthyear = 0;
    const birthMatch = birthStr.match(/(\d{2})\.(\d{2})生/);
    if (birthMatch) birthymonth = Number(birthMatch[1]) || 0;
    const ageMatch = (sex_age || '').match(/(\d+)/);
    if (ageMatch) {
      const age = Number(ageMatch[1]);
      birthyear = yy - age;
      if (birthyear < 0) birthyear += 100;
    }

    // ---- 行3: 父・調教師 ----
    const sire       = $r3.find('td[colspan="3"]').first().text().trim() || null;
    const trainerRaw = ($r3.find('td[colspan="1"]').first().find('a').text()
                     || $r3.find('td[colspan="1"]').first().text()).trim();
    // 末尾の（地区）を除去: "中西達（高知）" → "中西達"
    const trainer    = trainerRaw.replace(/\s*[（(][^)）]*[)）]\s*$/, '').trim() || null;

    // ---- 行4: 母・馬主 ----
    const dam   = $r4.find('td[colspan="3"]').first().text().trim() || null;
    const owner = $r4.find('td[colspan="1"]').first().text().trim() || null;

    // ---- 行5: 母父・生産者 ----
    // 母父は "（ゴールドアリュール）" 形式なので括弧を除去
    const bmsRaw       = $r5.find('td[colspan="3"]').first().text().trim();
    const broodmare_sire = bmsRaw.replace(/^[（(]\s*|\s*[)）]$/g, '').trim() || null;
    const breeder      = $r5.find('td[colspan="1"]').first().text().trim() || null;

    results.push({
      frame_number, horse_number, horse_name,
      sex_age, hair, birthyear, birthymonth,
      sire, dam, broodmare_sire,
      jockey, affiliation,
      burden_weight,
      trainer, owner, breeder,
    });
  });

  return results;
}

// ---- deadlock 対策ユーティリティ ----
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function isDeadlock(err) {
  const msg = err?.message || '';
  return !!(err && (err.code === 'ER_LOCK_DEADLOCK' || /Deadlock found/i.test(msg)));
}

// ---- メイン ----
(async () => {
  const url = buildUrl(yyyymmdd, raceNo, babaCode);
  console.log(`[info] ${race_id} → ${url}`);

  let conn;
  try {
    const html = await fetchHtml(url);
    const rows = parse(html, yy);
    if (!rows.length) throw new Error('出馬表の抽出に失敗しました（0頭）');

    conn = await mysql.createConnection({
      host:     config.mysql.host || 'localhost',
      user:     config.mysql.user,
      password: config.mysql.password,
      port:     config.mysql.port,
      database: config.mysql.database || 'localvenue',
      charset:  'utf8mb4',
    });
    await conn.query('SET NAMES utf8mb4');

    const cols = [
      'race_id', 'frame_number', 'horse_number', 'horse_name',
      'sex_age', 'hair', 'birthyear', 'birthymonth',
      'sire', 'dam', 'broodmare_sire',
      'jockey_name', 'affiliation',
      'carried_weight', 'trainer_name', 'owner', 'breeder',
    ];
    const placeholders = rows.map(() => `(${cols.map(() => '?').join(',')})`).join(',');
    const params = [];
    for (const r of rows) {
      params.push(
        race_id,
        r.frame_number, r.horse_number, r.horse_name,
        r.sex_age, r.hair, r.birthyear, r.birthymonth,
        r.sire, r.dam, r.broodmare_sire,
        r.jockey, r.affiliation,
        r.burden_weight,
        r.trainer, r.owner, r.breeder,
      );
    }

    const sql = `
      INSERT INTO racing_form (${cols.join(',')})
      VALUES ${placeholders}
      ON DUPLICATE KEY UPDATE
        frame_number=VALUES(frame_number),
        horse_name=VALUES(horse_name),
        sex_age=VALUES(sex_age),
        hair=VALUES(hair),
        birthyear=VALUES(birthyear),
        birthymonth=VALUES(birthymonth),
        sire=VALUES(sire),
        dam=VALUES(dam),
        broodmare_sire=VALUES(broodmare_sire),
        jockey_name=VALUES(jockey_name),
        affiliation=VALUES(affiliation),
        carried_weight=VALUES(carried_weight),
        trainer_name=VALUES(trainer_name),
        owner=VALUES(owner),
        breeder=VALUES(breeder),
        updated_at=CURRENT_TIMESTAMP
    `;

    // 同一 race_id の同時更新を直列化（deadlock回避）
    const lockName = `racing_form_${race_id}`;
    await conn.execute('SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED');

    let gotLock = 0;
    try {
      const [[lRow]] = await conn.execute('SELECT GET_LOCK(?, ?) AS got', [lockName, 10]);
      gotLock = lRow?.got || 0;
      if (gotLock !== 1) console.warn(`[warn] lock取得失敗: ${lockName} → ロックなしで続行`);

      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          await conn.beginTransaction();
          await conn.execute('DELETE FROM racing_form WHERE race_id = ?', [race_id]);
          await conn.execute(sql, params);
          await conn.commit();
          break;
        } catch (txErr) {
          try { await conn.rollback(); } catch {}
          if (!isDeadlock(txErr) || attempt === 3) throw txErr;
          await sleep(200 * attempt);
        }
      }
    } finally {
      if (gotLock === 1) {
        try { await conn.execute('SELECT RELEASE_LOCK(?)', [lockName]); } catch {}
      }
    }

    console.log(`[OK] race_id=${race_id} → upsert ${rows.length} rows`);

  } catch (err) {
    console.error('[ERROR]', err?.message || err);
    process.exit(1);
  } finally {
    try { if (conn) await conn.end(); } catch {}
  }
})();
