#!/usr/bin/env node
'use strict';

const { spawnSync } = require('child_process');
const path = require('path');
const config = require('../../config/config.js');
const { createPool } = require('../lib/db/pool-factory');
const { jstTodayYmd } = require('../lib/shared/date-utils');
const { MySqlPredictionRepository } = require('../lib/prediction/mysql-prediction-repository');
const { MySqlRacingFormRepository } = require('../lib/racing-form/mysql-racing-form-repository');
const { MySqlRankingRepository } = require('../lib/prediction/mysql-ranking-repository');
const { PredictRaceUseCase } = require('../lib/prediction/predict-race-use-case');
const { loadScoringConfig } = require('../lib/prediction/scoring-config-loader');
const { collectDailyHealth, healthFailures } = require('../lib/ops/daily-health');

function hasFlag(name) {
  return process.argv.includes(name);
}

function argValue(name, fallback = null) {
  const idx = process.argv.indexOf(name);
  return idx >= 0 ? process.argv[idx + 1] : fallback;
}

async function ensureHorsePatternSchema(pool) {
  await pool.execute(`CREATE TABLE IF NOT EXISTS horse_win_pattern_rules (
    rule_id bigint NOT NULL AUTO_INCREMENT,
    rule_code varchar(64) NOT NULL,
    rule_name varchar(128) NOT NULL,
    horse_name varchar(64) NOT NULL,
    pattern_type varchar(32) DEFAULT NULL COMMENT '例: TYPE S',
    baba_code tinyint DEFAULT NULL COMMENT 'NAR競馬場コード。高知=31',
    min_frame_number tinyint DEFAULT NULL,
    max_frame_number tinyint DEFAULT NULL,
    target_running_styles json DEFAULT NULL COMMENT '例: ["逃げ","先行"]',
    max_escape_count_excluding_self tinyint DEFAULT NULL COMMENT '自馬以外の逃げ馬上限',
    max_front_runner_count tinyint DEFAULT NULL COMMENT '逃げ+先行の頭数上限',
    bonus_pct decimal(5,2) NOT NULL DEFAULT '0.00',
    enabled tinyint(1) NOT NULL DEFAULT '1',
    active_from_ymd char(8) DEFAULT NULL,
    active_to_ymd char(8) DEFAULT NULL,
    notes varchar(255) DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (rule_id),
    UNIQUE KEY uq_horse_win_pattern_rule_code (rule_code),
    KEY idx_horse_win_pattern_lookup (enabled,baba_code,horse_name),
    KEY idx_horse_win_pattern_active (enabled,active_from_ymd,active_to_ymd)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    COMMENT='1頭ごとの勝ちパターン加点ルール'`);

  await pool.execute(`
    INSERT INTO horse_win_pattern_rules
      (rule_code, rule_name, horse_name, pattern_type, baba_code,
       min_frame_number, max_frame_number, target_running_styles,
       max_escape_count_excluding_self, max_front_runner_count, bonus_pct, enabled, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, JSON_ARRAY(?, ?), ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      rule_name = VALUES(rule_name),
      horse_name = VALUES(horse_name),
      pattern_type = VALUES(pattern_type),
      baba_code = VALUES(baba_code),
      min_frame_number = VALUES(min_frame_number),
      max_frame_number = VALUES(max_frame_number),
      target_running_styles = VALUES(target_running_styles),
      max_escape_count_excluding_self = VALUES(max_escape_count_excluding_self),
      max_front_runner_count = VALUES(max_front_runner_count),
      bonus_pct = VALUES(bonus_pct),
      enabled = VALUES(enabled),
      notes = VALUES(notes)
  `, [
    'shishi_kochi_inner_type_s',
    'シシ 高知内枠TYPE S',
    'シシ',
    'TYPE S',
    31,
    1,
    4,
    '逃げ',
    '先行',
    0,
    3,
    10.00,
    1,
    '気持ちで走る持続力タイプ。内枠で集中でき、他に逃げ馬がいない消耗戦を加点',
  ]);
}

async function loadRaceIds(pool, ymd) {
  const [rows] = await pool.execute(`
    SELECT base.race_id
      FROM (
        SELECT CAST(race_id AS CHAR) race_id
          FROM racing_form
         WHERE LEFT(CAST(race_id AS CHAR), 8) = ?
         GROUP BY race_id
        UNION
        SELECT CAST(race_id AS CHAR) race_id
          FROM race_info
         WHERE LEFT(CAST(race_id AS CHAR), 8) = ?
      ) base
     ORDER BY base.race_id
  `, [ymd, ymd]);
  return rows.map(row => row.race_id);
}

async function overwritePredictions(pool, ymd) {
  const raceIds = await loadRaceIds(pool, ymd);
  const scoringConfigResult = loadScoringConfig({ configPath: config.scoringConfigPath || null });
  for (const raceId of raceIds) {
    const useCase = new PredictRaceUseCase({
      predictionRepository: new MySqlPredictionRepository({ pool }),
      racingFormRepository: new MySqlRacingFormRepository({ pool }),
      rankingRepository: new MySqlRankingRepository({ pool }),
      logger: console,
      debug: true,
      scoringConfig: scoringConfigResult.config,
      now: () => new Date(),
    });
    await useCase.execute({ raceId, year: Number(ymd.slice(0, 4)) });
  }
  return raceIds.length;
}

function runNode(script, args) {
  const result = spawnSync(process.execPath, [script, ...args], {
    cwd: path.resolve(__dirname, '../..'),
    stdio: 'inherit',
  });
  if (result.status !== 0) throw new Error(`${script} exited with ${result.status}`);
}

(async () => {
  const ymd = argValue('--date', process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : jstTodayYmd());
  const runResult = hasFlag('--result');
  const pool = createPool(config.mysql);
  try {
    await ensureHorsePatternSchema(pool);
    const predictionCount = await overwritePredictions(pool, ymd);
    console.log(`[RECOVER] predictions overwritten: ${predictionCount}`);
  } finally {
    await pool.end().catch(() => {});
  }

  if (runResult) {
    runNode('scripts/daily-result-batch.js', [ymd]);
  } else {
    runNode('scripts/generate-daily-pages.js', [ymd]);
  }

  const verifyPool = createPool(config.mysql);
  try {
    const report = await collectDailyHealth({
      pool: verifyPool,
      ymd,
      publicDir: path.resolve(__dirname, '../../public'),
    });
    const failures = healthFailures(report);
    console.log(JSON.stringify({ ok: failures.length === 0, failures, report }, null, 2));
    if (failures.length) process.exit(1);
  } finally {
    await verifyPool.end().catch(() => {});
  }
})().catch(e => {
  console.error('[FATAL]', e && e.message ? e.message : e);
  process.exit(1);
});
