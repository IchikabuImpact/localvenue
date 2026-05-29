'use strict';
const test = require('node:test'); const assert = require('node:assert/strict');
const { calculateRaceRoi, normalizeScores } = require('../../../scripts/lib/roi/roi-calculator');
const { parseTargetYmd, ymdToIso } = require('../../../scripts/lib/roi/daily-roi-use-case');
test('normalizeScoresはscore合計で正規化する',()=>{assert.deepEqual(normalizeScores([{score:1},{score:3}]),[0.25,0.75]);});
test('calculateRaceRoiはEV閾値を満たすWIN/PLACEを集計する',()=>{const rows=calculateRaceRoi({raceId:'202605230131',modelVersion:'m',items:[{horse_number:7,p_win:1,p_place:1}],payoutRows:[{bet_type:'WIN',horse_number:7,payout:180},{bet_type:'PLACE',horse_number:7,payout:110}],stake:100,threshold:1,mode:'both'}); assert.deepEqual(rows.map(r=>[r.strategy,r.stake,r.returned]),[['ev_win',100,180],['ev_place',100,110]]);});
test('parseTargetYmdとymdToIso',()=>{assert.equal(parseTargetYmd('20260523'),'20260523'); assert.equal(ymdToIso('20260523'),'2026-05-23'); assert.throws(()=>parseTargetYmd('bad'),/Usage/);});
