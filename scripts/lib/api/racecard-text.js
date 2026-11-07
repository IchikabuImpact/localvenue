'use strict';

/**
 * 出馬表を、小さいローカルモデル（Gemma E2B、Qwen など）が読みやすい日本語の文章にする純粋関数。
 *
 * 方針:
 * - 表ではなく「項目名: 値」の行にする（列の位置関係を読み違えにくい）
 * - 1頭ごとに見出しを付け、同じ順番で同じ項目を並べる
 * - 冒頭に項目の意味を書く（斤量・脚質・上がり3F など）
 * - 値が無いときは空欄にせず「未発表」「データなし」と書く
 */

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

const USAGE = [
  '出馬表API（LAN内専用）',
  '',
  '出馬表を、小さいローカルモデルが読みやすい日本語の文章（text）にしてJSONで返します。',
  '',
  '使い方:',
  '  GET /racecard?date=YYYYMMDD&baba=馬場コード&race=レース番号',
  '  GET /racecard?date=YYYYMMDD                 その日の開催とレース番号の一覧',
  '',
  '引数:',
  '  date  開催日（例: 20261108）',
  '  baba  馬場コード（例: 20=大井）。競馬場名（例: 大井）でも可',
  '  race  レース番号（1〜12）',
  '  format  json（既定）または text（文章だけを text/plain で返す）',
  '',
  '例:',
  '  curl "http://<このPC>:8132/racecard?date=20261108&baba=32&race=11"',
  '  curl "http://<このPC>:8132/racecard?date=20261108&baba=32&race=11&format=text"',
  '  curl -G "http://<このPC>:8132/racecard" --data-urlencode "date=20261108" --data-urlencode "baba=佐賀" --data-urlencode "race=11"',
].join('\n');

const FIELD_GUIDE = [
  '## 項目の説明',
  '- 枠番: 1〜8。数字が小さいほど内側からスタートする',
  '- 馬番: 馬の番号。馬券はこの番号で買う',
  '- 性齢: 牡=オス、牝=メス、セン=去勢したオス。数字は年齢',
  '- 斤量: 馬が背負う重さ（kg）。重いほど不利',
  '- 騎手・調教師の（ ）: 所属。所属と違う競馬場で走るときは遠征',
  '- 馬体重: 当日の体重（kg）と、前走からの増減',
  '- 脚質: 過去のレースの位置取りから当サイトが推定したもの。逃げ=先頭で走る、先行=前の方、差し=中団から追い上げる、追込=後方から一気に追い上げる',
  '- 上がり3F: ゴール前600mのタイム（秒）。小さいほど最後の脚が速い',
  '- 近走: 当サイトのデータにある過去の成績（2026年5月以降）。新しい順',
].join('\n');

const orUnknown = (v, unknown = '未発表') => (v === null || v === undefined || v === '' ? unknown : String(v));

function formatDateJa(ymd) {
  const s = String(ymd);
  const y = Number(s.slice(0, 4));
  const m = Number(s.slice(4, 6));
  const d = Number(s.slice(6, 8));
  const wd = WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  return `${y}年${m}月${d}日（${wd}）`;
}

function formatShortDate(raceId) {
  const s = String(raceId);
  return `${s.slice(0, 4)}/${s.slice(4, 6)}/${s.slice(6, 8)}`;
}

/**
 * クエリを検証する。venues は [{ code, name }]。
 * @returns {{ ok: true, date, babaCode, raceNo } | { ok: false, error }}
 */
function parseRacecardQuery(query, venues) {
  const date = String(query.date ?? '').trim();
  const babaIn = String(query.baba ?? '').trim();
  const raceIn = String(query.race ?? '').trim();
  if (!/^\d{8}$/.test(date)) return { ok: false, error: 'date は YYYYMMDD の8桁で指定してください（例: 20261108）' };
  const y = Number(date.slice(0, 4)), m = Number(date.slice(4, 6)), d = Number(date.slice(6, 8));
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) {
    return { ok: false, error: `date=${date} は存在しない日付です` };
  }
  if (!babaIn && !raceIn) return { ok: true, date, babaCode: null, raceNo: null };

  let babaCode = null;
  if (/^\d{1,2}$/.test(babaIn)) babaCode = Number(babaIn);
  else {
    const v = venues.find((x) => x.name === babaIn);
    if (v) babaCode = v.code;
  }
  if (babaCode === null || !venues.some((v) => v.code === babaCode)) {
    return { ok: false, error: `baba=${babaIn || '(なし)'} は分かりません。馬場コード（数字）か競馬場名で指定してください` };
  }
  if (!/^\d{1,2}$/.test(raceIn) || Number(raceIn) < 1 || Number(raceIn) > 12) {
    return { ok: false, error: `race=${raceIn || '(なし)'} は 1〜12 で指定してください` };
  }
  return { ok: true, date, babaCode, raceNo: Number(raceIn) };
}

function buildRaceId(date, babaCode, raceNo) {
  return `${date}${String(raceNo).padStart(2, '0')}${String(babaCode).padStart(2, '0')}`;
}

function formatPerson(name, affiliation) {
  if (!name) return 'データなし';
  return affiliation ? `${name}（${affiliation}所属）` : name;
}

function formatWeight(w, diff) {
  if (w === null || w === undefined || w === '') return '未発表';
  if (diff === null || diff === undefined || diff === '') return `${w}kg`;
  const n = Number(diff);
  const sign = n > 0 ? '+' : n < 0 ? '' : '±';
  return `${w}kg（前走から ${sign}${n}kg）`;
}

function formatAgari(a1, a2) {
  if (!a1 && !a2) return 'データなし';
  return `前走 ${orUnknown(a1, 'データなし')}${a1 ? '秒' : ''} / 2走前 ${orUnknown(a2, 'データなし')}${a2 ? '秒' : ''}`;
}

function formatPastRun(p) {
  const pos = p.position === null || p.position === undefined ? '着順なし' : `${p.position}着`;
  const field = p.fieldSize ? `/${p.fieldSize}頭` : '';
  const odds = p.oddsFinal ? ` 単勝${p.oddsFinal}倍` : '';
  const dist = p.distance ? ` ${p.distance}m` : '';
  const tc = p.trackCondition ? ` 馬場${p.trackCondition}` : '';
  // 結果の騎手名は「多田誠 (高知)」の形で所属が付いていることがある
  const jk = p.jockey ? ` 騎手 ${String(p.jockey).replace(/\s*\(([^)]+)\)\s*$/, '（$1）')}` : '';
  return `  - ${formatShortDate(p.raceId)} ${p.venue}${p.raceNo}R ${p.title || ''}${dist}${tc} ${pos}${field}${odds}${jk}`.replace(/\s+/g, ' ').replace(/^ - /, '  - ');
}

/**
 * @param {{ raceId, date, babaCode, venue, raceNo, info, horses }} race
 *   info: { race_title, distance_m, track_condition, weather, race_start_time } | null
 *   horses: racing_form の行に trainerFullName / trainerCourse / pastRuns を足したもの
 */
function buildRacecardText(race) {
  const info = race.info || {};
  const lines = [];
  lines.push('# 出馬表');
  lines.push(`日付: ${formatDateJa(race.date)}`);
  lines.push(`競馬場: ${race.venue}（馬場コード${race.babaCode}）`);
  lines.push(`レース: ${race.raceNo}R ${orUnknown(info.race_title, '')}`.trim());
  lines.push(`距離: ${info.distance_m ? `${info.distance_m}m` : '未発表'}`);
  lines.push(`発走時刻: ${orUnknown(info.race_start_time)}`);
  lines.push(`馬場状態: ${orUnknown(info.track_condition)}`);
  lines.push(`天候: ${orUnknown(info.weather)}`);
  lines.push(`出走頭数: ${race.horses.length}頭`);
  lines.push('');
  lines.push(FIELD_GUIDE);
  lines.push('');
  lines.push('## 出走馬');
  for (const h of race.horses) {
    lines.push('');
    lines.push(`### ${h.horse_number}番 ${h.horse_name}`);
    lines.push(`- 枠番: ${orUnknown(h.frame_number)}枠`);
    lines.push(`- 性齢: ${orUnknown(h.sex_age, 'データなし')}${h.hair ? `（${h.hair}）` : ''}`);
    lines.push(`- 斤量: ${h.carried_weight ? `${h.carried_weight}kg` : '未発表'}`);
    lines.push(`- 騎手: ${formatPerson(h.jockey_name, h.affiliation)}`);
    const trainer = h.trainerFullName
      ? `${h.trainerFullName}（${h.trainerCourse || h.trainerAffiliation}所属、出馬表の表記は「${h.trainer_name}」）`
      : formatPerson(h.trainer_name, null);
    lines.push(`- 調教師: ${trainer}`);
    lines.push(`- 父: ${orUnknown(h.sire, 'データなし')}`);
    lines.push(`- 母: ${orUnknown(h.dam, 'データなし')}`);
    lines.push(`- 母の父: ${orUnknown(h.broodmare_sire, 'データなし')}`);
    lines.push(`- 馬体重: ${formatWeight(h.horse_weight, h.horse_weight_diff)}`);
    lines.push(`- 朝の単勝オッズ: ${h.odds_morning ? `${h.odds_morning}倍` : '未発表'}`);
    lines.push(`- 脚質: ${orUnknown(h.running_style, 'データなし')}`);
    lines.push(`- 上がり3F: ${formatAgari(h.agari_3f_1, h.agari_3f_2)}`);
    lines.push(`- 馬主: ${orUnknown(h.owner, 'データなし')}`);
    lines.push(`- 生産者: ${orUnknown(h.breeder, 'データなし')}`);
    if (h.remarks) lines.push(`- 備考: ${h.remarks}`);
    if (h.pastRuns && h.pastRuns.length) {
      lines.push('- 近走:');
      for (const p of h.pastRuns) lines.push(formatPastRun(p));
    } else {
      lines.push('- 近走: データなし');
    }
  }
  return lines.join('\n') + '\n';
}

function buildDayListText(date, races) {
  const lines = [`# ${formatDateJa(date)} の開催`];
  if (!races.length) {
    lines.push('この日の出馬表はありません');
    return lines.join('\n') + '\n';
  }
  const byVenue = new Map();
  for (const r of races) {
    const k = `${r.venue}（馬場コード${r.babaCode}）`;
    if (!byVenue.has(k)) byVenue.set(k, []);
    byVenue.get(k).push(`${r.raceNo}R${r.startTime ? ` ${r.startTime}` : ''}`);
  }
  for (const [k, list] of byVenue) lines.push(`- ${k}: ${list.join(', ')}`);
  return lines.join('\n') + '\n';
}

module.exports = {
  FIELD_GUIDE,
  USAGE,
  buildDayListText,
  buildRaceId,
  buildRacecardText,
  formatDateJa,
  parseRacecardQuery,
};
