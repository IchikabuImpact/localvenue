#!/usr/bin/env node
/**
 * @copyright © 2026 IchikabuImpact
 * @license Commercial use prohibited without permission.
 */

// daily-result-batch.js
//
// Usage:
//   node daily-result-batch.js 20260119
//
// 1) 当日レース一覧を取得
// 2) save-result-db.js で結果保存
// 3) eval-prediction.js で予想評価
// 4) eval-roi.js で日次ROI集計

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const NODE_BIN = process.env.NODE_BIN || 'node';
const PARALLEL = Math.max(1, Number(process.env.PARALLEL || 2));
const STAKE_WIN = Number(process.env.STAKE_WIN || 0);
const STAKE_PLACE = Number(process.env.STAKE_PLACE || 0);

const BASE = __dirname;

const SCRIPTS = {
  listRaceIds: path.join(BASE, '003-list-race-ids.js'),
  saveResult: path.join(BASE, 'save-result-db.js'),
  evalPrediction: path.join(BASE, 'eval-prediction.js'),
  evalRoi: path.join(BASE, 'eval-roi.js'),
};

const ts = () => {
  const d = new Date();
  const pad = (n, z = 2) => String(n).padStart(z, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

const log = (m) => console.log(`[${ts()}] ${m}`);

const exists = (p) => {
  try {
    fs.accessSync(p, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
};

function runNodeWithCode(absScript, args = []) {
  return new Promise((resolve, reject) => {
    if (!exists(absScript)) {
      return reject(new Error(`not found: ${absScript}`));
    }
    const p = spawn(NODE_BIN, [absScript, ...args], {
      stdio: 'inherit',
      cwd: BASE,
    });
    p.on('exit', (code) => resolve(code ?? 1));
    p.on('error', reject);
  });
}

function runNode(absScript, args = [], okCodes = [0]) {
  return runNodeWithCode(absScript, args).then((code) => {
    if (okCodes.includes(code)) return;
    throw new Error(`${path.basename(absScript)} exited with ${code}`);
  });
}

function runCaptureNode(absScript, args = []) {
  return new Promise((resolve, reject) => {
    if (!exists(absScript)) {
      return reject(new Error(`not found: ${absScript}`));
    }
    const p = spawn(NODE_BIN, [absScript, ...args], {
      stdio: ['ignore', 'pipe', 'inherit'],
      cwd: BASE,
    });
    let out = '';
    p.stdout.on('data', (b) => (out += b.toString()));
    p.on('exit', (c) => {
      if (c === 0) return resolve(out);
      reject(new Error(`${path.basename(absScript)} exited with ${c}`));
    });
  });
}

async function listRaceIds(ymd) {
  const out = await runCaptureNode(SCRIPTS.listRaceIds, [ymd]);
  return out
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

async function eachLimit(items, limit, worker) {
  let i = 0;
  let active = 0;
  return new Promise((resolve, reject) => {
    const next = () => {
      if (i >= items.length && active === 0) return resolve();
      while (active < limit && i < items.length) {
        const idx = i++;
        active++;
        Promise.resolve(worker(items[idx], idx))
          .then(() => {
            active--;
            next();
          })
          .catch(reject);
      }
    };
    next();
  });
}

function ymdToIso(ymd) {
  return `${ymd.slice(0, 4)}-${ymd.slice(4, 6)}-${ymd.slice(6, 8)}`;
}

function buildEvalPredictionArgs(raceId) {
  const args = [raceId];
  if (STAKE_WIN > 0) args.push('--stake-win', String(STAKE_WIN));
  if (STAKE_PLACE > 0) args.push('--stake-place', String(STAKE_PLACE));
  return args;
}

(async () => {
  const ymd = process.argv[2] || '';
  if (!/^\d{8}$/.test(ymd)) {
    console.error('Usage: node daily-result-batch.js YYYYMMDD');
    process.exit(1);
  }

  log(`=== デイリー結果バッチ開始: ${ymd} (並列: ${PARALLEL}) ===`);

  log(`[1] ${path.basename(SCRIPTS.listRaceIds)} ${ymd}`);
  const raceIds = await listRaceIds(ymd);
  log(`[1] 取得RACEID: ${raceIds.length}件`);
  if (raceIds.length === 0) {
    log('対象レースなし。終了。');
    return;
  }

  await eachLimit(raceIds, PARALLEL, async (raceId) => {
    log(`[save-result] ${raceId}`);
    const code = await runNodeWithCode(SCRIPTS.saveResult, [raceId]);
    if (code === 2) {
      log(`[skip] 結果未確定: ${raceId}`);
      return;
    }
    if (code !== 0) {
      throw new Error(`${path.basename(SCRIPTS.saveResult)} exited with ${code}`);
    }

    log(`[eval-pred ] ${raceId}`);
    await runNode(SCRIPTS.evalPrediction, buildEvalPredictionArgs(raceId));
  });

  const iso = ymdToIso(ymd);
  log(`[roi] ${path.basename(SCRIPTS.evalRoi)} --from ${iso} --to ${iso}`);
  await runNode(SCRIPTS.evalRoi, ['--from', iso, '--to', iso]);

  log(`=== デイリー結果バッチ完了: ${ymd} ===`);
})().catch((e) => {
  console.error(`[fatal] ${e.message}`);
  process.exit(1);
});
