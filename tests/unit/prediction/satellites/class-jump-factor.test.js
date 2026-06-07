'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { computeClassJumpBonuses, CLASS_JUMP_BONUS, CAP_PCT } = require('../../../../scripts/lib/prediction/satellites/class-jump-factor');

const RACE_ID = '202605230131';

// race_title → { race_title } オブジェクトで返す（repository と同じ形式）
const titleRow = title => ({ race_title: title });

test('クラスが1段階上昇した場合にボーナス付与', async () => {
  const rows = [{ horse_number: 1, horse_name: 'A' }];
  // 今走: C2(Lv2) → 前走: C3(Lv1) → 上昇
  const fetch = async () => titleRow('C3特別');
  const result = await computeClassJumpBonuses(rows, 2, fetch, RACE_ID);
  assert.equal(result.bonuses.get(1), CLASS_JUMP_BONUS);
  assert.equal(result.capPct, CAP_PCT);
});

test('クラスが2段階上昇した場合にもボーナス付与', async () => {
  const rows = [{ horse_number: 2, horse_name: 'B' }];
  // 今走: A(Lv4) → 前走: C1(Lv2) → +2段階
  const fetch = async () => titleRow('C1特別');
  const result = await computeClassJumpBonuses(rows, 4, fetch, RACE_ID);
  assert.equal(result.bonuses.get(2), CLASS_JUMP_BONUS);
});

test('クラスが同じ場合はボーナスなし', async () => {
  const rows = [{ horse_number: 3, horse_name: 'C' }];
  // 今走: C2(Lv2) → 前走: C2(Lv2)
  const fetch = async () => titleRow('C2特別');
  const result = await computeClassJumpBonuses(rows, 2, fetch, RACE_ID);
  assert.equal(result.bonuses.has(3), false);
});

test('クラスが下降した場合はボーナスなし', async () => {
  const rows = [{ horse_number: 4, horse_name: 'D' }];
  // 今走: C2(Lv2) → 前走: B2(Lv3) → 降格
  const fetch = async () => titleRow('B2特別');
  const result = await computeClassJumpBonuses(rows, 2, fetch, RACE_ID);
  assert.equal(result.bonuses.has(4), false);
});

test('前走データなし（nullを返す）はスキップ', async () => {
  const rows = [{ horse_number: 5, horse_name: 'E' }];
  const fetch = async () => null;
  const result = await computeClassJumpBonuses(rows, 3, fetch, RACE_ID);
  assert.equal(result.bonuses.has(5), false);
});

test('今走クラスがnullの場合は全馬スキップ', async () => {
  const rows = [{ horse_number: 6, horse_name: 'F' }];
  let called = false;
  const fetch = async () => { called = true; return titleRow('C3特別'); };
  const result = await computeClassJumpBonuses(rows, null, fetch, RACE_ID);
  assert.equal(result.bonuses.size, 0);
  assert.equal(called, false);
});

test('前走レース名からクラス判定できない場合はスキップ', async () => {
  const rows = [{ horse_number: 7, horse_name: 'G' }];
  // parseRaceClassLevel がnullを返すタイトル
  const fetch = async () => titleRow('オープン特別');
  const result = await computeClassJumpBonuses(rows, 3, fetch, RACE_ID);
  assert.equal(result.bonuses.has(7), false);
});

test('複数頭の混在ケース', async () => {
  const rows = [
    { horse_number: 1, horse_name: 'A' },
    { horse_number: 2, horse_name: 'B' },
    { horse_number: 3, horse_name: 'C' },
  ];
  const data = {
    A: titleRow('C3特別'),  // 前走Lv1 → 今走Lv3 → 上昇
    B: titleRow('B2特別'),  // 前走Lv3 → 今走Lv3 → 同
    C: null,                // データなし
  };
  const fetch = async name => data[name];
  const result = await computeClassJumpBonuses(rows, 3, fetch, RACE_ID);
  assert.equal(result.bonuses.get(1), CLASS_JUMP_BONUS);
  assert.equal(result.bonuses.has(2), false);
  assert.equal(result.bonuses.has(3), false);
});
