'use strict';

const MODEL_VERSION = 'yosou-v1';

const norm = s => (s || '').replace(/\s+/g, ' ').replace(/[ 　\t]/g, '').trim();
const headN = (s, n) => Array.from(s || '').slice(0, n).join('');

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

function buildPrefixMaxScore(rows, nameKey) {
  const prefixMax = new Map();
  for (const r of rows) {
    const key = headN(norm(r[nameKey]), 3);
    const val = r.score >>> 0;
    const cur = prefixMax.get(key) || 0;
    if (val > cur) prefixMax.set(key, val);
  }
  return prefixMax;
}

function buildSireRows(rows) {
  return rows
    .map(r => ({ sire_name: norm(r.sire_name), score: r.score >>> 0 }))
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

function calculatePrediction({
  raceId,
  racingFormRows,
  jockeyRows,
  trainerRows,
  sireRows,
  weather = null,
  trackCondition = null,
  generatedAt = new Date().toISOString(),
}) {
  const jrPrefixMax = buildPrefixMaxScore(jockeyRows, 'jockey_name');
  const trPrefixMax = buildPrefixMaxScore(trainerRows, 'trainer_name');
  const normalizedSireRows = buildSireRows(sireRows);

  const calc = racingFormRows.map(row => {
    const jScore = jrPrefixMax.get(headN(norm(row.jockey), 3)) || 0;
    const tScore = trPrefixMax.get(headN(norm(row.trainer), 3)) || 0;
    const sScore = findSireScore(normalizedSireRows, row.sire) || 0;
    const cScore = customScore({ horse_number: row.horse_number, sex_age: row.sex_age });
    let total = (jScore + tScore + sScore + cScore) >>> 0;
    if (total === 0) total += row.horse_number;
    return {
      horse_number: row.horse_number,
      horse_name: row.horse_name,
      score: total,
      breakdown: { jockey: jScore, trainer: tScore, sire: sScore, custom: cScore },
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
    generatedAt,
  };
}

module.exports = {
  MODEL_VERSION,
  norm,
  headN,
  customScore,
  buildPrefixMaxScore,
  buildSireRows,
  findSireScore,
  calculatePrediction,
};
