#!/usr/bin/env node
/**
 * @copyright © 2026 IchikabuImpact
 * @license Commercial use prohibited without permission.
 */

// daily-yosou-batch.js
//
// Usage:
//   node daily-yosou-batch.js           // JST 今日の開催分を対象
//   node daily-yosou-batch.js 20251116  // 指定日の開催分を対象（YYYYMMDD）

const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const NODE_BIN = process.env.NODE_BIN || "node";
const PARALLEL = Math.max(1, Number(process.env.PARALLEL || 2));

// このJSのある場所（= リポジトリ直下に置いている想定）
const BASE = __dirname;

// 子スクリプトはリポジトリ直下にある前提。場所が違うならここで調整
const SCRIPTS = {
  kaisai: path.join(BASE, "001-save-monthly-calendar.js"),
  saveCount: path.join(BASE, "002-save-race-count-by-date.js"),
  listRaceIds: path.join(BASE, "003-list-race-ids.js"),
  racingForm: path.join(BASE, "004-racing-form-to-db.js"),
  predict: path.join(BASE, "005-predict-race.js"),
  jockeyMonthlySh: path.join(BASE, "monthly-fetch-jockey-ranking.sh"),
  jockeyMonthlyBat: path.join(BASE, "monthly-fetch-jockey-ranking.bat"),
  sireMonthlySh: path.join(BASE, "monthly-fetch-sire-ranking.sh"),
  sireMonthlyBat: path.join(BASE, "monthly-fetch-sire-ranking.bat"),
};

const ts = () => {
  const d = new Date();
  const pad = (n, z = 2) => String(n).padStart(z, "0");
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

const isWin = () => process.platform === "win32";

// JST 今日を YYYYMMDD で返す
const jstTodayYmd = () => {
  const jst = new Date(Date.now() + 9 * 3600 * 1000);
  const y = jst.getUTCFullYear();
  const m = String(jst.getUTCMonth() + 1).padStart(2, "0");
  const d = String(jst.getUTCDate()).padStart(2, "0");
  return `${y}${m}${d}`;
};

function runNode(absScript, args = []) {
  return new Promise((resolve, reject) => {
    if (!exists(absScript)) {
      return reject(new Error(`not found: ${absScript}`));
    }
    const p = spawn(NODE_BIN, [absScript, ...args], {
      stdio: "inherit",
      cwd: BASE,
    });
    p.on("exit", (code) => {
      if (code === 0) return resolve();
      reject(new Error(`${path.basename(absScript)} exited with ${code}`));
    });
  });
}

function runCaptureNode(absScript, args = []) {
  return new Promise((resolve, reject) => {
    if (!exists(absScript)) {
      return reject(new Error(`not found: ${absScript}`));
    }
    const p = spawn(NODE_BIN, [absScript, ...args], {
      stdio: ["ignore", "pipe", "inherit"],
      cwd: BASE,
    });
    let out = "";
    p.stdout.on("data", (b) => (out += b.toString()));
    p.on("exit", (c) => {
      if (c === 0) return resolve(out);
      reject(new Error(`${path.basename(absScript)} exited with ${c}`));
    });
  });
}

async function runIfExists(shAbs, batAbs) {
  const hasSh = exists(shAbs);
  const hasBat = exists(batAbs);
  if (!hasSh && !hasBat) {
    log(`(info) ${path.basename(shAbs).replace(/\.sh$/, "")} スキップ（ファイル無し）`);
    return;
  }

  await new Promise((res, rej) => {
    const useBat = isWin() && hasBat;
    const cmd = useBat ? batAbs : "bash";
    const args = useBat ? [] : [shAbs];
    const p = spawn(cmd, args, {
      stdio: "inherit",
      cwd: BASE,
      shell: isWin(),
    });
    p.on("exit", (c) => {
      if (c === 0) return res();
      rej(new Error(`${useBat ? path.basename(batAbs) : path.basename(shAbs)} exited with ${c}`));
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

(async () => {
  // 引数に YYYYMMDD が来ていればそれを使い、なければ JST 今日
  const ymdArg = process.argv[2] || "";
  const ymd = /^\d{8}$/.test(ymdArg) ? ymdArg : jstTodayYmd();

  log(`=== デイリー予想バッチ開始: ${ymd} (並列: ${PARALLEL}) ===`);

  // [1] 月間開催情報を更新（引数は YYYYMMDD だが、001-save-monthly-calendar.js 側で年月に解釈）
  log(`[1] ${path.basename(SCRIPTS.kaisai)} ${ymd}`);
  await runNode(SCRIPTS.kaisai, [ymd]);

  // [2] 当日分の会場ごとのレース数を取得・保存
  log(`[2] ${path.basename(SCRIPTS.saveCount)} ${ymd}`);
  await runNode(SCRIPTS.saveCount, [ymd]);

  // [3] 騎手ランキング月次取得（スクリプトが存在する場合のみ）
  log(`[3] monthly-fetch-jockey-ranking.*`);
  await runIfExists(SCRIPTS.jockeyMonthlySh, SCRIPTS.jockeyMonthlyBat);

  // [4] 種牡馬ランキング月次取得（スクリプトが存在する場合のみ）
  log(`[4] monthly-fetch-sire-ranking.*`);
  await runIfExists(SCRIPTS.sireMonthlySh, SCRIPTS.sireMonthlyBat);

  // [5] 当日全レースの race_id を取得
  log(`[5] ${path.basename(SCRIPTS.listRaceIds)} ${ymd}`);
  const raceIds = await listRaceIds(ymd);
  log(`[5] 取得RACEID: ${raceIds.length}件`);
  if (raceIds.length === 0) {
    log("本日レースなし。終了。");
    return;
  }

  // [6] 各レースについて 出馬表取り込み → 予想生成 を並列実行
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
