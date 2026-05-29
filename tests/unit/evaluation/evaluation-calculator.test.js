'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { safeJSON, quinellaKey, QUINELLA_BOX_TICKETS, evaluatePrediction } = require('../../../scripts/lib/evaluation/evaluation-calculator');

// ── safeJSON ─────────────────────────────────────────────────────
test('safeJSONは文字列・Buffer・オブジェクトを安全に扱う', () => {
  assert.deepEqual(safeJSON('{"a":1}'), { a: 1 });
  assert.deepEqual(safeJSON(Buffer.from('{"a":2}')), { a: 2 });
  assert.deepEqual(safeJSON({ a: 3 }), { a: 3 });
  assert.equal(safeJSON('{broken'), null);
  assert.equal(safeJSON(null), null);
});

// ── quinellaKey ────────────────────────────────────────────────
test('quinellaKey は lo*100+hi でエンコードする', () => {
  assert.equal(quinellaKey(3, 5),  305);
  assert.equal(quinellaKey(5, 3),  305); // 順序不問
  assert.equal(quinellaKey(1, 18), 118);
  assert.equal(quinellaKey(8, 2),  208);
});

test('QUINELLA_BOX_TICKETS は4頭ボックスの組み合わせ数6', () => {
  assert.equal(QUINELLA_BOX_TICKETS, 6);
});

// ── 単勝・複勝の的中 ──────────────────────────────────────────────
test('単勝・複勝ともに的中した場合', () => {
  const result = evaluatePrediction({
    raceId: '202605230131',
    prediction: { model_version: 'yosou-v1', memo: { best: { horse_number: 7 }, items: [{ horse_number: 7, score: 10 }] } },
    resultRows: [{ horse_number: 7, horse_name: 'A', official_finish_position: 1 }],
    payoutRows: [
      { bet_type: 'WIN',   horse_number: 7,  payout: 180 },
      { bet_type: 'PLACE', horse_number: 7,  payout: 110 },
    ],
    stakeWin: 100, stakePlace: 100,
  });
  assert.equal(result.winHit, true);
  assert.equal(result.placeHit, true);
  assert.equal(result.evalRow.win_hit, true);
  assert.equal(result.evalRow.place_hit, true);
  assert.deepEqual(result.roiRows.map(r => r.returned), [180, 110]);
});

test('単勝・複勝ともに不的中の場合', () => {
  const result = evaluatePrediction({
    raceId: '202605230131',
    prediction: { model_version: 'yosou-v1', memo: { best: { horse_number: 3 }, items: [] } },
    resultRows: [{ horse_number: 7, horse_name: 'A', official_finish_position: 1 }],
    payoutRows: [{ bet_type: 'WIN', horse_number: 7, payout: 250 }],
    stakeWin: 100, stakePlace: 100,
  });
  assert.equal(result.winHit, false);
  assert.equal(result.placeHit, false);
  assert.equal(result.evalRow.win_payout, null);
  assert.equal(result.roiRows.find(r => r.strategy === 'single').returned, 0);
});

// ── 馬複4頭ボックス ──────────────────────────────────────────────
test('馬複4頭ボックス: 1着と2着が両方top4に含まれる場合は的中', () => {
  const items = [
    { horse_number: 1, score: 100 },
    { horse_number: 3, score: 90 },
    { horse_number: 5, score: 80 },
    { horse_number: 7, score: 70 },
    { horse_number: 9, score: 60 },
  ];
  const result = evaluatePrediction({
    raceId: '202605230131',
    prediction: { model_version: 'm', memo: { best: { horse_number: 1 }, items } },
    resultRows: [
      { horse_number: 3, horse_name: 'A', official_finish_position: 1 },
      { horse_number: 7, horse_name: 'B', official_finish_position: 2 },
      { horse_number: 9, horse_name: 'C', official_finish_position: 3 },
    ],
    payoutRows: [
      { bet_type: 'WIN',      horse_number: 3,  payout: 500 },
      { bet_type: 'QUINELLA', horse_number: 307, payout: 1200 }, // 3と7 = 3*100+7=307
    ],
    stakeQuinella: 100,
  });
  assert.equal(result.quinellaHit, true);
  assert.equal(result.quinellaPayout, 1200);
  assert.deepEqual(result.top4, [1, 3, 5, 7]); // score降順
  // stakeQuinella=100, 4頭ボックス6票, stake=600
  const qRow = result.roiRows.find(r => r.strategy === 'quinella');
  assert.equal(qRow.stake, 600);
  assert.equal(qRow.returned, 1200); // Math.round(1200 * 100/100) = 1200
});

test('馬複4頭ボックス: top4に2着が含まれない場合は不的中', () => {
  const items = [
    { horse_number: 1, score: 100 },
    { horse_number: 3, score: 90 },
    { horse_number: 5, score: 80 },
    { horse_number: 7, score: 70 },
  ];
  const result = evaluatePrediction({
    raceId: '202605230131',
    prediction: { model_version: 'm', memo: { best: { horse_number: 1 }, items } },
    resultRows: [
      { horse_number: 1, horse_name: 'A', official_finish_position: 1 },
      { horse_number: 9, horse_name: 'B', official_finish_position: 2 }, // 9番はtop4外
    ],
    payoutRows: [{ bet_type: 'QUINELLA', horse_number: 109, payout: 800 }],
    stakeQuinella: 100,
  });
  assert.equal(result.quinellaHit, false);
  assert.equal(result.quinellaPayout, 0);
  assert.equal(result.roiRows.find(r => r.strategy === 'quinella').returned, 0);
});

test('馬複: stakeQuinella=0のときquinella ROI行が含まれない', () => {
  const items = [{ horse_number: 1, score: 100 }, { horse_number: 2, score: 90 }];
  const result = evaluatePrediction({
    raceId: '202605230131',
    prediction: { model_version: 'm', memo: { best: { horse_number: 1 }, items } },
    resultRows: [
      { horse_number: 1, horse_name: 'A', official_finish_position: 1 },
      { horse_number: 2, horse_name: 'B', official_finish_position: 2 },
    ],
    payoutRows: [{ bet_type: 'QUINELLA', horse_number: 102, payout: 600 }],
    stakeQuinella: 0, // 未設定
  });
  assert.equal(result.roiRows.filter(r => r.strategy === 'quinella').length, 0);
});

test('馬複: itemsが4頭未満でも正常に動作する', () => {
  const items = [
    { horse_number: 2, score: 100 },
    { horse_number: 4, score: 80 },
  ];
  const result = evaluatePrediction({
    raceId: '202605230131',
    prediction: { model_version: 'm', memo: { best: { horse_number: 2 }, items } },
    resultRows: [
      { horse_number: 2, horse_name: 'A', official_finish_position: 1 },
      { horse_number: 4, horse_name: 'B', official_finish_position: 2 },
    ],
    payoutRows: [{ bet_type: 'QUINELLA', horse_number: 204, payout: 750 }],
    stakeQuinella: 100,
  });
  assert.deepEqual(result.top4, [2, 4]); // 2頭のみ
  assert.equal(result.quinellaHit, true); // 両方top4にいる
  assert.equal(result.quinellaPayout, 750);
});

test('evalRowにquinella_hit/quinella_payoutが含まれる', () => {
  const result = evaluatePrediction({
    raceId: '202605230131',
    prediction: { model_version: 'm', memo: { best: { horse_number: 1 }, items: [{ horse_number: 1, score: 10 }] } },
    resultRows: [{ horse_number: 1, horse_name: 'A', official_finish_position: 1 }],
    payoutRows: [],
  });
  assert.ok('quinella_hit' in result.evalRow);
  assert.ok('quinella_payout' in result.evalRow);
  assert.equal(result.evalRow.quinella_hit, false);
  assert.equal(result.evalRow.quinella_payout, null);
});
