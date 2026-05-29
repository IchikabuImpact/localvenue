'use strict';

const cheerio = require('cheerio');

function parseRacingForm(html, yy) {
  const $ = cheerio.load(html);

  if (!$('section.cardTable table').length) {
    throw new Error('出馬表テーブルが見つかりません（準備中または該当レースなし）');
  }

  const results = [];

  $('section.cardTable table tbody tr.tBorder').each((_, tr1el) => {
    const $r1 = $(tr1el);
    const $r2 = $r1.next('tr');
    const $r3 = $r2.next('tr');
    const $r4 = $r3.next('tr');
    const $r5 = $r4.next('tr');

    const frame_number = Number($r1.find('td.courseNum').text().trim());
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
    $r2.find('td').each((_, td) => {
      const t = $(td).text().trim();
      if (!birthStr && /\d{2}\.\d{2}生/.test(t)) birthStr = t;
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

    const bmsRaw = $r5.find('td[colspan="3"]').first().text().trim();
    const broodmare_sire = bmsRaw.replace(/^[（(]\s*|\s*[)）]$/g, '').trim() || null;
    const breeder = $r5.find('td[colspan="1"]').first().text().trim() || null;

    results.push({
      frame_number, horse_number, horse_name,
      sex_age, hair, birthyear, birthymonth,
      sire, dam, broodmare_sire,
      jockey, affiliation,
      burden_weight,
      trainer, owner, breeder,
    });
  });

  return results;
}

class RacingFormParser {
  parse(html, { yy }) {
    return parseRacingForm(html, yy);
  }
}

module.exports = { RacingFormParser, parseRacingForm };
