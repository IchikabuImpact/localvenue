#!/usr/bin/env node
// daily-yosou-batch.js
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const NODE_BIN = process.env.NODE_BIN || "node";
const PARALLEL = Math.max(1, Number(process.env.PARALLEL || 2));

// このJSのある場所（= リポジトリ直下に置いている想定）
const BASE = __dirname;

// 子スクリプトはリポジトリ直下にある前提。場所が違うならここで調整
const SCRIPTS = {
  kaisai: path.join(BASE, "kaisai-info.js"),
  saveCount: path.join(BASE, "save-race-count-by-date.js"),
  listRaceIds: path.join(BASE, "list-race-ids.js"),
  racingForm: path.join(BASE, "racing-form-to-db.js"),
  predict: path.join(BASE, "predict-race.js"),
  jockeyMonthlySh: path.join(BASE, "monthly-fetch-jockey-ranking.sh"),
  jockeyMonthlyBat: path.join(BASE, "monthly-fetch-jockey-ranking.bat"),
  sireMonthlySh: path.join(BASE, "monthly-fetch-sire-ranking.sh"),
  sireMonthlyBat: path.join(BASE, "monthly-fetch-sire-ranking.bat"),
};

const ts = () => {
  const d = new Date();
  const pad = (n, z = 2) => String(n).padStart(z, "0");
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};
const log = (m) => console.log(`[${ts()}] ${m}`);
const exists = (p) => { try { fs.accessSync(p, fs.constants.F_OK); return true; } catch { return false; } };
const isWin = () => process.platform === "win32";

const jstTodayYmd = () => {
  const jst = new Date(Date.now() + 9*3600*1000);
  const y = jst.getUTCFullYear();
  const m = String(jst.getUTCMonth()+1).padStart(2,"0");
  const d = String(jst.getUTCDate()).padStart(2,"0");
  return `${y}${m}${d}`;
};
const ymdParts = (ymd) => ({ y: ymd.slice(0,4), m: ymd.slice(4,6), d: ymd.slice(6,8) });

function runNode(absScript, args = []) {
  return new Promise((resolve, reject) => {
    if (!exists(absScript)) return reject(new Error(`not found: ${absScript}`));
    const p = spawn(NODE_BIN, [absScript, ...args], { stdio: "inherit", cwd: BASE });
    p.on("exit", (code) => code === 0 ? resolve() : reject(new Error(`${path.basename(absScript)} exited with ${code}`)));
  });
}

function runCaptureNode(absScript, args = []) {
  return new Promise((resolve, reject) => {
    if (!exists(absScript)) return reject(new Error(`not found: ${absScript}`));
    const p = spawn(NODE_BIN, [absScript, ...args], { stdio: ["ignore","pipe","inherit"], cwd: BASE });
    let out = "";
    p.stdout.on("data", (b) => out += b.toString());
    p.on("exit", (c) => c===0 ? resolve(out) : reject(new Error(`${path.basename(absScript)} exited with ${c}`)));
  });
}

async function runIfExists(shAbs, batAbs) {
  const hasSh = exists(shAbs);
  const hasBat = exists(batAbs);
  if (!hasSh && !hasBat) { log(`(info) ${path.basename(shAbs).replace(/\.sh$/,'')} スキップ（ファイル無し）`); return; }
  await new Promise((res, rej) => {
    const useBat = isWin() && hasBat;
    const cmd = useBat ? batAbs : "bash";
    const args = useBat ? [] : [shAbs];
    const p = spawn(cmd, args, { stdio: "inherit", cwd: BASE, shell: isWin() });
    p.on("exit", (c) => c===0 ? res() : rej(new Error(`${useBat?path.basename(batAbs):path.basename(shAbs)} exited with ${c}`)));
  });
}

async function listRaceIds(ymd) {
  const out = await runCaptureNode(SCRIPTS.listRaceIds, [ymd]);
  return out.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
}

async function eachLimit(items, limit, worker) {
  let i = 0, active = 0;
  return new Promise((resolve, reject) => {
    const next = () => {
      if (i >= items.length && active === 0) return resolve();
      while (active < limit && i < items.length) {
        const idx = i++; active++;
        Promise.resolve(worker(items[idx], idx))
          .then(() => { active--; next(); })
          .catch(reject);
      }
    };
    next();
  });
}

(async () => {
  const ymd = /^\d{8}$/.test(process.argv[2] || "") ? process.argv[2] : jstTodayYmd();
  const { y, m } = ymdParts(ymd);

  log(`=== デイリー予想バッチ開始: ${ymd} (並列: ${PARALLEL}) ===`);

  log(`[1] ${path.basename(SCRIPTS.kaisai)} ${y} ${m}`);
  await runNode(SCRIPTS.kaisai, [y, m]);

  log(`[2] ${path.basename(SCRIPTS.saveCount)} ${ymd}`);
  await runNode(SCRIPTS.saveCount, [ymd]);

  log(`[3] monthly-fetch-jockey-ranking.*`);
  await runIfExists(SCRIPTS.jockeyMonthlySh, SCRIPTS.jockeyMonthlyBat);

  log(`[4] monthly-fetch-sire-ranking.*`);
  await runIfExists(SCRIPTS.sireMonthlySh, SCRIPTS.sireMonthlyBat);

  log(`[5] ${path.basename(SCRIPTS.listRaceIds)} ${ymd}`);
  const raceIds = await listRaceIds(ymd);
  log(`[5] 取得RACEID: ${raceIds.length}件`);
  if (raceIds.length === 0) { log("本日レースなし。終了。"); return; }

  await eachLimit(raceIds, PARALLEL, async (raceId) => {
    log(`[racing-form] ${raceId}`);
    await runNode(SCRIPTS.racingForm, [raceId]);

    log(`[predict    ] ${raceId}`);
    await runNode(SCRIPTS.predict, [raceId]);
  });

  log(`=== デイリー予想バッチ完了: ${ymd} ===`);
})().catch((e) => {
  console.error(`[fatal] ${e.message}`);
  process.exit(1);
});
