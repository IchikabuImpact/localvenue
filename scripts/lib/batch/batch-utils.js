'use strict';

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

function timestamp(now = new Date()) {
  const pad = (n, z = 2) => String(n).padStart(z, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

function createBatchLogger(output = console.log) {
  return (message) => output(`[${timestamp()}] ${message}`);
}

function exists(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function createNodeRunner({ nodeBin = process.env.NODE_BIN || 'node', cwd = process.cwd(), existsFn = exists, spawnFn = spawn } = {}) {
  function runNodeWithCode(absScript, args = []) {
    return new Promise((resolve, reject) => {
      if (!existsFn(absScript)) {
        reject(new Error(`not found: ${absScript}`));
        return;
      }
      const child = spawnFn(nodeBin, [absScript, ...args], {
        stdio: 'inherit',
        cwd,
      });
      child.on('exit', (code) => resolve(code ?? 1));
      child.on('error', reject);
    });
  }

  async function runNode(absScript, args = [], okCodes = [0]) {
    const code = await runNodeWithCode(absScript, args);
    if (okCodes.includes(code)) return;
    throw new Error(`${path.basename(absScript)} exited with ${code}`);
  }

  function runCaptureNode(absScript, args = []) {
    return new Promise((resolve, reject) => {
      if (!existsFn(absScript)) {
        reject(new Error(`not found: ${absScript}`));
        return;
      }
      const child = spawnFn(nodeBin, [absScript, ...args], {
        stdio: ['ignore', 'pipe', 'inherit'],
        cwd,
      });
      let out = '';
      child.stdout.on('data', (buffer) => {
        out += buffer.toString();
      });
      child.on('exit', (code) => {
        if (code === 0) {
          resolve(out);
          return;
        }
        reject(new Error(`${path.basename(absScript)} exited with ${code}`));
      });
      child.on('error', reject);
    });
  }

  return { runCaptureNode, runNode, runNodeWithCode };
}

function parseRaceIdsOutput(output) {
  return String(output)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

async function listRaceIds(runCaptureNode, listRaceIdsScript, ymd) {
  const out = await runCaptureNode(listRaceIdsScript, [ymd]);
  return parseRaceIdsOutput(out);
}

async function eachLimit(items, limit, worker) {
  let nextIndex = 0;
  let active = 0;
  return new Promise((resolve, reject) => {
    const next = () => {
      if (nextIndex >= items.length && active === 0) {
        resolve();
        return;
      }
      while (active < limit && nextIndex < items.length) {
        const currentIndex = nextIndex;
        nextIndex += 1;
        active += 1;
        Promise.resolve(worker(items[currentIndex], currentIndex))
          .then(() => {
            active -= 1;
            next();
          })
          .catch(reject);
      }
    };
    next();
  });
}

module.exports = {
  createBatchLogger,
  createNodeRunner,
  eachLimit,
  exists,
  listRaceIds,
  parseRaceIdsOutput,
  timestamp,
};
