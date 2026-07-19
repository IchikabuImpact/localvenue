'use strict';

const MODEL_VERSION = 'yosou-v1';
const LIMITED_SIRE_BONUS_END_YMD = '20260930';
const LIMITED_SIRE_BONUS_PCT = 10;
const LIMITED_BONUS_SIRES = ['ジョーカプチーノ', 'ガルボ'];
const LIMITED_BONUS_BROODMARE_SIRES = ['マンハッタンカフェ'];

const norm  = s => (s || '').replace(/\s+/g, ' ').replace(/[ 　\t]/g, '').trim();
const headN = (s, n) => Array.from(s || '').slice(0, n).join('');

// 全角英数字→半角変換
const toHalf = s => (s || '').replace(/[Ａ-Ｚａ-ｚ０-９]/g, c =>
  String.fromCharCode(c.charCodeAt(0) - 0xFEE0)
);

/**
 * レース名からクラスレベル(1〜5)を抽出する。
 * 重賞/特別=5, A/B1=4, B2/B3=3, C1/C2=2, C3/C4/新馬=1, 不明=null
 */
function parseRaceClassLevel(title) {
  if (!title) return null;
  const t = toHalf(title);
  if (/重賞|グランプリ|ダービー|オークス|Jpn[I1]|GI/.test(t)) return 5;
  if (/B1[^0-9]|B1$/.test(t))  return 4;
  if (/A[1-4]?/.test(t))        return 4;
  if (/B[23]/.test(t))          return 3;
  if (/C[12]/.test(t))          return 2;
  if (/C[34]/.test(t) || /新馬|未格付|2歳|3歳新/.test(t)) return 1;
  if (/\bA\b/.test(t))          return 4;
  if (/\bB\b/.test(t))          return 3;
  if (/\bC\b/.test(t))          return 2;
  return null;
}

/**
 * レースクラスレベルから JBIS未登録調教師のフォールバックスコアを計算する。
 * 「クラスレベル -1 段階」として扱う（上位クラスでも未登録=一段落ちる）。
 *   Lv5→60, Lv4→40, Lv3→20, Lv2→10, Lv1/不明→10
 */
function trainerFallbackScore(raceClassLevel) {
  const SCORES = { 5: 60, 4: 40, 3: 20, 2: 10, 1: 10 };
  const level = Math.max(1, (raceClassLevel || 2) - 1);
  return SCORES[level] ?? 10;
}

/**
 * クラス別の調教師スコア乗数を返す。
 * 上位クラス（重賞/A/B1）は評価そのまま。
 * 下級クラスほど調教師のJBISランキングと実際の勝率の相関が薄れるため抑える。
 *   Lv5/4 → 1.0（そのまま）
 *   Lv3   → 0.8（B2/B3）
 *   Lv2   → 0.6（C1/C2）
 *   Lv1   → 0.4（C3/C4/新馬）
 *   不明  → 0.7
 */
function trainerClassMultiplier(raceClassLevel) {
  const TABLE = { 5: 1.0, 4: 1.0, 3: 0.8, 2: 0.6, 1: 0.4 };
  return TABLE[raceClassLevel] ?? 0.7;
}

function customScore(horse) {
  let bonus = 0;
  if (horse.horse_number % 2 === 0) bonus += horse.horse_number;
  const m = (horse.sex_age || '').match(/(\d+)/);
  if (m) {
    const age = parseInt(m[1], 10);
    if (age === 2) bonus += 40;
    else if (age === 3) bonus += 30;
    else if (age === 4) bonus += 20;
  }
  return bonus >>> 0;
}

function isSummerBodyWeightMonth(raceId) {
  const month = Number(String(raceId || '').slice(4, 6));
  return month >= 7 && month <= 9;
}

function summerBodyWeightMultiplier({ raceId, sexAge, horseWeightDiff }) {
  if (!isSummerBodyWeightMonth(raceId)) return 1;
  if (horseWeightDiff == null || horseWeightDiff === '') return 1;

  const diff = Number(horseWeightDiff);
  if (!Number.isFinite(diff)) return 1;

  const sex = String(sexAge || '').trim().charAt(0);
  if (sex === '牝') {
    const age = Number((String(sexAge || '').match(/(\d+)/) || [])[1]);
    const positiveUpper = age >= 2 && age <= 4 ? 15 : 7;
    if (diff >= 5 && diff <= positiveUpper) return 1.05;
    if (diff <= -7) return 0.95;
  }

  if (sex === '牡' && diff <= -10) return 0.95;
  return 1;
}

function buildPrefixMaxScore(rows, nameKey) {
  const prefixMax = new Map();
  for (const r of rows) {
    const key = headN(norm(r[nameKey]), 3);
    // >>> 0 は負の数を巨大な正整数に変換するバグがあるため Math.max を使う
    const val = Math.max(0, Number(r.score) || 0);
    const cur = prefixMax.get(key) || 0;
    if (val > cur) prefixMax.set(key, val);
  }
  return prefixMax;
}

function buildSireRows(rows) {
  return rows
    .map(r => ({ sire_name: norm(r.sire_name), score: Math.max(0, Number(r.score) || 0) }))
    .filter(r => r.sire_name.length > 0)
    .sort((a, b) => b.sire_name.length - a.sire_name.length);
}

function findSireScore(sireRows, sireText) {
  const S = norm(sireText);
  if (!S) return 0;
  for (const r of sireRows) {
    const R = r.sire_name;
    if (S.startsWith(R) || R.startsWith(S)) return r.score;
  }
  return 0;
}

function isLimitedSireBonusActive(raceId) {
  const ymd = String(raceId || '').slice(0, 8);
  return /^\d{8}$/.test(ymd) && ymd <= LIMITED_SIRE_BONUS_END_YMD;
}

function matchesLimitedBonusSire(sireText) {
  const sire = norm(sireText);
  if (!sire) return false;
  return LIMITED_BONUS_SIRES.some(target => {
    const normalizedTarget = norm(target);
    return sire.startsWith(normalizedTarget) || normalizedTarget.startsWith(sire);
  });
}

function matchesLimitedBonusBroodmareSire(broodmareSireText) {
  const broodmareSire = norm(broodmareSireText);
  if (!broodmareSire) return false;
  return LIMITED_BONUS_BROODMARE_SIRES.some(target => {
    const normalizedTarget = norm(target);
    return broodmareSire.startsWith(normalizedTarget) || normalizedTarget.startsWith(broodmareSire);
  });
}

function limitedSireBonus(coreScore, raceId, sireText) {
  // 夏場に強い血統として、9月末まで父ジョーカプチーノ/ガルボを10%加点する。
  if (!isLimitedSireBonusActive(raceId)) return 0;
  if (!matchesLimitedBonusSire(sireText)) return 0;
  return Math.round(coreScore * LIMITED_SIRE_BONUS_PCT / 100);
}

function limitedBroodmareSireBonus(coreScore, raceId, broodmareSireText) {
  // 夏場に強い血統として、9月末まで母父マンハッタンカフェを10%加点する。
  if (!isLimitedSireBonusActive(raceId)) return 0;
  if (!matchesLimitedBonusBroodmareSire(broodmareSireText)) return 0;
  return Math.round(coreScore * LIMITED_SIRE_BONUS_PCT / 100);
}

/**
 * satellites: プラグイン型サテライトファクターの配列。
 * 各要素は { name: string, bonuses: Map<horse_number, number> }。
 * calculatePrediction はコアスコアにボーナスを加算するだけで、
 * ファクターのロジック自体は各satellites/**ファイルに閉じている。
 */
function calculatePrediction({
  raceId,
  racingFormRows,
  jockeyRows,
  trainerRows,
  sireRows,
  weather       = null,
  trackCondition = null,
  raceTitle     = null,
  satellites    = [],
  generatedAt   = new Date().toISOString(),
}) {
  const jrPrefixMax = buildPrefixMaxScore(jockeyRows, 'jockey_name');
  const trPrefixMax = buildPrefixMaxScore(trainerRows, 'trainer_name');
  const normalizedSireRows = buildSireRows(sireRows);

  // レースクラスから調教師スコア補正値を計算
  const classLevel  = parseRaceClassLevel(raceTitle);
  const trFallback  = trainerFallbackScore(classLevel);
  const trMultiplier = trainerClassMultiplier(classLevel);

  const calc = racingFormRows.map(row => {
    const jScore = jrPrefixMax.get(headN(norm(row.jockey),  3)) || 0;
    const tJbis  = trPrefixMax.get(headN(norm(row.trainer), 3)) || 0;
    // JBIS登録あり→そのスコア、未登録→クラスフォールバック。その後クラス乗数を適用
    const tRaw   = tJbis > 0 ? tJbis : trFallback;
    const tScore = Math.round(tRaw * trMultiplier);
    const sScore = findSireScore(normalizedSireRows, row.sire) || 0;
    const cScore = customScore({ horse_number: row.horse_number, sex_age: row.sex_age });
    const coreScore = jScore + tScore + sScore + cScore;
    const summerSireBonus = limitedSireBonus(coreScore, raceId, row.sire);
    const summerBroodmareSireBonus = limitedBroodmareSireBonus(coreScore, raceId, row.broodmare_sire);
    let satelliteBonus = summerSireBonus + summerBroodmareSireBonus;
    const satelliteBreakdown = {};
    satelliteBreakdown.summerSire = summerSireBonus;
    satelliteBreakdown.summerBroodmareSire = summerBroodmareSireBonus;
    for (const s of satellites) {
      const raw = s.bonuses.get(row.horse_number) || 0;
      const bonus = s.capPct != null
        ? Math.min(raw, Math.round(coreScore * s.capPct / 100))
        : raw;
      satelliteBonus += bonus;
      satelliteBreakdown[s.name] = bonus;
    }
    let total = (coreScore + satelliteBonus) >>> 0;
    if (total === 0) total += row.horse_number;
    const bodyweightMultiplier = summerBodyWeightMultiplier({
      raceId,
      sexAge: row.sex_age,
      horseWeightDiff: row.horse_weight_diff,
    });
    const totalBeforeBodyweight = total;
    total = Math.max(0, Math.round(total * bodyweightMultiplier));
    return {
      horse_number: row.horse_number,
      horse_name:   row.horse_name,
      score: total,
      breakdown: {
        jockey: jScore, trainer: tScore,
        trainerJbis: tJbis, trainerMultiplier: trMultiplier,
        sire: sScore, custom: cScore,
        ...satelliteBreakdown,
        bodyweightMultiplier,
        bodyweightAdjustment: total - totalBeforeBodyweight,
        horseWeightDiff: row.horse_weight_diff ?? null,
      },
    };
  });

  calc.sort((a, b) => b.score - a.score || a.horse_number - b.horse_number);
  const best = calc[0];

  return {
    model: MODEL_VERSION,
    race_id: raceId,
    items: calc,
    best,
    weather,
    trackCondition,
    raceClass: classLevel,
    generatedAt,
  };
}

module.exports = {
  MODEL_VERSION,
  norm,
  headN,
  toHalf,
  parseRaceClassLevel,
  trainerFallbackScore,
  trainerClassMultiplier,
  customScore,
  isSummerBodyWeightMonth,
  summerBodyWeightMultiplier,
  buildPrefixMaxScore,
  buildSireRows,
  findSireScore,
  isLimitedSireBonusActive,
  matchesLimitedBonusSire,
  matchesLimitedBonusBroodmareSire,
  limitedSireBonus,
  limitedBroodmareSireBonus,
  calculatePrediction,
};
