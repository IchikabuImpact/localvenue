'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { DEFAULT_SCORING_CONFIG } = require('./scoring');

const PROJECT_ROOT = path.resolve(__dirname, '../../..');
const DEFAULT_SCORING_CONFIG_PATH = path.join(PROJECT_ROOT, 'config/scoring/default.json');

function isPlainObject(value) {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

function deepMerge(base, override) {
  if (!isPlainObject(base)) return cloneJson(override);
  if (!isPlainObject(override)) return cloneJson(base);

  const merged = { ...base };
  for (const [key, value] of Object.entries(override)) {
    merged[key] = isPlainObject(value) && isPlainObject(base[key])
      ? deepMerge(base[key], value)
      : cloneJson(value);
  }
  return merged;
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function resolveScoringConfigPath(configPath, { env = process.env, projectRoot = PROJECT_ROOT } = {}) {
  const selected = configPath || env.SCORING_CONFIG_PATH || DEFAULT_SCORING_CONFIG_PATH;
  return path.isAbsolute(selected) ? selected : path.resolve(projectRoot, selected);
}

function validateBloodRules(config, fieldPath) {
  const value = fieldPath.split('.').reduce((cur, key) => cur?.[key], config);
  if (value == null) return;
  if (!Array.isArray(value)) throw new Error(`${fieldPath} must be an array`);
  for (const [index, rule] of value.entries()) {
    if (!isPlainObject(rule)) throw new Error(`${fieldPath}[${index}] must be an object`);
    if (typeof rule.name !== 'string' || rule.name.trim() === '') {
      throw new Error(`${fieldPath}[${index}].name must be a non-empty string`);
    }
    if (!Number.isFinite(Number(rule.pct))) {
      throw new Error(`${fieldPath}[${index}].pct must be numeric`);
    }
  }
}

function validateScoringConfig(config) {
  if (!isPlainObject(config)) throw new Error('scoring config must be an object');
  if (!isPlainObject(config.summerBonus)) throw new Error('summerBonus must be an object');
  for (const key of ['startYmd', 'endYmd']) {
    if (!/^\d{8}$/.test(String(config.summerBonus[key] || ''))) {
      throw new Error(`summerBonus.${key} must be YYYYMMDD`);
    }
  }
  for (const key of ['fastTrackConditions', 'wetTrackConditions']) {
    if (!Array.isArray(config.summerBonus[key])) {
      throw new Error(`summerBonus.${key} must be an array`);
    }
  }
  for (const field of [
    'summerBonus.fastTrackSireRules',
    'summerBonus.fastTrackBroodmareSireRules',
    'summerBonus.wetTrackSireRules',
    'summerBonus.wetTrackBroodmareSireRules',
    'summerBonus.damFamilyRules',
  ]) {
    validateBloodRules(config, field);
  }
  if (config.summerBonus.weightAllowance != null && !isPlainObject(config.summerBonus.weightAllowance)) {
    throw new Error('summerBonus.weightAllowance must be an object');
  }
}

function loadScoringConfig({ configPath = null, env = process.env, projectRoot = PROJECT_ROOT } = {}) {
  const resolvedPath = resolveScoringConfigPath(configPath, { env, projectRoot });
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));
  } catch (err) {
    throw new Error(`scoring config load failed: ${resolvedPath}: ${err.message}`);
  }

  const merged = deepMerge(DEFAULT_SCORING_CONFIG, parsed);
  validateScoringConfig(merged);
  return { config: merged, path: resolvedPath };
}

module.exports = {
  PROJECT_ROOT,
  DEFAULT_SCORING_CONFIG_PATH,
  deepMerge,
  resolveScoringConfigPath,
  validateScoringConfig,
  loadScoringConfig,
};
