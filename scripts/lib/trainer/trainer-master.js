'use strict';

/**
 * 調教師マスター（trainer_master）と、出馬表の略称との対応（trainer_alias）を作るための純粋関数。
 *
 * 出馬表の調教師名は「入口由」「佐々国」「櫻田樹」のような3文字前後の略称で、
 * JBIS のフルネーム（入口 由美子 / 佐々木 国明 / 櫻田 浩樹）から、姓を縮めて名の文字を足した形になっている。
 * そこで「略称の文字が、同じ順番でフルネームに含まれているか」で候補を探し、
 * 出走している競馬場と所属競馬場が合う人に絞り込む。
 */

// JBIS の所属表記 → 所属競馬場。大井の調教師は小林トレセン、兵庫の一部は西脇に厩舎がある
const COURSE_OF_AFFILIATION = {
  小林: '大井',
  西脇: '園田',
};

// race_id 末尾2桁（baba_code）→ その競馬場で走る調教師の所属競馬場の候補
const VENUE_COURSES = {
  10: ['盛岡', '水沢'],
  11: ['盛岡', '水沢'],
  18: ['浦和'],
  19: ['船橋'],
  20: ['大井'],
  21: ['川崎'],
  22: ['金沢'],
  23: ['笠松'],
  24: ['名古屋'],
  27: ['園田'],
  28: ['園田'],
  31: ['高知'],
  32: ['佐賀'],
  36: ['北海道'],
};

const normalizeName = (s) => String(s || '').replace(/[\s　]+/g, '');

function courseOfAffiliation(affiliation) {
  return COURSE_OF_AFFILIATION[affiliation] || affiliation || null;
}

// 略称の1文字目が同じで、残りの文字も同じ順番でフルネームに含まれているか
function isSubsequenceName(shortName, fullName) {
  const s = normalizeName(shortName);
  const f = normalizeName(fullName);
  if (!s || !f || s[0] !== f[0]) return false;
  let i = 0;
  for (const ch of f) {
    if (ch === s[i]) i += 1;
    if (i === s.length) return true;
  }
  return false;
}

function methodOf(shortName, fullName) {
  const s = normalizeName(shortName);
  const f = normalizeName(fullName);
  if (s === f) return 'exact';
  if (f.startsWith(s)) return 'prefix';
  return 'subsequence';
}

/**
 * 候補を絞り込む。
 * 1. 一番多く走っている競馬場の所属 → 走ったことのある競馬場の所属 → 中央、の順で候補を残す
 * 2. 完全一致が1人なら決定、前方一致が1人なら決定
 * 3. ほかの略称で決まった人（claimed）を候補から外す
 */
function narrowCandidates(shortName, venueCounts, masters, claimed = new Set()) {
  const venues = Object.entries(venueCounts || {}).sort((a, b) => b[1] - a[1]).map(([bb]) => String(Number(bb)));
  const homeCourses = new Set(VENUE_COURSES[venues[0]] || []);
  const anyCourses = new Set(venues.flatMap((bb) => VENUE_COURSES[bb] || []));

  const all = masters.filter((m) => isSubsequenceName(shortName, m.fullName));
  const byHome = all.filter((m) => homeCourses.has(m.course));
  const byAny = all.filter((m) => anyCourses.has(m.course));
  const byCentral = all.filter((m) => m.affiliation === '中央');
  let pool = byHome.length ? byHome : byAny.length ? byAny : byCentral;

  const unclaimed = pool.filter((m) => !claimed.has(m.trainerId));
  if (unclaimed.length && unclaimed.length < pool.length) pool = unclaimed;

  const s = normalizeName(shortName);
  const exact = pool.filter((m) => normalizeName(m.fullName) === s);
  if (exact.length === 1) return exact;
  const prefix = pool.filter((m) => normalizeName(m.fullName).startsWith(s));
  if (prefix.length === 1) return prefix;
  return pool;
}

/**
 * @param {{ masters: Array<{trainerId:number, fullName:string, affiliation:string, course:string}>,
 *           shortNames: Array<{shortName:string, venueCounts:Object<string,number>, starts?:number}>,
 *           skip?: Set<string> }} args  skip は手動で決めた略称（自動では作らない）
 * @returns {{ aliases: Array<{shortName, trainerId, course, matchMethod}>, unresolved: Array<{shortName, starts, candidates}> }}
 */
function matchAliases({ masters, shortNames, skip = new Set() }) {
  const targets = shortNames.filter((t) => !skip.has(t.shortName)).flatMap(splitByCourseGroup);
  const decided = new Map();
  const claimed = new Set();

  // 1人に決まったものから確定し、確定した人を外してもう一度試す（加藤義→加藤和義 が決まれば 加藤和→加藤和宏）
  for (let pass = 0; pass < 5; pass += 1) {
    let progressed = false;
    for (const t of targets) {
      if (decided.has(t.key)) continue;
      const c = narrowCandidates(t.shortName, t.venueCounts, masters, claimed);
      if (c.length === 1) {
        decided.set(t.key, c[0]);
        claimed.add(c[0].trainerId);
        progressed = true;
      }
    }
    if (!progressed) break;
  }

  const aliases = [];
  const unresolved = [];
  const seen = new Set();
  for (const t of targets) {
    const m = decided.get(t.key);
    if (m) {
      const k = `${t.shortName}/${m.trainerId}`;
      if (seen.has(k)) continue;
      seen.add(k);
      aliases.push({ shortName: t.shortName, trainerId: m.trainerId, course: m.course, matchMethod: methodOf(t.shortName, m.fullName) });
    } else {
      const c = narrowCandidates(t.shortName, t.venueCounts, masters, claimed);
      unresolved.push({ shortName: t.shortName, venues: Object.keys(t.venueCounts), starts: t.starts ?? null, candidates: c.map((x) => `${x.fullName}(${x.affiliation})`) });
    }
  }
  return { aliases, unresolved };
}

// 同じ略称が別の競馬場の別人を指すことがある（佐藤祐: 水沢と川崎）。
// 出走の多い競馬場のまとまり（岩手・南関の各場など）ごとに分けて判定する。
// 2つ目以降のまとまりは、全体の30%以上走っているときだけ別に判定する（遠征先で似た名前の別人に結び付けないため）。
// それより少ない出走は、一番多いまとまりに含める
function splitByCourseGroup(target) {
  const entries = Object.entries(target.venueCounts || {});
  const total = entries.reduce((s, [, n]) => s + n, 0);
  const groups = new Map();
  for (const [bb, n] of entries) {
    const g = (VENUE_COURSES[String(Number(bb))] || [String(bb)]).join('・');
    if (!groups.has(g)) groups.set(g, { venueCounts: {}, starts: 0 });
    const x = groups.get(g);
    x.venueCounts[bb] = n;
    x.starts += n;
  }
  const sorted = [...groups.entries()].sort((a, b) => b[1].starts - a[1].starts);
  if (!sorted.length) return [{ ...target, key: target.shortName }];
  const major = sorted.filter(([, x], i) => i === 0 || x.starts >= total * 0.3);
  if (major.length === 1) return [{ ...target, key: target.shortName }];
  // 少ない出走は一番多いまとまりに寄せる
  const minor = sorted.filter((g) => !major.includes(g));
  for (const [, x] of minor) Object.assign(major[0][1].venueCounts, x.venueCounts);
  return major.map(([g, x]) => ({ shortName: target.shortName, venueCounts: x.venueCounts, starts: x.starts, key: `${target.shortName}@${g}` }));
}

module.exports = {
  COURSE_OF_AFFILIATION,
  VENUE_COURSES,
  courseOfAffiliation,
  isSubsequenceName,
  matchAliases,
  methodOf,
  narrowCandidates,
  normalizeName,
};
