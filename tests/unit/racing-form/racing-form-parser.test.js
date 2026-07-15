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
