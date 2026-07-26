'use strict';

const fs = require('fs');
const path = require('path');

function normalizeYmd(ymd) {
  const s = String(ymd || '').trim();
  if (!/^\d{8}$/.test(s)) throw new Error(`YYYYMMDD required: ${ymd}`);
  return s;
}

async function countRows(pool, sql, params) {
  const [rows] = await pool.execute(sql, params);
  return Number(rows[0]?.c || 0);
}

async function tableExists(pool, tableName) {
  const [rows] = await pool.query(`SHOW TABLES LIKE '${tableName.replace(/'/g, "''")}'`);
  return rows.length > 0;
}

async function collectDailyHealth({ pool, ymd, publicDir }) {
  const day = normalizeYmd(ymd);
  const htmlTop = countHtmlFiles(publicDir, day);
  const htmlDaily = countHtmlFiles(path.join(publicDir, 'daily', day), day);
  const noPredictionFiles = findNoPredictionFiles(publicDir, day);
  const hasHorsePatternRules = await tableExists(pool, 'horse_win_pattern_rules');

  const races = await countRows(pool, `
    SELECT COUNT(*) AS c
      FROM (
        SELECT CAST(race_id AS CHAR) race_id
          FROM racing_form
         WHERE LEFT(CAST(race_id AS CHAR), 8) = ?
         GROUP BY race_id
        UNION
        SELECT CAST(race_id AS CHAR) race_id
          FROM race_info
         WHERE LEFT(CAST(race_id AS CHAR), 8) = ?
      ) x
  `, [day, day]);

  const predictions = await countRows(pool, `
    SELECT COUNT(*) AS c
      FROM prediction
     WHERE LEFT(CAST(race_id AS CHAR), 8) = ?
       AND model_version = 'yosou-v1'
  `, [day]);

  const evaluations = await countRows(pool, `
    SELECT COUNT(*) AS c
      FROM prediction_eval
     WHERE LEFT(CAST(race_id AS CHAR), 8) = ?
       AND model_version = 'yosou-v1'
  `, [day]);

  return {
    ymd: day,
    races,
    predictions,
    evaluations,
    htmlTop,
    htmlDaily,
    noPredictionFiles,
    hasHorsePatternRules,
  };
}

function countHtmlFiles(dir, ymd) {
  if (!fs.existsSync(dir)) return 0;
  const re = new RegExp(`^${ymd}\\d{4}\\.html$`);
  return fs.readdirSync(dir).filter(file => re.test(file)).length;
}

function findNoPredictionFiles(publicDir, ymd) {
  const paths = [
    path.join(publicDir, 'index.html'),
    path.join(publicDir, 'daily', ymd, 'index.html'),
  ];
  const raceFiles = listRaceHtmlFiles(publicDir, ymd)
    .concat(listRaceHtmlFiles(path.join(publicDir, 'daily', ymd), ymd));
  paths.push(...raceFiles);

  return paths
    .filter(file => fs.existsSync(file))
    .filter(file => /予想なし|◎\s*-/.test(fs.readFileSync(file, 'utf8')))
    .map(file => path.relative(publicDir, file));
}

function listRaceHtmlFiles(dir, ymd) {
  if (!fs.existsSync(dir)) return [];
  const re = new RegExp(`^${ymd}\\d{4}\\.html$`);
  return fs.readdirSync(dir)
    .filter(file => re.test(file))
    .map(file => path.join(dir, file));
}

function healthFailures(report) {
  const failures = [];
  if (!report.hasHorsePatternRules) failures.push('horse_win_pattern_rules table missing');
  if (report.races > 0 && report.predictions !== report.races) {
    failures.push(`prediction count mismatch: races=${report.races} predictions=${report.predictions}`);
  }
  if (report.races > 0 && report.htmlTop !== report.races) {
    failures.push(`public html count mismatch: races=${report.races} html=${report.htmlTop}`);
  }
  if (report.races > 0 && report.htmlDaily !== report.races) {
    failures.push(`daily html count mismatch: races=${report.races} html=${report.htmlDaily}`);
  }
  if (report.noPredictionFiles.length > 0) {
    failures.push(`no-prediction marker found: ${report.noPredictionFiles.join(', ')}`);
  }
  return failures;
}

module.exports = {
  normalizeYmd,
  collectDailyHealth,
  countHtmlFiles,
  findNoPredictionFiles,
  healthFailures,
};
