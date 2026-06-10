'use strict';

/**
 * 高知競馬（baba_code=36）の会場別サテライトファクター群。
 * 新しいファクターはここに追加して computeAll に並べる。
 */
const runningStyle = require('./running-style-factor');

async function computeAll(racingFormRows, context) {
  const results = await Promise.all([
    runningStyle.compute(racingFormRows, context),
  ]);
  return results;
}

module.exports = { computeAll };
