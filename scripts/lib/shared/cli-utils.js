'use strict';

function getOpt(name, defVal, argv = process.argv) {
  const prefix = `--${name}=`;
  const hit = argv.find((arg) => arg.startsWith(prefix));
  return hit ? hit.slice(prefix.length) : defVal;
}

function numberOpt(name, defVal, argv = process.argv) {
  const parsed = Number(getOpt(name, '', argv));
  return Number.isFinite(parsed) && parsed !== 0 ? parsed : defVal;
}

module.exports = {
  getOpt,
  numberOpt,
};
