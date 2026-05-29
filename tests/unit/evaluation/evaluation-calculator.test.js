'use strict';
const test = require('node:test'); const assert = require('node:assert/strict');
const { evaluatePrediction, safeJSON } = require('../../../scripts/lib/evaluation/evaluation-calculator');
test('safeJSONは文字列/Buffer/objectを安全に扱う',()=>{assert.deepEqual(safeJSON('{"a":1}'),{a:1}); assert.deepEqual(safeJSON(Buffer.from('{"a":2}')),{a:2}); assert.equal(safeJSON('{'),null);});
test('予想bestと払戻から的中評価とROI行を作る',()=>{const ev=evaluatePrediction({raceId:'202605230131',prediction:{model_version:'m',memo:{best:{horse_number:7},items:[{horse_number:7,score:10}]}},resultRows:[{horse_number:7,horse_name:'A',official_finish_position:1}],payoutRows:[{bet_type:'WIN',horse_number:7,payout:180},{bet_type:'PLACE',horse_number:7,payout:110}],stakeWin:100,stakePlace:100}); assert.equal(ev.evalRow.win_hit,true); assert.equal(ev.evalRow.place_hit,true); assert.deepEqual(ev.roiRows.map(r=>r.returned),[180,110]);});
