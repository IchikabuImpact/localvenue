'use strict';
const test = require('node:test'); const assert = require('node:assert/strict');
const { narToRakutenRaceIdCandidates } = require('../../../scripts/lib/result/rakuten-race-code');
const { parseRakutenResultHtml } = require('../../../scripts/lib/result/rakuten-result-parser');

test('NAR race_idから楽天race_id候補を生成する', () => { assert.deepEqual(narToRakutenRaceIdCandidates('202605230131'), ['202605233129110601']); });
test('楽天結果HTMLから結果と単複払戻を抽出する', () => {
 const html = `<html><body><table><thead><tr><th>着順</th><th>枠番</th><th>馬番</th><th>馬名</th><th>騎手</th></tr></thead><tbody><tr><td>1</td><td>1</td><td>7</td><td>馬A</td><td>騎手A</td></tr><tr><td>2</td><td>2</td><td>1</td><td>馬B</td><td>騎手B</td></tr></tbody></table><table summary="払戻金"><tbody class="repay"><tr><th>単勝</th><td class="number">7</td><td class="money">180円</td><td class="rank">3番人気</td></tr><tr><th>複勝</th><td class="number">7<br>1</td><td class="money">110円<br>150円</td><td class="rank">1番人気<br>2番人気</td></tr></tbody></table></body></html>`;
 const parsed = parseRakutenResultHtml(html); assert.equal(parsed.rows.length, 2); assert.deepEqual(parsed.payouts.map(p=>p.bet_type), ['WIN','PLACE','PLACE']);
});
