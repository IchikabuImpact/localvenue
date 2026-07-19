'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { parseRacingForm } = require('../../../scripts/lib/racing-form/racing-form-parser');

test('keiba.go.jp DebaTableの5行ブロックから出馬表を抽出する', () => {
  const html = `
    <section class="cardTable"><table><tbody>
      <tr class="tBorder">
        <td class="courseNum">1</td><td class="horseNum">2</td>
        <td><a class="horseName">テストホース</a></td>
        <td><a class="jockeyName"><span class="jockeyarea">(高知)</span>赤岡修次</a></td>
      </tr>
      <tr>
        <td class="noBorder"><span>牡3</span></td><td class="noBorder">鹿毛</td>
        <td>05.12生</td><td>56.0 騎手</td><td>456(+6)</td>
      </tr>
      <tr><td colspan="3">ロードカナロア</td><td colspan="1"><a>田中守（高知）</a></td></tr>
      <tr><td colspan="3">テストダム</td><td colspan="1">テスト馬主</td></tr>
      <tr><td colspan="3">（サンデーサイレンス）</td><td colspan="1">テスト牧場</td></tr>
    </tbody></table></section>
  `;

  assert.deepEqual(parseRacingForm(html, 26), [{
    frame_number: 1,
    horse_number: 2,
    horse_name: 'テストホース',
    sex_age: '牡3',
    hair: '鹿毛',
    birthyear: 23,
    birthymonth: 5,
    sire: 'ロードカナロア',
    dam: 'テストダム',
    broodmare_sire: 'サンデーサイレンス',
    jockey: '赤岡修次',
    affiliation: '高知',
    burden_weight: 56,
    horse_weight: 456,
    horse_weight_diff: 6,
    trainer: '田中守',
    owner: 'テスト馬主',
    breeder: 'テスト牧場',
    running_style: null,
    agari_3f_1: null,
    agari_3f_2: null,
  }]);
});

test('出馬表テーブルがない場合はエラーにする', () => {
  assert.throws(() => parseRacingForm('<html></html>', 26), /出馬表テーブル/);
});

test('馬体重が父名/調教師行のodds_weightにある形式を抽出する', () => {
  const html = `
    <section class="cardTable"><table><tbody>
      <tr class="tBorder">
        <td class="courseNum">1</td><td class="horseNum">3</td>
        <td><a class="horseName">テストホース2</a></td>
        <td><a class="jockeyName">野畑凌<span class="jockeyarea">（川崎）</span></a></td>
        <td class="odds_weight" rowspan="2">11.2<br>(5人気)</td>
      </tr>
      <tr>
        <td class="noBorder"><span>牡3</span></td><td class="noBorder">鹿毛</td>
        <td>03.15生</td><td>56.0 騎手</td>
      </tr>
      <tr>
        <td colspan="3">サクラゼウス</td><td colspan="1"><a>水野貴（浦和）</a></td>
        <td rowspan="2" class="odds_weight">476<br>(+4)</td>
      </tr>
      <tr><td colspan="3">テストダム</td><td colspan="1">テスト馬主</td></tr>
      <tr><td colspan="3">（サンデーサイレンス）</td><td colspan="1">テスト牧場</td></tr>
    </tbody></table></section>
  `;

  const [row] = parseRacingForm(html, 26);
  assert.equal(row.horse_weight, 476);
  assert.equal(row.horse_weight_diff, 4);
});

test('同枠2頭目でcourseNumが省略される形式も抽出する', () => {
  const html = `
    <section class="cardTable"><table><tbody>
      <tr class="tBorder">
        <td class="courseNum" rowspan="10">6</td><td class="horseNum" rowspan="5">6</td>
        <td><a class="horseName">先頭ホース</a></td>
        <td><a class="jockeyName">騎手A<span class="jockeyarea">（佐賀）</span></a></td>
      </tr>
      <tr><td class="noBorder"><span>牡4</span></td><td class="noBorder">鹿毛</td><td>05.01生</td><td>56.0</td></tr>
      <tr><td colspan="3">父A</td><td colspan="1"><a>調教師A（佐賀）</a></td></tr>
      <tr><td colspan="3">母A</td><td colspan="1">馬主A</td></tr>
      <tr><td colspan="3">（母父A）</td><td colspan="1">牧場A</td></tr>
      <tr class="tBorder">
        <td class="horseNum" rowspan="5">7</td>
        <td><a class="horseName">同枠ホース</a></td>
        <td><a class="jockeyName">騎手B<span class="jockeyarea">（佐賀）</span></a></td>
      </tr>
      <tr><td class="noBorder"><span>牝5</span></td><td class="noBorder">黒鹿毛</td><td>04.01生</td><td>54.0</td></tr>
      <tr><td colspan="3">父B</td><td colspan="1"><a>調教師B（佐賀）</a></td></tr>
      <tr><td colspan="3">母B</td><td colspan="1">馬主B</td></tr>
      <tr><td colspan="3">（母父B）</td><td colspan="1">牧場B</td></tr>
    </tbody></table></section>
  `;

  const rows = parseRacingForm(html, 26);
  assert.equal(rows.length, 2);
  assert.equal(rows[0].frame_number, 6);
  assert.equal(rows[1].frame_number, 6);
  assert.equal(rows[1].horse_number, 7);
  assert.equal(rows[1].horse_name, '同枠ホース');
});
