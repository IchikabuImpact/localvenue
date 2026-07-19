'use strict';

const cheerio = require('cheerio');

/**
 * 直近走の通過順位（"1-1-1-1 42.6" や "6-6 39.2"）と頭数から脚質を推定する。
 * 最初のコーナー通過順位 / 頭数 の平均比率で分類。
 * @param {string[]} timeCells  - row4 の時計セル群 ["1:04.1 6-6 39.2", ...]
 * @param {number[]} fieldSizes - row1 の直近走頭数 [10, 8, ...]
 * @returns {'逃げ'|'先行'|'差し'|'追込'|null}
 */
/**
 * 時計セル文字列 "1:03.1 9-9 37.5" から上がり3F（末尾の小数）を取得する。
 * @param {string|undefined} cell
 * @returns {number|null}
 */
function extractAgari(cell) {
  if (!cell) return null;
  const m = cell.match(/(\d+\.\d+)\s*$/);
  return m ? parseFloat(m[1]) : null;
}

function parseHorseWeight(text) {
  const normalized = String(text || '').replace(/[＋－−]/g, c => (c === '＋' ? '+' : '-'));
  const m = normalized.match(/(?:馬体重\s*)?(\d{3})\s*[（(]\s*([+-]?\d+)\s*[)）]/);
  if (!m) return { horse_weight: null, horse_weight_diff: null };
  return {
    horse_weight: Number(m[1]),
    horse_weight_diff: Number(m[2]),
  };
}

function inferRunningStyle(timeCells, fieldSizes) {
  const ratios = [];
  for (let i = 0; i < Math.min(timeCells.length, fieldSizes.length); i++) {
    // "1:46.5 1-1-1-1 42.6" の最初の通過順位数字を取得
    const m = timeCells[i].match(/\d+:\d+\.\d\s+(\d+)/);
    if (!m) continue;
    const firstPos = Number(m[1]);
    const fieldSize = fieldSizes[i];
    if (fieldSize > 0) ratios.push(firstPos / fieldSize);
  }
  if (!ratios.length) return null;
  const avg = ratios.reduce((a, b) => a + b, 0) / ratios.length;
  // 頭数比で分類。先頭10%以内（10頭なら1番手）を逃げと判定
  if (avg <= 0.10) return '逃げ';
  if (avg <= 0.30) return '先行';
  if (avg <= 0.60) return '差し';
  return '追込';
}

function parseRacingForm(html, yy) {
  const $ = cheerio.load(html);

  if (!$('section.cardTable table').length) {
    throw new Error('出馬表テーブルが見つかりません（準備中または該当レースなし）');
  }

  const results = [];
  let lastFrameNumber = null;

  $('section.cardTable table tbody tr.tBorder').each((_, tr1el) => {
    const $r1 = $(tr1el);
    const $r2 = $r1.next('tr');
    const $r3 = $r2.next('tr');
    const $r4 = $r3.next('tr');
    const $r5 = $r4.next('tr');

    const frameNumberText = $r1.find('td.courseNum').text().trim();
    const parsedFrameNumber = Number(frameNumberText);
    if (Number.isFinite(parsedFrameNumber) && parsedFrameNumber > 0) {
      lastFrameNumber = parsedFrameNumber;
    }
    const frame_number = lastFrameNumber;
    const horse_number = Number($r1.find('td.horseNum').text().trim());
    const horse_name = $r1.find('a.horseName').text().trim();
    if (!frame_number || !horse_number || !horse_name) return;

    const $jockeyA = $r1.find('a.jockeyName');
    let jockey = null;
    let affiliation = null;
    if ($jockeyA.length) {
      const $c = $jockeyA.clone();
      affiliation = $c.find('span.jockeyarea').text().replace(/[()（）]/g, '').trim() || null;
      $c.find('span').remove();
      jockey = $c.text().trim() || null;
    }

    const $noBorder = $r2.find('td.noBorder');
    const sex_age = $noBorder.eq(0).find('span').text().trim() || $noBorder.eq(0).text().trim() || null;
    const hair = $noBorder.eq(1).text().trim() || null;

    let birthStr = '';
    let burden_weight = null;
    let horseWeight = { horse_weight: null, horse_weight_diff: null };
    $r2.add($r3).find('td').each((_, td) => {
      const t = $(td).text().trim();
      if (!birthStr && /\d{2}\.\d{2}生/.test(t)) birthStr = t;
      if (horseWeight.horse_weight === null) {
        horseWeight = parseHorseWeight(t);
      }
      if (burden_weight === null) {
        const m = t.replace(/[　\s]+/g, ' ').match(/^(\d{2,3}\.\d)\b/);
        if (m) {
          const v = parseFloat(m[1]);
          if (v >= 40 && v <= 65) burden_weight = v;
        }
      }
    });

    let birthymonth = 0;
    let birthyear = 0;
    const birthMatch = birthStr.match(/(\d{2})\.(\d{2})生/);
    if (birthMatch) birthymonth = Number(birthMatch[1]) || 0;
    const ageMatch = (sex_age || '').match(/(\d+)/);
    if (ageMatch) {
      const age = Number(ageMatch[1]);
      birthyear = yy - age;
      if (birthyear < 0) birthyear += 100;
    }

    const sire = $r3.find('td[colspan="3"]').first().text().trim() || null;
    const trainerRaw = ($r3.find('td[colspan="1"]').first().find('a').text() || $r3.find('td[colspan="1"]').first().text()).trim();
    const trainer = trainerRaw.replace(/\s*[（(][^)）]*[)）]\s*$/, '').trim() || null;

    const dam = $r4.find('td[colspan="3"]').first().text().trim() || null;
    const owner = $r4.find('td[colspan="1"]').first().text().trim() || null;

    // row1 の直近走セル（"5 26.05.26 稍重 10頭 門別 右1000 10番" 形式）から頭数抽出
    const fieldSizes = [];
    $r1.find('td').each((_, td) => {
      const t = $(td).text().replace(/\s+/g, ' ').trim();
      const m = t.match(/\d{2}\.\d{2}\.\d{2}.*?(\d+)頭/);
      if (m) fieldSizes.push(Number(m[1]));
    });

    // row4 の時計セル（td[0]=dam colspan3, td[1]=owner をスキップ、td[2+]が時計+通過順）
    const timeCells = [];
    $r4.find('td').each((i, td) => {
      if (i < 2) return; // dam と owner をスキップ
      const t = $(td).text().replace(/\s+/g, ' ').trim();
      if (/\d+:\d+\.\d/.test(t)) timeCells.push(t);
    });

    const running_style = inferRunningStyle(timeCells, fieldSizes);

    // 上がり3F: "1:03.1 9-9 37.5" の末尾数値（直近1走・2走分）
    const agari_3f_1 = extractAgari(timeCells[0]) ?? null;
    const agari_3f_2 = extractAgari(timeCells[1]) ?? null;

    const bmsRaw = $r5.find('td[colspan="3"]').first().text().trim();
    const broodmare_sire = bmsRaw.replace(/^[（(]\s*|\s*[)）]$/g, '').trim() || null;
    const breeder = $r5.find('td[colspan="1"]').first().text().trim() || null;

    results.push({
      frame_number, horse_number, horse_name,
      sex_age, hair, birthyear, birthymonth,
      sire, dam, broodmare_sire,
      jockey, affiliation,
      burden_weight,
      horse_weight: horseWeight.horse_weight,
      horse_weight_diff: horseWeight.horse_weight_diff,
      trainer, owner, breeder,
      running_style,
      agari_3f_1,
      agari_3f_2,
    });
  });

  return results;
}

class RacingFormParser {
  parse(html, { yy }) {
    return parseRacingForm(html, yy);
  }
}

module.exports = { RacingFormParser, parseRacingForm, parseHorseWeight };
