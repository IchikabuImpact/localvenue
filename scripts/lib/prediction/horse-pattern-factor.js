'use strict';

const { norm } = require('./scoring');

const NAME = 'horsePattern';

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (value == null || value === '') return [];
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return value.split(',').map(v => v.trim()).filter(Boolean);
    }
  }
  return [];
}

function toNumberOrNull(value) {
  if (value == null || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function escapeCountExcludingSelf(rows, target) {
  return rows.filter(row => row.horse_number !== target.horse_number && row.running_style === '逃げ').length;
}

function frontRunnerCount(rows) {
  return rows.filter(row => row.running_style === '逃げ' || row.running_style === '先行').length;
}

function ruleMatches(rule, row, raceContext) {
  if (!rule || !row) return false;
  if (norm(rule.horse_name) !== norm(row.horse_name)) return false;

  const babaCode = toNumberOrNull(rule.baba_code);
  if (babaCode != null && babaCode !== Number(raceContext.babaCode)) return false;

  const minFrame = toNumberOrNull(rule.min_frame_number);
  if (minFrame != null && Number(row.frame_number) < minFrame) return false;

  const maxFrame = toNumberOrNull(rule.max_frame_number);
  if (maxFrame != null && Number(row.frame_number) > maxFrame) return false;

  const styles = asArray(rule.target_running_styles);
  if (styles.length && !styles.includes(row.running_style)) return false;

  const trackConditions = asArray(rule.target_track_conditions);
  if (trackConditions.length && !trackConditions.includes(raceContext.trackCondition)) return false;

  const rows = raceContext.racingFormRows || [];
  const maxOtherEscape = toNumberOrNull(rule.max_escape_count_excluding_self);
  if (maxOtherEscape != null && escapeCountExcludingSelf(rows, row) > maxOtherEscape) return false;

  const maxFront = toNumberOrNull(rule.max_front_runner_count);
  if (maxFront != null && frontRunnerCount(rows) > maxFront) return false;

  return true;
}

function buildHorsePatternScoringFactor(rules = []) {
  return {
    name: NAME,
    compute: ({ row, coreScore, raceContext }) => {
      const totalPct = (rules || []).reduce((sum, rule) => {
        if (!ruleMatches(rule, row, raceContext)) return sum;
        return sum + Math.max(0, Number(rule.bonus_pct) || 0);
      }, 0);
      return Math.round(coreScore * totalPct / 100);
    },
  };
}

module.exports = {
  NAME,
  asArray,
  escapeCountExcludingSelf,
  frontRunnerCount,
  ruleMatches,
  buildHorsePatternScoringFactor,
};
