/*
 * racing-form-to-db.js
 * Usage:
 *   node racing-form-to-db.js 202509141131   // YYYYMMDD + RR + BB
 */

const webdriver = require('selenium-webdriver');
const { By, until } = webdriver;
const chrome = require('selenium-webdriver/chrome');
const mysql = require('mysql2/promise');
const config = require('./config.js');

// ---- 引数 ----
const [, , id12] = process.argv;
if (!id12 || !/^\d{12}$/.test(id12)) {
  console.error('Usage: node racing-form-to-db.js YYYYMMDDRRBB  (例: 202509141131)');
  process.exit(1);
}
const yyyymmdd = id12.slice(0, 8);
const raceNo2  = id12.slice(8, 10);
const baba2    = id12.slice(10, 12);
const raceNumber = Number(raceNo2);
const year  = Number(yyyymmdd.slice(0, 4));
const yy    = year % 100;
const raceDate = `${yyyymmdd.slice(0,4)}/${yyyymmdd.slice(4,6)}/${yyyymmdd.slice(6,8)}`;
const encodedRaceDate = encodeURIComponent(raceDate).replace(/%20/g, '%2f');
const race_id = id12;
const url = `https://www.keiba.go.jp/KeibaWeb/TodayRaceInfo/DebaTable?k_raceDate=${encodedRaceDate}&k_raceNo=${raceNumber}&k_babaCode=${baba2}`;

async function acceptConsentIfAny(driver) {
  for (const xp of [
    "//button[contains(.,'同意') or contains(.,'OK')]",
    "//a[contains(.,'同意')]"
  ]) {
    const els = await driver.findElements(By.xpath(xp));
    if (els.length) { try { await els[0].click(); } catch {} break; }
  }
}

(async function main() {
  const options = new chrome.Options()
    .addArguments('--headless=new','--disable-gpu','--no-sandbox','--disable-cache');
  const driver = await new webdriver.Builder().forBrowser('chrome').setChromeOptions(options).build();
  await driver.manage().deleteAllCookies();

  let conn;
  try {
    console.log(url);
    await driver.get(url);
    await acceptConsentIfAny(driver);
    await driver.wait(until.elementLocated(By.css('section.cardTable table')), 15000);

    // ---- 出馬表パース ----
    const rows = await driver.executeScript((yy) => {
      const norm  = (s) => (s || '').replace(/\s+/g, ' ').trim();
      const table = document.querySelector('section.cardTable > table');
      if (!table) return [];
      const trs = Array.from(table.querySelectorAll('tbody > tr'));

      // 各馬の先頭（horseNum を持つ行）
      const starts = [];
      trs.forEach((tr, i) => { if (tr.querySelector('td.horseNum')) starts.push(i); });
      if (!starts.length) return [];

      const hairRx = /鹿毛|黒鹿毛|栗毛|芦毛|栃栗毛|青毛|白毛|青鹿毛/;
      const timeRx = /\b\d{1,2}:\d{2}(?:\.\d)?\b/;
      const babaRx = /(良|稍重|重|不良)/;

      const asText = (tr, i) => {
        const td = tr?.querySelectorAll('td')?.[i];
        return norm(td ? td.innerText : '');
      };
      const weightStr = (s) => {
        const m = (s || '').match(/(▲|△|◇)?\s*(\d{2,3}\.\d)\b/);
        if (!m) return null;
        const v = parseFloat(m[2]);
        if (v < 40 || v > 65) return null;
        return m[1] ? `${m[1]} ${m[2]}` : m[2];
      };

      const out = [];
      let lastFrame = 0;

      for (let k = 0; k < starts.length; k++) {
        const s = starts[k];
        const e = (k + 1 < starts.length) ? starts[k + 1] : trs.length;
        const block = trs.slice(s, e);

        // 先頭行：枠・馬・馬名・騎手
        const r0 = block[0];
        const frameEl = r0.querySelector('td.courseNum:not(.waku)');
        let frame_number = frameEl ? Number(frameEl.textContent.trim()) : lastFrame;
        if (!Number.isFinite(frame_number)) frame_number = 0;
        if (frameEl) lastFrame = frame_number;

        const horse_number = Number(r0.querySelector('td.horseNum')?.textContent?.trim());
        const horse_name   = norm(
          r0.querySelector('a.horseName')?.textContent ||
          r0.querySelector('.horseName')?.textContent || ''
        );

        // 騎手・所属
        let jockey = null, affiliation = null;
        const aJ = r0.querySelector('a.jockeyName');
        if (aJ) {
          let name = '';
          aJ.childNodes.forEach(n => { if (n.nodeType === Node.TEXT_NODE) name += n.textContent; });
          jockey = norm(name) || norm(aJ.textContent.replace(/\（[^）]+\）/, '')) || null;
          const area = aJ.querySelector('.jockeyarea');
          affiliation = area ? area.textContent.replace(/[()（）]/g,'').trim() : null;
        }

        // 性齢/毛色/生/斤量 行
        let sex_age = null, hair = null, birthStr = null, burden_weight = null;
        for (const tr of block) {
          const t0 = asText(tr, 0), t1 = asText(tr, 1);
          if (/(牡|牝|騙)\s*\d+/.test(t0) && hairRx.test(t1)) {
            sex_age = t0; hair = t1;
            birthStr = asText(tr, 2);
            burden_weight = weightStr(asText(tr, 3));
            break;
          }
        }
        // 生年(YY)/生月(MM)
        let birthyear = 0, birthymonth = 0;
        const bm = (birthStr || '').match(/(\d{2})\.(\d{2})生/);
        if (bm) birthymonth = Number(bm[1]) || 0;
        const ageM = (sex_age || '').match(/(\d+)/);
        if (ageM) {
          const age = Number(ageM[1]);
          if (Number.isFinite(age)) { birthyear = yy - age; if (birthyear < 0) birthyear += 100; }
        }

        // ---- 血統3行を厳格に抽出 ----
        // 左セルに colspan があり、左テキストが空/ダッシュ/タイムではない。
        // 右セルもタイム/馬場語ではない。
        const geneCands = [];
        for (const tr of block) {
          const leftTd  = tr.querySelector('td[colspan]');
          if (!leftTd) continue;
          const left  = norm(leftTd.innerText);
          const right = norm((tr.querySelector('td[colspan] + td') || tr.querySelectorAll('td')[1])?.innerText || '');
          if (!left || /^[-－]+$/.test(left)) continue;
          if (timeRx.test(left) || timeRx.test(right)) continue;
          if (babaRx.test(right)) continue; // 良/稍重/重/不良 などが混入する行は除外
          geneCands.push({ tr, left, right });
        }

        // 母父（括弧始まり）
        const bmsIdx = geneCands.findIndex(x => /^[（(]/.test(x.left));
        let broodmare_sire = null, breeder = null;
        if (bmsIdx >= 0) {
          const x = geneCands.splice(bmsIdx, 1)[0];
          broodmare_sire = x.left.replace(/^[（(]\s*|\s*[)）]$/g,'').trim() || null;
          breeder = x.right.replace(/^(生産牧場|生産者|生産)[:：]?\s*/,'').trim() || null;
        }

        // 残り2つ → 父/母。TrainerMarkリンクがある方が父（=右が調教師）
        let sire = null, dam = null, trainer = null, owner = null;
        if (geneCands.length >= 2) {
          const candHasTrainer = geneCands.find(x => x.tr.querySelector('a[href*="TrainerMark"]'));
          let sireRow, damRow;
          if (candHasTrainer) {
            sireRow = candHasTrainer;
            damRow  = geneCands.find(x => x !== candHasTrainer);
          } else {
            // ラベルに頼らず出現順で割当（多くのページで 父→母 の順）
            sireRow = geneCands[0];
            damRow  = geneCands[1];
          }
          sire    = sireRow.left || null;
          trainer = sireRow.right.replace(/^調教師[:：]?\s*/,'').replace(/\s*[（(].*?[)）]\s*$/,'').trim() || null;
          dam     = damRow.left || null;
          owner   = damRow.right.replace(/^馬主[:：]?\s*/,'').trim() || null;
        }

        // バリデーション
        if (!Number.isFinite(horse_number) || horse_number < 1) continue;
        if (frame_number < 1 || frame_number > 8) continue;
        if (!horse_name) continue;

        out.push({
          frame_number, horse_number, horse_name,
          sex_age, hair, birthyear, birthymonth,
          sire, dam, broodmare_sire,
          jockey, affiliation, burden_weight,
          trainer, owner, breeder
        });
      }
      return out;
    }, yy);

    if (!rows.length) throw new Error('出馬表の抽出に失敗しました（馬ブロックが見つかりません）');

    // デバッグ（先頭3頭）
    rows.slice(0, 3).forEach(r => {
      console.log(`[sample] #${r.horse_number} ${r.horse_name} / 父:${r.sire} 母:${r.dam} 母父:${r.broodmare_sire} / 調教師:${r.trainer} 馬主:${r.owner} 生産者:${r.breeder}`);
    });

    // ---- DB UPSERT ----
    conn = await mysql.createConnection({
      host: config.mysql.host || 'localhost',
      user: config.mysql.user,
      password: config.mysql.password,
      port: config.mysql.port,
      database: config.mysql.database || 'localkeiba',
      charset: 'utf8mb4'
    });
    await conn.beginTransaction();

    const cols = [
      'race_id','frame_number','horse_number','horse_name','sex_age','hair',
      'birthyear','birthymonth','sire','dam','broodmare_sire',
      'jockey','affiliation','burden_weight','trainer','owner','breeder'
    ];
    const placeholders = rows.map(() => '(' + cols.map(() => '?').join(',') + ')').join(',');
    const params = [];
    rows.forEach(r => {
      params.push(
        race_id, r.frame_number, r.horse_number, r.horse_name, r.sex_age, r.hair,
        r.birthyear, r.birthymonth, r.sire, r.dam, r.broodmare_sire,
        r.jockey, r.affiliation, r.burden_weight, r.trainer, r.owner, r.breeder
      );
    });

    const sql = `
      INSERT INTO racing_form (${cols.join(',')})
      VALUES ${placeholders}
      ON DUPLICATE KEY UPDATE
        frame_number=VALUES(frame_number),
        horse_name=VALUES(horse_name),
        sex_age=VALUES(sex_age),
        hair=VALUES(hair),
        birthyear=VALUES(birthyear),
        birthymonth=VALUES(birthymonth),
        sire=VALUES(sire),
        dam=VALUES(dam),
        broodmare_sire=VALUES(broodmare_sire),
        jockey=VALUES(jockey),
        affiliation=VALUES(affiliation),
        burden_weight=VALUES(burden_weight),
        trainer=VALUES(trainer),
        owner=VALUES(owner),
        breeder=VALUES(breeder),
        updated_at=CURRENT_TIMESTAMP
    `;
    await conn.execute(sql, params);
    await conn.commit();
    await conn.end();

    console.log(`[OK] race_id=${race_id} → upsert ${rows.length} rows`);
  } catch (err) {
    try { if (conn) await conn.rollback(); } catch {}
    console.error('[ERROR]', err && err.message ? err.message : err);
    process.exitCode = 1;
  }
})();
