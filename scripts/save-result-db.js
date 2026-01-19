#!/usr/bin/env node
/**
 * @copyright © 2026 IchikabuImpact
 * @license Commercial use prohibited without permission.
 */

/**
 * save-result-db.js
 * Usage: node save-result-db.js 202510130110
 *
 * 1) NARの race_id(YYYYMMDDRRBB) → 楽天RACEID(YYYYMMDD + 8桁場コード + RR) 候補生成
 * 2) 楽天の結果ページを取得して、成績テーブル + 単勝/複勝の払戻をパース
 * 3) race_results / race_payouts に UPSERT（payouts は WIN/PLACE を事前削除して再投入）
 * 4) 未確定文言検知で exit code 2
 */

const axios = require('axios').default;
const cheerio = require('cheerio');
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const config = require('../config/config.js');

// ========= Constants =========
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome Safari';
const HTTP_TIMEOUT_MS = 20000;

// 楽天の8桁場コード（新→旧の順）
const RAKUTEN_BABA_CODE = {
  '03': ['03041503'], // 帯広
  '36': ['36011504'], // 門別
  '10': ['10060902'], // 盛岡
  '11': ['11060605'], // 水沢
  '18': ['18131203'], // 浦和
  '19': ['19140801'], // 船橋
  '20': ['20151205'], // 大井
  '21': ['21350805'], // 川崎
  '22': ['22181501'], // 金沢
  '23': ['23201204'], // 笠松
  '24': ['24332203'], // 名古屋
  '27': ['27261706'], // 園田
  '28': ['28260102'], // 姫路
  '31': ['31291106'], // 高知
  '32': ['32302205'], // 佐賀
};

// ========= CLI args =========
const [, , raceId] = process.argv;
if (!raceId || !/^\d{12}$/.test(raceId)) {
  console.error('Usage: node save-result-db.js YYYYMMDDRRBB');
  process.exit(1);
}
const YMD = raceId.slice(0, 8);
const RR = raceId.slice(8, 10);
const BB = raceId.slice(10, 12);

// ========= Small utils =========
const U = {
  norm: (s) => String(s || '').replace(/\s+/g, ' ').trim(),
  toInt: (s) => {
    const m = String(s || '').replace(/[^\d-]/g, '');
    return m ? parseInt(m, 10) : null;
  },
  toNumLike: (s) => {
    const t = String(s || '').replace(/[^\d.]/g, '');
    return t ? Number(t) : null;
  },
  inRangeHorse: (n) => Number.isFinite(n) && n >= 1 && n <= 18,
  splitByBr: ($cell) => {
    if (!$cell || !$cell.length) return [];
    const html = $cell.html() || '';
    const text = html.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, '');
    return text.split(/\n+/).map(U.norm).filter(Boolean);
  },
};

// ========= Networking =========
async function fetchHtml(url) {
  const res = await axios.get(url, {
    headers: { 'User-Agent': UA, 'Accept-Language': 'ja,en;q=0.9' },
    timeout: HTTP_TIMEOUT_MS,
  });
  return res.data;
}
function isNotReadyText(text) {
  return /公表データはございません|結果はまだ|準備中|開催情報がありません/i.test(text || '');
}

// ========= Rakuten RACEID =========
function narToRakutenRaceIdCandidates(narId) {
  const ymd = narId.slice(0, 8);
  const rr = narId.slice(8, 10);
  const bb = narId.slice(10, 12);
  const codes = RAKUTEN_BABA_CODE[bb] || [];
  return codes.map(code8 => `${ymd}${code8}${rr}`);
}

// ========= Results (成績) =========
function pickResultTable($) {
  let best = null, bestScore = -1;
  $('table').each((_, el) => {
    const $t = $(el);
    let $hdrTr = $t.find('thead tr').first();
    if (!$hdrTr.length) $hdrTr = $t.find('tr').first();
    const headers = $hdrTr.find('th,td').map((_, th) => U.norm($(th).text())).get();
    if (!headers.length) return;
    const hasPos = headers.some(h => h.includes('着順') || h === '着');
    const hasName = headers.some(h => h.includes('馬名'));
    if (!hasPos || !hasName) return;

    const rows = $t.find('tbody tr').length || Math.max(0, $t.find('tr').length - 1);
    const wide = $t.find('tbody tr, tr').filter((_, tr) => $(tr).find('td').length >= 8).length > 0;

    let score = 0;
    score += rows >= 5 ? 3 : rows >= 3 ? 2 : 0;
    if (wide) score += 2;
    if (/払戻|配当/.test($t.text())) score -= 3;
    if (score > bestScore) { best = $t; bestScore = score; }
  });
  return best || cheerio.load('<div/>')('div');
}

function parseResultRows($, table) {
  const out = [];
  if (!table || !table.length) return out;

  let $headerTr = table.find('thead tr').first();
  if (!$headerTr.length) $headerTr = table.find('tr').first();

  const headers = $headerTr.find('th,td').map((_, th) => U.norm($(th).text())).get();
  const bodyRows = table.find('tbody tr').length ? table.find('tbody tr') : table.find('tr').slice(1);

  const idx = (alts) => {
    for (let i = 0; i < headers.length; i++) {
      const h = headers[i];
      for (const a of alts) if (h.includes(a)) return i;
    }
    return -1;
  };

  const col = {
    pos: idx(['着順', '着']),
    frame: idx(['枠', '枠番']),
    num: idx(['馬番', '馬']),
    name: idx(['馬名']),
    jockey: idx(['騎手']),
    time: idx(['タイム']),
    margin: idx(['着差']),
    odds: idx(['単勝', 'オッズ']),
    prize: idx(['賞金']),
  };

  bodyRows.each((_, tr) => {
    const $tr = $(tr);
    const cells = $tr.find('th,td');
    if (!cells.length) return;
    const cell = (i) => (i >= 0 && i < cells.length) ? U.norm($(cells[i]).text()) : '';

    const horse_number = U.toInt(cell(col.num >= 0 ? col.num : 2));
    const horse_name = cell(col.name >= 0 ? col.name : 3);
    if (!horse_number || !horse_name) return;

    let posRaw = cell(col.pos >= 0 ? col.pos : 0);
    let pos = U.toInt(posRaw);
    let disqualified = 0, notes = null;
    if (!Number.isFinite(pos)) {
      if (/失格|取消|除外/.test(posRaw)) { disqualified = 1; notes = posRaw; pos = 99; }
      else if (/中止|落馬|競走中止/.test(posRaw)) { disqualified = 1; notes = posRaw; pos = 98; }
      else if (/同着/.test(posRaw)) {
        const m = posRaw.match(/(\d+)/); pos = m ? parseInt(m[1], 10) : null; notes = '同着';
      }
    }

    const frame_number = U.toInt(cell(col.frame >= 0 ? col.frame : 1));
    const jockey_name = cell(col.jockey >= 0 ? col.jockey : -1) || null;

    const timeRaw = cell(col.time);
    const finish_time = (col.time >= 0 && /\d{1,2}:\d{2}(?:\.\d)?/.test(timeRaw)) ? timeRaw : null;
    const margin = (col.margin >= 0) ? cell(col.margin) || null : null;
    const odds_final = (col.odds >= 0) ? U.toNumLike(cell(col.odds)) : null;

    let prize = null;
    if (col.prize >= 0) {
      const t = cell(col.prize).replace(/[^\d]/g, '');
      if (t) prize = parseInt(t, 10);
    }

    out.push({
      frame_number: Number.isFinite(frame_number) ? frame_number : null,
      horse_number,
      horse_name,
      official_finish_position: Number.isFinite(pos) ? pos : null,
      dead_heat_group: /同着/.test(notes || '') ? 1 : null,
      dead_heat_order_in_group: null,
      finish_time,
      margin,
      jockey_name,
      odds_final: Number.isFinite(odds_final) ? odds_final : null,
      prize: Number.isFinite(prize) ? prize : null,
      disqualified,
      notes
    });
  });

  return out;
}

// ========= Payouts (払戻) =========
function findPayoutTable($) {
  // パターン1: summary 属性
  let $t = $('table[summary*="払戻金"]').first();
  if ($t.length) return $t;

  // パターン2: tbody.repay を親テーブルまで
  const $repayParent = $('tbody.repay').closest('table');
  if ($repayParent.length) return $repayParent.first();

  // パターン3: テキスト探索（最後の砦）
  $t = $('table').filter((_, el) => /払戻金/.test($(el).text())).first();
  return $t; // 0件の可能性もあるが Cheerio オブジェクト
}

function parseWinRow($, $table, validNumbers) {
  // $table が素のノード等でも Cheerio に包む
  const $$table = ($table && typeof $table.find === 'function') ? $table : $($table);
  if (!$$table || !$$table.length) return [];

  const $rows = $$table.find('tbody.repay > tr').length ? $$table.find('tbody.repay > tr') : $$table.find('tr');
  const $row = $rows.filter((_, tr) => U.norm($(tr).children('th,td').first().text()) === '単勝').first();
  if (!$row.length) return [];

  const num = U.toInt($row.find('td.number').first().text());
  const money = U.toInt($row.find('td.money').first().text());
  const pop = U.toInt(($row.find('td.rank').first().text().match(/(\d+)\s*番人気/) || [])[1]);

  if (!U.inRangeHorse(num) || !Number.isFinite(money)) return [];
  if (validNumbers.size && !validNumbers.has(num)) return [];
  return [{ bet_type: 'WIN', horse_number: num, payout: money, popularity: Number.isFinite(pop) ? pop : null }];
}

function parsePlaceRow($, $table, validNumbers) {
  const $$table = ($table && typeof $table.find === 'function') ? $table : $($table);
  if (!$$table || !$$table.length) return [];

  const $rows = $$table.find('tbody.repay > tr').length ? $$table.find('tbody.repay > tr') : $$table.find('tr');
  const $row = $rows.filter((_, tr) => U.norm($(tr).children('th,td').first().text()) === '複勝').first();
  if (!$row.length) return [];

  const nums = U.splitByBr($row.find('td.number').first()); // ["7","1","2"] など
  const moneys = U.splitByBr($row.find('td.money').first());  // ["180 円","370 円","160 円"]
  const ranks = U.splitByBr($row.find('td.rank').first());   // ["3番人気","7番人気","2番人気"] or []

  const len = Math.max(nums.length, moneys.length);
  const out = [];
  for (let i = 0; i < len; i++) {
    const n = U.toInt(nums[i]);
    const pay = U.toInt(moneys[i]);
    const pop = U.toInt((ranks[i] || '').match(/(\d+)\s*番人気/)?.[1]);
    if (!U.inRangeHorse(n) || !Number.isFinite(pay)) continue;
    if (validNumbers.size && !validNumbers.has(n)) continue;
    out.push({ bet_type: 'PLACE', horse_number: n, payout: pay, popularity: Number.isFinite(pop) ? pop : null });
  }
  return out;
}

function parsePayouts($, validNumbers = new Set()) {
  const $table = findPayoutTable($);
  if (!$table || !$table.length) return [];

  // ★ここ重要：parseWinRow は必ず「($, $table, …)」の3引数で呼ぶ（重複呼び出しはしない）
  return [
    ...parseWinRow($, $table, validNumbers),
    ...parsePlaceRow($, $table, validNumbers),
  ].filter(p => p.bet_type === 'WIN' || p.bet_type === 'PLACE');
}

// ========= DB helpers =========
async function bulkInsertOrUpdate(conn, table, cols, rows, onDupCols) {
  if (!rows.length) return;
  const placeholders = rows.map(() => '(' + cols.map(() => '?').join(',') + ')').join(',');
  const params = rows.flatMap(r => cols.map(c => r[c]));
  const onDup = onDupCols.map(c => `${c}=VALUES(${c})`).join(', ');
  const sql = `INSERT INTO ${table} (${cols.join(',')}) VALUES ${placeholders} ON DUPLICATE KEY UPDATE ${onDup}`;
  await conn.execute(sql, params);
}

// ===================== MAIN =====================
(async function main() {
  let conn;
  try {
    // --- Resolve Rakuten page ---
    const candIds = narToRakutenRaceIdCandidates(raceId);
    if (!candIds.length) throw new Error(`Unsupported venue BB=${BB} (no Rakuten mapping)`);

    let html = null, usedRid = null, usedUrl = null, lastErr = null;
    for (const rid of candIds) {
      const url = `https://keiba.rakuten.co.jp/race_performance/list/RACEID/${rid}`;
      try {
        console.log(`[try] ${url}`);
        const h = await fetchHtml(url);
        const $ = cheerio.load(h);
        const pageText = $('body').text();
        if (isNotReadyText(pageText)) {
          console.error(`[INFO] Result not ready yet: ${url}`);
          process.exit(2);
        }
        const table = pickResultTable($);
        if (table && table.length) { html = h; usedRid = rid; usedUrl = url; break; }
        lastErr = new Error('result table not found');
      } catch (e) { lastErr = e; }
    }
    if (!html) throw new Error(`failed to fetch any Rakuten page. tried=${candIds.join(', ')} last=${lastErr?.message || lastErr}`);
    console.log(`[info] Rakuten RACEID=${usedRid} ← ${usedUrl}`);

    // --- Parse result & payouts ---
    const $ = cheerio.load(html);
    const resultTable = pickResultTable($);
    const rows = parseResultRows($, resultTable);
    if (!rows.length) {
      const dump = path.join('/tmp', `rakuten_result_${raceId}.html`);
      try { fs.writeFileSync(dump, $.html(), 'utf8'); } catch { }
      throw new Error('no result rows parsed');
    }

    // 補正：順位欠落は最後尾に暫定付与、同着グルーピング
    let maxPos = Math.max(0, ...rows.map(r => r.official_finish_position || 0));
    for (const r of rows) if (!Number.isFinite(r.official_finish_position)) r.official_finish_position = ++maxPos;

    rows.sort((a, b) => a.official_finish_position - b.official_finish_position || a.horse_number - b.horse_number);
    for (let i = 0; i < rows.length;) {
      const pos = rows[i].official_finish_position;
      const same = rows.filter(x => x.official_finish_position === pos);
      if (same.length > 1) {
        same.sort((a, b) => a.horse_number - b.horse_number).forEach((r, j) => {
          r.dead_heat_group = (r.dead_heat_group || 1);
          r.dead_heat_order_in_group = j + 1;
        });
      }
      i += same.length || 1;
    }

    const validNumbers = new Set(rows.map(r => r.horse_number).filter(n => Number.isFinite(n)));
    const payouts = parsePayouts($, validNumbers);
    if (!payouts.length) console.warn('[WARN] 払戻テーブルが見つかりませんでした（未発表 or DOM差異の可能性）');

    // --- DB ---
    conn = await mysql.createConnection({
      host: config.mysql.host || 'localhost',
      user: config.mysql.user,
      password: config.mysql.password,
      port: config.mysql.port,
      database: config.mysql.database || 'localkeiba',
      charset: 'utf8mb4',
    });
    await conn.beginTransaction();

    // race_results
    const resultCols = [
      'race_id', 'frame_number', 'horse_number', 'horse_name',
      'official_finish_position', 'dead_heat_group', 'dead_heat_order_in_group',
      'finish_time', 'margin', 'jockey_name', 'odds_final', 'prize',
      'disqualified', 'notes'
    ];
    const resultRows = rows.map(r => ({
      race_id: raceId,
      frame_number: r.frame_number ?? null,
      horse_number: r.horse_number,
      horse_name: r.horse_name ?? null,
      official_finish_position: r.official_finish_position,
      dead_heat_group: r.dead_heat_group ?? null,
      dead_heat_order_in_group: r.dead_heat_order_in_group ?? null,
      finish_time: r.finish_time ?? null,
      margin: r.margin ?? null,
      jockey_name: r.jockey_name ?? null,
      odds_final: r.odds_final ?? null,
      prize: r.prize ?? null,
      disqualified: r.disqualified ? 1 : 0,
      notes: r.notes ?? null
    }));
    await bulkInsertOrUpdate(conn, 'race_results', resultCols, resultRows, [
      'frame_number', 'horse_name', 'official_finish_position', 'dead_heat_group', 'dead_heat_order_in_group',
      'finish_time', 'margin', 'jockey_name', 'odds_final', 'prize', 'disqualified', 'notes'
    ]);

    // race_payouts（WIN/PLACE のみ扱うので、対象 bet_type を事前削除してから再投入）
    if (payouts.length) {
      const betTypes = [...new Set(payouts.map(p => p.bet_type))]; // 通常は ['WIN','PLACE']
      const placeholdersBT = betTypes.map(() => '?').join(',');
      await conn.execute(
        `DELETE FROM race_payouts WHERE race_id = ? AND bet_type IN (${placeholdersBT})`,
        [raceId, ...betTypes]
      );
      const payoutCols = ['race_id', 'bet_type', 'horse_number', 'payout', 'popularity'];
      const payoutRows = payouts.map(p => ({
        race_id: raceId,
        bet_type: p.bet_type,
        horse_number: p.horse_number,
        payout: p.payout ?? null,
        popularity: p.popularity ?? null,
      }));
      await bulkInsertOrUpdate(conn, 'race_payouts', payoutCols, payoutRows, ['payout', 'popularity', 'updated_at']);
      console.log(`[OK] race_id=${raceId} → upsert ${payouts.length} rows into race_payouts`);
    }

    await conn.commit();
    console.log(`[OK] race_id=${raceId} → upsert ${rows.length} rows into race_results`);
  } catch (e) {
    try { if (conn) await conn.rollback(); } catch { }
    console.error('[ERROR]', e && e.message ? e.message : e);
    process.exit(1);
  } finally {
    try { if (conn) await conn.end(); } catch { }
  }
})();
