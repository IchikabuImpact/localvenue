'use strict';

const cheerio = require('cheerio');

const U = {
  norm: s => String(s || '').replace(/\s+/g, ' ').trim(),
  toInt: s => {
    const m = String(s || '').replace(/[^\d-]/g, '');
    return m ? parseInt(m, 10) : null;
  },
  toNumLike: s => {
    const t = String(s || '').replace(/[^\d.]/g, '');
    return t ? Number(t) : null;
  },
  inRangeHorse: n => Number.isFinite(n) && n >= 1 && n <= 18,
  splitByBr: $cell => {
    if (!$cell || !$cell.length) return [];
    const html = $cell.html() || '';
    const text = html.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, '');
    return text.split(/\n+/).map(U.norm).filter(Boolean);
  },
};

function isNotReadyText(text) {
  return /公表データはございません|結果はまだ|準備中|開催情報がありません/i.test(text || '');
}

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
  const idx = alts => {
    for (let i = 0; i < headers.length; i++) for (const a of alts) if (headers[i].includes(a)) return i;
    return -1;
  };
  const col = { pos: idx(['着順', '着']), frame: idx(['枠', '枠番']), num: idx(['馬番', '馬']), name: idx(['馬名']), jockey: idx(['騎手']), time: idx(['タイム']), margin: idx(['着差']), odds: idx(['単勝', 'オッズ']), prize: idx(['賞金']) };
  bodyRows.each((_, tr) => {
    const cells = $(tr).find('th,td');
    if (!cells.length) return;
    const cell = i => (i >= 0 && i < cells.length) ? U.norm($(cells[i]).text()) : '';
    const horse_number = U.toInt(cell(col.num >= 0 ? col.num : 2));
    const horse_name = cell(col.name >= 0 ? col.name : 3);
    if (!horse_number || !horse_name) return;
    let posRaw = cell(col.pos >= 0 ? col.pos : 0);
    let pos = U.toInt(posRaw);
    let disqualified = 0, notes = null;
    if (!Number.isFinite(pos)) {
      if (/失格|取消|除外/.test(posRaw)) { disqualified = 1; notes = posRaw; pos = 99; }
      else if (/中止|落馬|競走中止/.test(posRaw)) { disqualified = 1; notes = posRaw; pos = 98; }
      else if (/同着/.test(posRaw)) { const m = posRaw.match(/(\d+)/); pos = m ? parseInt(m[1], 10) : null; notes = '同着'; }
    }
    const frame_number = U.toInt(cell(col.frame >= 0 ? col.frame : 1));
    const timeRaw = cell(col.time);
    const odds_final = (col.odds >= 0) ? U.toNumLike(cell(col.odds)) : null;
    let prize = null;
    if (col.prize >= 0) { const t = cell(col.prize).replace(/[^\d]/g, ''); if (t) prize = parseInt(t, 10); }
    out.push({ frame_number: Number.isFinite(frame_number) ? frame_number : null, horse_number, horse_name, official_finish_position: Number.isFinite(pos) ? pos : null, dead_heat_group: /同着/.test(notes || '') ? 1 : null, dead_heat_order_in_group: null, finish_time: (col.time >= 0 && /\d{1,2}:\d{2}(?:\.\d)?/.test(timeRaw)) ? timeRaw : null, margin: col.margin >= 0 ? cell(col.margin) || null : null, jockey_name: cell(col.jockey >= 0 ? col.jockey : -1) || null, odds_final: Number.isFinite(odds_final) ? odds_final : null, prize: Number.isFinite(prize) ? prize : null, disqualified, notes });
  });
  return out;
}

function findPayoutTable($) {
  let $t = $('table[summary*="払戻金"]').first();
  if ($t.length) return $t;
  const $repayParent = $('tbody.repay').closest('table');
  if ($repayParent.length) return $repayParent.first();
  return $('table').filter((_, el) => /払戻金/.test($(el).text())).first();
}
function parseWinRow($, $table, validNumbers) {
  const $$table = ($table && typeof $table.find === 'function') ? $table : $($table);
  if (!$$table || !$$table.length) return [];
  const $rows = $$table.find('tbody.repay > tr').length ? $$table.find('tbody.repay > tr') : $$table.find('tr');
  const $row = $rows.filter((_, tr) => U.norm($(tr).children('th,td').first().text()) === '単勝').first();
  if (!$row.length) return [];
  const nums = U.splitByBr($row.find('td.number').first());
  const moneys = U.splitByBr($row.find('td.money').first());
  const ranks = U.splitByBr($row.find('td.rank').first());
  const out = [];
  for (let i = 0; i < Math.max(nums.length, moneys.length); i++) {
    const num = U.toInt(nums[i]); const money = U.toInt(moneys[i]); const pop = U.toInt(((ranks[i] || '').match(/(\d+)\s*番人気/) || [])[1]);
    if (!U.inRangeHorse(num) || !Number.isFinite(money)) continue;
    if (validNumbers.size && !validNumbers.has(num)) continue;
    out.push({ bet_type: 'WIN', horse_number: num, payout: money, popularity: Number.isFinite(pop) ? pop : null });
  }
  return out;
}
function parsePlaceRow($, $table, validNumbers) {
  const $$table = ($table && typeof $table.find === 'function') ? $table : $($table);
  if (!$$table || !$$table.length) return [];
  const $rows = $$table.find('tbody.repay > tr').length ? $$table.find('tbody.repay > tr') : $$table.find('tr');
  const $row = $rows.filter((_, tr) => U.norm($(tr).children('th,td').first().text()) === '複勝').first();
  if (!$row.length) return [];
  const nums = U.splitByBr($row.find('td.number').first());
  const moneys = U.splitByBr($row.find('td.money').first());
  const ranks = U.splitByBr($row.find('td.rank').first());
  const out = [];
  for (let i = 0; i < Math.max(nums.length, moneys.length); i++) {
    const n = U.toInt(nums[i]); const pay = U.toInt(moneys[i]); const pop = U.toInt((ranks[i] || '').match(/(\d+)\s*番人気/)?.[1]);
    if (!U.inRangeHorse(n) || !Number.isFinite(pay)) continue;
    if (validNumbers.size && !validNumbers.has(n)) continue;
    out.push({ bet_type: 'PLACE', horse_number: n, payout: pay, popularity: Number.isFinite(pop) ? pop : null });
  }
  return out;
}
function parsePayouts($, validNumbers = new Set()) {
  const $table = findPayoutTable($);
  if (!$table || !$table.length) return [];
  return [...parseWinRow($, $table, validNumbers), ...parsePlaceRow($, $table, validNumbers)].filter(p => p.bet_type === 'WIN' || p.bet_type === 'PLACE');
}
function finalizeResultRows(rows) {
  let maxPos = Math.max(0, ...rows.map(r => r.official_finish_position || 0));
  for (const r of rows) if (!Number.isFinite(r.official_finish_position)) r.official_finish_position = ++maxPos;
  rows.sort((a, b) => a.official_finish_position - b.official_finish_position || a.horse_number - b.horse_number);
  for (let i = 0; i < rows.length;) {
    const pos = rows[i].official_finish_position;
    const same = rows.filter(x => x.official_finish_position === pos);
    if (same.length > 1) same.sort((a, b) => a.horse_number - b.horse_number).forEach((r, j) => { r.dead_heat_group = (r.dead_heat_group || 1); r.dead_heat_order_in_group = j + 1; });
    i += same.length || 1;
  }
  return rows;
}
function parseRakutenResultHtml(html) {
  const $ = cheerio.load(html);
  const resultTable = pickResultTable($);
  const rows = finalizeResultRows(parseResultRows($, resultTable));
  const validNumbers = new Set(rows.map(r => r.horse_number).filter(n => Number.isFinite(n)));
  const payouts = parsePayouts($, validNumbers);
  return { rows, payouts, $, isNotReady: isNotReadyText($('body').text()) };
}

module.exports = { U, isNotReadyText, pickResultTable, parseResultRows, parsePayouts, finalizeResultRows, parseRakutenResultHtml };
