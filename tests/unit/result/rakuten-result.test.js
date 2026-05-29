'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { narToRakutenRaceIdCandidates } = require('../../../scripts/lib/result/rakuten-race-code');
const { parseRakutenResultHtml, parseQuinellaRow } = require('../../../scripts/lib/result/rakuten-result-parser');

test('NAR race_idから楽天race_id候補を生成する', () => {
  assert.deepEqual(narToRakutenRaceIdCandidates('202605230131'), ['202605233129110601']);
});

test('楽天結果HTMLから結果と単複払戻を抽出する', () => {
  const html = `<html><body>
    <table><thead><tr><th>着順</th><th>枠番</th><th>馬番</th><th>馬名</th><th>騎手</th></tr></thead>
    <tbody>
      <tr><td>1</td><td>1</td><td>7</td><td>馬A</td><td>騎手A</td></tr>
      <tr><td>2</td><td>2</td><td>1</td><td>馬B</td><td>騎手B</td></tr>
    </tbody></table>
    <table summary="払戻金"><tbody class="repay">
      <tr><th>単勝</th><td class="number">7</td><td class="money">180円</td><td class="rank">3番人気</td></tr>
      <tr><th>複勝</th><td class="number">7<br>1</td><td class="money">110円<br>150円</td><td class="rank">1番人気<br>2番人気</td></tr>
    </tbody></table>
  </body></html>`;
  const parsed = parseRakutenResultHtml(html);
  assert.equal(parsed.rows.length, 2);
  assert.deepEqual(parsed.payouts.map(p => p.bet_type), ['WIN', 'PLACE', 'PLACE']);
});

test('楽天結果HTMLから馬複払戻を抽出する', () => {
  const html = `<html><body>
    <table><thead><tr><th>着順</th><th>枠番</th><th>馬番</th><th>馬名</th><th>騎手</th></tr></thead>
    <tbody>
      <tr><td>1</td><td>1</td><td>3</td><td>馬A</td><td>騎手A</td></tr>
      <tr><td>2</td><td>2</td><td>5</td><td>馬B</td><td>騎手B</td></tr>
    </tbody></table>
    <table summary="払戻金"><tbody class="repay">
      <tr><th>単勝</th><td class="number">3</td><td class="money">820円</td><td class="rank">1番人気</td></tr>
      <tr><th>複勝</th><td class="number">3<br>5</td><td class="money">120円<br>140円</td><td class="rank">1番人気<br>2番人気</td></tr>
      <tr><th>馬複</th><td class="number">3 - 5</td><td class="money">1,560円</td><td class="rank">1番人気</td></tr>
    </tbody></table>
  </body></html>`;
  const parsed = parseRakutenResultHtml(html);
  const quinella = parsed.payouts.filter(p => p.bet_type === 'QUINELLA');
  assert.equal(quinella.length, 1);
  assert.equal(quinella[0].horse_number, 305); // 3*100+5
  assert.equal(quinella[0].payout, 1560);
});

test('馬複の馬番エンコードは lo*100+hi（lo < hi）', () => {
  // 高い馬番が先に来ても lo*100+hi に統一される
  const html = `<html><body>
    <table><thead><tr><th>着順</th><th>枠番</th><th>馬番</th><th>馬名</th><th>騎手</th></tr></thead>
    <tbody>
      <tr><td>1</td><td>1</td><td>8</td><td>馬A</td><td>騎手A</td></tr>
      <tr><td>2</td><td>2</td><td>2</td><td>馬B</td><td>騎手B</td></tr>
    </tbody></table>
    <table summary="払戻金"><tbody class="repay">
      <tr><th>馬複</th><td class="number">8 - 2</td><td class="money">2,300円</td><td class="rank">5番人気</td></tr>
    </tbody></table>
  </body></html>`;
  const parsed = parseRakutenResultHtml(html);
  const q = parsed.payouts.find(p => p.bet_type === 'QUINELLA');
  assert.ok(q);
  assert.equal(q.horse_number, 208); // min(8,2)*100+max(8,2) = 2*100+8 = 208
  assert.equal(q.payout, 2300);
});
