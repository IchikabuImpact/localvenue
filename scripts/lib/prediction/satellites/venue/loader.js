'use strict';

/**
 * 会場コード（baba_code）に対応する会場別サテライトを動的にロードして実行する。
 * 新しい会場ファクターは satellites/venue/<code>-<name>/ ディレクトリを作るだけで自動適用される。
 *
 * 各会場ファクターファイルは以下を export すること:
 *   async function compute(racingFormRows, context) => { bonuses: Map, capPct?: number }
 *   const name = 'factor-name'  (satellites 配列の name フィールドに使用)
 *
 * @param {string} babaCode         - race_id の下2桁（例: '31'=高知, '32'=佐賀）
 * @param {Array}  racingFormRows   - findByRaceId の結果
 * @param {object} context          - { raceId, distanceM, trackCondition, ... } 予想コンテキスト
 * @returns {Promise<Array<{name, bonuses, capPct?}>>}
 */
async function loadVenueSatellites(babaCode, racingFormRows, context) {
  let mod;
  try {
    mod = require(`./${babaCode}/index.js`);
  } catch {
    return []; // その会場のファクターが未定義なら空
  }
  return mod.computeAll(racingFormRows, context);
}

module.exports = { loadVenueSatellites };
