#!/usr/bin/env node
/**
 * @file    generate-daily-pages.js
 * @pipeline [5/5 夜バッチ最終] 静的HTML生成 + 古ファイル削除
 * @role    DB の prediction・race_results・prediction_roi_daily 等を読み込んで
 *          テンプレートリテラルで静的 HTML を生成し public/ へ書き出す。
 *          config.htmlRetentionDays 日以前のファイルを purgeOldFiles() で自動削除する。
 *
 * @input   DB: prediction, race_results, race_payouts, prediction_eval,
 *              prediction_roi_daily, racing_form, venue_master
 * @output  ファイル:
 *            public/index.html          — トップページ（当日レース一覧）
 *            public/recovery.html       — 回収率ページ
 *            public/YYYYMMDDRRBB.html   — 個別レースページ（ルート直置き・最新用）
 *            public/daily/YYYYMMDD/     — 日別アーカイブフォルダ
 * @calledby daily-result-batch.js [5] / 手動実行も可
 *
 * サイト情報:
 *   H1: けんちゃん馬券☆WEB（地方競馬）
 *   サブタイトル: - 恥ずかしい馬券 - 矛盾にあふれる人間の発想とロジカルなAIがぶつかり合ったものです
 *
 * Usage:
 *   node scripts/generate-daily-pages.js [YYYYMMDD] [model_version]
 *
 * @copyright © 2026 IchikabuImpact
 * @license Commercial use prohibited without permission.
 */

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const config = require('../config/config.js');

const jstTodayYmd = () => {
  const jst = new Date(Date.now() + 9 * 3600 * 1000);
  const y = jst.getUTCFullYear();
  const m = String(jst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(jst.getUTCDate()).padStart(2, '0');
  return `${y}${m}${d}`;
};

const ymdArg = process.argv[2] || jstTodayYmd();
const modelArg = process.argv[3] || null;

if (!/^\d{8}$/.test(ymdArg)) {
  console.error('Usage: node scripts/generate-daily-pages.js [YYYYMMDD] [model_version]');
  process.exit(1);
}

const PUBLIC_DIR = path.resolve(__dirname, '../public');
const DAILY_DIR = path.join(PUBLIC_DIR, 'daily');
const isoDate = `${ymdArg.slice(0, 4)}-${ymdArg.slice(4, 6)}-${ymdArg.slice(6, 8)}`;
const currentDailyDir = path.join(DAILY_DIR, ymdArg);

if (!fs.existsSync(DAILY_DIR)) fs.mkdirSync(DAILY_DIR, { recursive: true });
if (!fs.existsSync(currentDailyDir)) fs.mkdirSync(currentDailyDir, { recursive: true });

// HTML Helpers
const htmlHead = (title, opts = {}) => `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="stylesheet" href="${opts.cssPath || 'css/style.css'}">
  ${opts.meta || ''}
</head>
<body>
<header>
  <div class="container">
    <h1><a href="/index.html">けんちゃん馬券☆WEB（地方競馬）</a></h1>
    <p class="site-subtitle"> - 恥ずかしい馬券 - 矛盾にあふれる人間の発想とロジカルなAIがぶつかり合ったものです</p>
    <nav>
      <a href="/index.html">一覧</a>
      <a href="/recovery.html">回収率</a>
      <a href="/terms.html">ご利用規約</a>
    </nav>
  </div>
</header>
<main class="container">
`;

const htmlFoot = () => `
</main>
<footer>
  <div class="container">
    <p>&copy; けんちゃん馬券☆WEB （地方競馬）2026</p>
    <p>
      <a href="/terms.html">ご利用規約</a>
      &nbsp;|&nbsp;
      <a href="/privacy-policy.html">プライバシーポリシー</a>
    </p>
  </div>
</footer>
</body>
</html>
`;

function safeJSON(raw) {
  if (!raw) return null;
  if (typeof raw === 'string') { try { return JSON.parse(raw); } catch { return null; } }
  if (Buffer.isBuffer(raw)) { try { return JSON.parse(raw.toString('utf8')); } catch { return null; } }
  return raw;
}

function buildCutoffYmd(days = 30) {
  const base = new Date(Date.UTC(
    Number(ymdArg.slice(0, 4)),
    Number(ymdArg.slice(4, 6)) - 1,
    Number(ymdArg.slice(6, 8)),
    0, 0, 0
  ));
  base.setUTCDate(base.getUTCDate() - days);
  const y = base.getUTCFullYear();
  const m = String(base.getUTCMonth() + 1).padStart(2, '0');
  const d = String(base.getUTCDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

function purgeOldFiles() {
  const retentionDays = Number(config.htmlRetentionDays) || 30;
  const cutoff = buildCutoffYmd(retentionDays);

  // 1. daily/YYYYMMDD/ フォルダを削除
  if (fs.existsSync(DAILY_DIR)) {
    const dirs = fs.readdirSync(DAILY_DIR, { withFileTypes: true });
    for (const dirent of dirs) {
      if (!dirent.isDirectory()) continue;
      if (!/^\d{8}$/.test(dirent.name)) continue;
      if (dirent.name < cutoff) {
        fs.rmSync(path.join(DAILY_DIR, dirent.name), { recursive: true, force: true });
        console.log(`[CLEAN] removed daily/${dirent.name}/`);
      }
    }
  }

  // 2. public/ 直下の YYYYMMDDRRBB.html を削除
  const files = fs.readdirSync(PUBLIC_DIR);
  for (const file of files) {
    if (!/^\d{12}\.html$/.test(file)) continue;
    const fileYmd = file.slice(0, 8);
    if (fileYmd < cutoff) {
      fs.rmSync(path.join(PUBLIC_DIR, file), { force: true });
      console.log(`[CLEAN] removed ${file}`);
    }
  }
}

(async () => {
  let conn;
  try {
    conn = await mysql.createConnection(config.mysql);

    // 0. マスタ類
    const [venues] = await conn.execute(`SELECT baba_code, venue FROM venue_master`);
    const venueMap = new Map(venues.map(v => [String(v.baba_code).padStart(2, '0'), v.venue]));
    // 補完コード (NAR仕様)
    venueMap.set('10', '盛岡'); venueMap.set('11', '水沢'); venueMap.set('18', '浦和');
    venueMap.set('19', '船橋'); venueMap.set('20', '大井'); venueMap.set('21', '川崎');
    venueMap.set('22', '金沢'); venueMap.set('23', '笠松'); venueMap.set('24', '名古屋');
    venueMap.set('27', '園田'); venueMap.set('28', '姫路'); venueMap.set('31', '高知');
    venueMap.set('32', '佐賀'); venueMap.set('36', '門別');
    venueMap.set('03', '帯広');

    // 1. 今日のROI
    const [dailyRoi] = await conn.execute(`
      SELECT * FROM prediction_roi_daily
      WHERE ymd = ?
    `, [isoDate]);

    // 2. レース一覧 & 予想 & 結果
    const [rows] = await conn.execute(`
      SELECT 
        CAST(p.race_id AS CHAR) as race_id, p.model_version, p.memo, p.created_at,
        r.official_finish_position, r.horse_number as win_horse_number,
        r.win_payout,
        eval.win_hit, eval.win_payout as eval_win_return,
        eval.place_hit, eval.place_payout as eval_place_return
      FROM prediction p
      LEFT JOIN (
        -- 結果 (1着馬の情報だけ簡易結合、または代表情報)
        -- ここでは簡単のため race_results の特定情報は詳細取得時にやるとして、
        -- 一覧用には eval テーブルがあればそれを使うのが早い
        SELECT race_id, model_version, win_hit, win_payout, place_hit, place_payout 
        FROM prediction_eval
      ) eval ON p.race_id = eval.race_id AND p.model_version = eval.model_version
      LEFT JOIN (
        -- 1着馬情報（簡易）
        SELECT race_id, horse_number, official_finish_position, odds_final as win_payout 
        FROM race_results WHERE official_finish_position = 1 LIMIT 1
      ) r ON p.race_id = r.race_id
      WHERE LEFT(p.race_id, 8) = ?
      ORDER BY p.race_id ASC
    `, [ymdArg]);

    // model_version フィルタと最新化
    // 同じレースIDで複数モデルがある場合、modelArgがあればそれ、なければ最新を採用
    const raceMap = new Map();
    for (const r of rows) {
      if (modelArg && r.model_version !== modelArg) continue;
      // 既存より新しければ採用
      if (!raceMap.has(r.race_id) || new Date(r.created_at) > new Date(raceMap.get(r.race_id).created_at)) {
        raceMap.set(r.race_id, r);
      }
    }
    const races = Array.from(raceMap.values()).sort((a, b) => {
      const sA = String(a.race_id);
      const sB = String(b.race_id);
      const vA = sA.slice(10, 12);
      const vB = sB.slice(10, 12);
      if (vA !== vB) return vA.localeCompare(vB);
      return sA.slice(8, 10).localeCompare(sB.slice(8, 10));
    });

    // ==========================================
    // 1. INDEX HTML
    // ==========================================
    let indexHtml = htmlHead(`レース一覧 ${isoDate}`);
    let indexHtmlDaily = htmlHead(`レース一覧 ${isoDate}`, {
      cssPath: '../../css/style.css',
      indexPath: 'index.html',
      recoveryPath: 'recovery.html'
    });

    // ROI Header
    indexHtml += `<section class="roi-summary"><h2>今日の回収率 (${isoDate})</h2><div class="roi-cards">`;
    indexHtmlDaily += `<section class="roi-summary"><h2>今日の回収率 (${isoDate})</h2><div class="roi-cards">`;
    if (dailyRoi.length) {
      const single = dailyRoi.find(d => d.strategy === 'single') || {};
      const place  = dailyRoi.find(d => d.strategy === 'place')  || {};

      // 単勝+複勝 合計
      const totalInvest = (Number(single.invest_yen) || 0) + (Number(place.invest_yen) || 0);
      const totalReturn = (Number(single.return_yen) || 0) + (Number(place.return_yen) || 0);
      const totalRoi    = totalInvest > 0
        ? Math.round(totalReturn / totalInvest * 10000) / 100
        : null;
      const totalRoiStr = totalRoi !== null ? totalRoi.toFixed(2) : '---';

      const roiCards = `
        <div class="card ${Number(single.roi_percent) >= 100 ? 'good' : ''}">
          <h3>単勝</h3>
          <p class="roi-val">${single.roi_percent || '---'}%</p>
          <p class="roi-detail">${single.return_yen || 0} / ${single.invest_yen || 0}円 (${single.races || 0}R)</p>
        </div>
        <div class="card ${Number(place.roi_percent) >= 100 ? 'good' : ''}">
          <h3>複勝</h3>
          <p class="roi-val">${place.roi_percent || '---'}%</p>
          <p class="roi-detail">${place.return_yen || 0} / ${place.invest_yen || 0}円 (${place.races || 0}R)</p>
        </div>
        <div class="card total ${totalRoi !== null && totalRoi >= 100 ? 'good' : ''}">
          <h3>合計</h3>
          <p class="roi-val">${totalRoiStr}%</p>
          <p class="roi-detail">${totalReturn} / ${totalInvest}円 (${single.races || 0}R)</p>
        </div>
      `;
      indexHtml += roiCards;
      indexHtmlDaily += roiCards;
    } else {
      indexHtml += `<p>集計データなし</p>`;
      indexHtmlDaily += `<p>集計データなし</p>`;
    }
    indexHtml += `</div></section>`;
    indexHtmlDaily += `</div></section>`;

    // Race List
    indexHtml += `<section class="race-list"><h2>レース一覧 (${races.length}件)</h2><ul>`;
    indexHtmlDaily += `<section class="race-list"><h2>レース一覧 (${races.length}件)</h2><ul>`;
    for (const r of races) {
      const memo = safeJSON(r.memo);
      const venueCode = r.race_id.slice(10, 12); // 末尾2桁
      const rr = r.race_id.slice(8, 10);
      const venueName = venueMap.get(venueCode) || `Venue${venueCode}`;

      const best = memo?.best?.horse_number || '-';
      const bestName = memo?.best?.horse_name || '';

      let statusClass = 'pending';
      if (r.win_hit === 1) {
        statusClass = 'win';
      } else if (r.place_hit === 1) {
        statusClass = 'place-hit'; // 複勝のみ的中
      } else if (r.win_hit === 0) {
        statusClass = 'lose'; // 結果確定・両外れ
      }

      const winBadge = r.win_hit === null
        ? `<span class="result-badge pending">単勝: 未確定</span>`
        : r.win_hit
          ? `<span class="result-badge hit">単勝: 的中🎯 (利益: ${r.eval_win_return || 0} YEN)</span>`
          : `<span class="result-badge miss">単勝: 不的中 (利益: 0 YEN)</span>`;

      const placeBadge = r.place_hit === null
        ? `<span class="result-badge pending">複勝: 未確定</span>`
        : r.place_hit
          ? `<span class="result-badge hit">複勝: 的中🎯 (利益: ${r.eval_place_return || 0} YEN)</span>`
          : `<span class="result-badge miss">複勝: 不的中 (利益: 0 YEN)</span>`;

      const raceItem = `
        <li>
          <a href="${r.race_id}.html" class="race-link ${statusClass}">
            <span class="venue">${venueName} ${parseInt(rr)}R</span>
            <span class="pred">◎ ${best} ${bestName}</span>
            <span class="result-badges">${winBadge}${placeBadge}</span>
          </a>
        </li>
      `;
      indexHtml += raceItem;
      indexHtmlDaily += raceItem;
    }
    indexHtml += `</ul></section>`;
    indexHtmlDaily += `</ul></section>`;

    const dailyDirs = fs.readdirSync(DAILY_DIR, { withFileTypes: true })
      .filter(d => d.isDirectory() && /^\d{8}$/.test(d.name))
      .map(d => d.name)
      .sort()
      .reverse()
      .slice(0, 30);
    if (dailyDirs.length > 0) {
      indexHtml += `<section class="race-list"><h2>日次アーカイブ (最大30日)</h2><ul>`;
      for (const d of dailyDirs) {
        const label = `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
        indexHtml += `<li><a class="race-link" href="daily/${d}/index.html"><span class="venue">${label}</span><span class="pred">一覧ページ</span></a></li>`;
      }
      indexHtml += `</ul></section>`;
    }

    indexHtml += htmlFoot();
    indexHtmlDaily += htmlFoot();
    fs.writeFileSync(path.join(PUBLIC_DIR, 'index.html'), indexHtml, 'utf8');
    fs.writeFileSync(path.join(currentDailyDir, 'index.html'), indexHtmlDaily, 'utf8');
    console.log('[GEN] index.html');


    // ==========================================
    // 2. DETAIL HTML (Each Race)
    // ==========================================
    for (const r of races) {
      const memo = safeJSON(r.memo);
      const items = Array.isArray(memo?.items) ? memo.items : [];
      const venueCode = r.race_id.slice(10, 12);
      const rr = r.race_id.slice(8, 10);
      const venueName = venueMap.get(venueCode) || `Venue${venueCode}`;

      let detailHtml = htmlHead(`${venueName}${parseInt(rr)}R 詳細`);
      let detailHtmlDaily = htmlHead(`${venueName}${parseInt(rr)}R 詳細`, {
        cssPath: '../../css/style.css',
        indexPath: 'index.html',
        recoveryPath: 'recovery.html'
      });
      const detailHeader = `
        <div class="breadcrumb"><a href="index.html">&lt; 一覧へ戻る</a></div>
        <h2>${venueName} ${parseInt(rr)}R (${r.race_id})</h2>
        <p class="model-info">Model: ${r.model_version}</p>
      `;
      detailHtml += detailHeader;
      detailHtmlDaily += detailHeader;

      // 予想テーブル
      detailHtml += `<section class="prediction-table"><h3>AI予想</h3><table><thead><tr><th>印</th><th>馬番</th><th>馬名</th><th>Score</th></tr></thead><tbody>`;
      detailHtmlDaily += `<section class="prediction-table"><h3>AI予想</h3><table><thead><tr><th>印</th><th>馬番</th><th>馬名</th><th>Score</th></tr></thead><tbody>`;
      // memo.items があればそれを表示、なければ best だけ
      if (items.length > 0) {
        // ソート: score降順
        items.sort((a, b) => (b.score || 0) - (a.score || 0));
        let idx = 0;
        for (const item of items) {
          const mark = idx === 0 ? '◎' : idx < 5 ? '○' : '';
          const rowHtml = `<tr><td>${mark}</td><td>${item.horse_number}</td><td>${item.horse_name || ''}</td><td>${Number(item.score).toFixed(4)}</td></tr>`;
          detailHtml += rowHtml;
          detailHtmlDaily += rowHtml;
          idx++;
          if (idx >= 5) break; // 上位5頭
        }
      } else {
        const best = memo?.best || {};
        const fallbackRow = `<tr><td>◎</td><td>${best.horse_number || '?'}</td><td>${best.horse_name || ''}</td><td>-</td></tr>`;
        detailHtml += fallbackRow;
        detailHtmlDaily += fallbackRow;
      }
      detailHtml += `</tbody></table></section>`;
      detailHtmlDaily += `</tbody></table></section>`;

      // 結果 (もしあれば)
      if (r.win_hit !== null) {
        const resultSection = `<section class="result-info"><h3>結果</h3>
           <dl>
             <dt>単勝</dt><dd>${r.win_hit ? '<span class="win">的中🎯</span>' : '不的中'} (利益: ${r.eval_win_return || 0} YEN)</dd>
             <dt>複勝</dt><dd>${r.place_hit ? '<span class="win">的中🎯</span>' : '不的中'} (利益: ${r.eval_place_return || 0} YEN)</dd>
           </dl>
         </section>`;
        detailHtml += resultSection;
        detailHtmlDaily += resultSection;
      }

      detailHtml += htmlFoot();
      detailHtmlDaily += htmlFoot();
      fs.writeFileSync(path.join(PUBLIC_DIR, `${r.race_id}.html`), detailHtml, 'utf8');
      fs.writeFileSync(path.join(currentDailyDir, `${r.race_id}.html`), detailHtmlDaily, 'utf8');
    }
    console.log(`[GEN] ${races.length} race pages`);


    // ==========================================
    // 3. RECOVERY HTML (Chart)
    // ==========================================
    // 直近30日
    const [stats] = await conn.execute(`
      SELECT ymd, strategy, roi_percent, invest_yen, return_yen
      FROM prediction_roi_daily
      WHERE ymd >= DATE_SUB(?, INTERVAL 30 DAY)
      ORDER BY ymd ASC, strategy DESC
    `, [isoDate]);

    // 日付ごとのまとめ
    const dateStats = new Map();
    for (const s of stats) {
      const dStr = s.ymd instanceof Date ? s.ymd.toISOString().slice(0, 10) : String(s.ymd);
      if (!dateStats.has(dStr)) dateStats.set(dStr, {});
      dateStats.get(dStr)[s.strategy] = s;
    }

    let recHtml = htmlHead(`回収率推移`);
    let recHtmlDaily = htmlHead(`回収率推移`, {
      cssPath: '../../css/style.css',
      indexPath: 'index.html',
      recoveryPath: 'recovery.html'
    });
    recHtml += `<h2>直近30日の回収率推移</h2>`;
    recHtmlDaily += `<h2>直近30日の回収率推移</h2>`;

    // グラフ (CSS Bar Chart)
    recHtml += `<div class="chart-container">`;
    recHtmlDaily += `<div class="chart-container">`;
    for (const [d, st] of dateStats) {
      const sVal = st['single'] ? Math.min(200, Number(st['single'].roi_percent)) : 0; // 最大200%でキャップ表示
      const pVal = st['place'] ? Math.min(200, Number(st['place'].roi_percent)) : 0;
      const label = d.slice(5); // MM-DD

      const bar = `
        <div class="chart-bar-group">
          <div class="bars">
            <div class="bar single" style="height: ${sVal / 2}%" title="単: ${st['single']?.roi_percent}%"></div>
            <div class="bar place" style="height: ${pVal / 2}%" title="複: ${st['place']?.roi_percent}%"></div>
          </div>
          <div class="label">${label}</div>
        </div>
      `;
      recHtml += bar;
      recHtmlDaily += bar;
    }
    recHtml += `</div>`;
    recHtmlDaily += `</div>`;
    recHtml += `<p style="font-size:0.8em; text-align:right;">※グラフは最大200%で表示</p>`;
    recHtmlDaily += `<p style="font-size:0.8em; text-align:right;">※グラフは最大200%で表示</p>`;

    // テーブル（合計ROI列を追加）
    recHtml += `<table class="recovery-table"><thead><tr><th>日付</th><th>単勝ROI</th><th>複勝ROI</th><th>合計ROI</th><th>投資合計</th></tr></thead><tbody>`;
    recHtmlDaily += `<table class="recovery-table"><thead><tr><th>日付</th><th>単勝ROI</th><th>複勝ROI</th><th>合計ROI</th><th>投資合計</th></tr></thead><tbody>`;
    // 新しい順に表示
    const sortedKeys = Array.from(dateStats.keys()).sort().reverse();
    for (const d of sortedKeys) {
      const st = dateStats.get(d);
      const s = st['single'];
      const p = st['place'];
      const tInvest = (Number(s?.invest_yen) || 0) + (Number(p?.invest_yen) || 0);
      const tReturn = (Number(s?.return_yen) || 0) + (Number(p?.return_yen) || 0);
      const tRoi    = tInvest > 0 ? (Math.round(tReturn / tInvest * 10000) / 100).toFixed(2) : '-';
      const tr = `
        <tr>
          <td>${d}</td>
          <td class="${(Number(s?.roi_percent) || 0) >= 100 ? 'win' : ''}">${s?.roi_percent || '-'}%</td>
          <td class="${(Number(p?.roi_percent) || 0) >= 100 ? 'win' : ''}">${p?.roi_percent || '-'}%</td>
          <td class="${tInvest > 0 && Number(tRoi) >= 100 ? 'win' : ''}">${tRoi}%</td>
          <td>${tInvest || 0}円</td>
        </tr>
      `;
      recHtml += tr;
      recHtmlDaily += tr;
    }
    recHtml += `</tbody></table>`;
    recHtmlDaily += `</tbody></table>`;
    recHtml += htmlFoot();
    recHtmlDaily += htmlFoot();
    fs.writeFileSync(path.join(PUBLIC_DIR, 'recovery.html'), recHtml, 'utf8');
    fs.writeFileSync(path.join(currentDailyDir, 'recovery.html'), recHtmlDaily, 'utf8');
    console.log('[GEN] recovery.html');
    purgeOldFiles();

  } catch (e) {
    console.error('[FATAL]', e);
    process.exit(1);
  } finally {
    if (conn) await conn.end();
  }
})();
