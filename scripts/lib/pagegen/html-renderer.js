'use strict';
const { safeJSON } = require('./page-utils');

function htmlHead(title, opts = {}) {
  return `
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
      <a href="/privacy-policy.html">プライバシーポリシー</a>
      &nbsp;|&nbsp;
      <a href="/contact.html">お問い合わせ</a>
    </nav>
  </div>
</header>
<main class="container">
`;
}

function htmlFoot() {
  return `
</main>
<footer>
  <div class="container">
    <p>&copy; けんちゃん馬券☆WEB （地方競馬）2026</p>
    <p>
      <a href="/terms.html">ご利用規約</a>
      &nbsp;|&nbsp;
      <a href="/privacy-policy.html">プライバシーポリシー</a>
      &nbsp;|&nbsp;
      <a href="/contact.html">お問い合わせ</a>
    </p>
  </div>
</footer>
<script>
(function () {
  var topUrl = new URL('/index.html', window.location.origin).toString();
  document.querySelectorAll('a[href="/index.html"], a[href="index.html"], a[data-top-link="1"]').forEach(function (a) {
    a.setAttribute('href', topUrl);
    a.setAttribute('data-top-link', '1');
  });
})();
</script>
</body>
</html>
`;
}

function renderRoiCards(dailyRoi) {
  if (!dailyRoi.length) return `<p>集計データなし</p>`;
  const single   = dailyRoi.find(d => d.strategy === 'single')   || {};
  const place    = dailyRoi.find(d => d.strategy === 'place')    || {};
  const quinella = dailyRoi.find(d => d.strategy === 'quinella') || {};
  const totalInvest = (Number(single.invest_yen) || 0) + (Number(place.invest_yen) || 0) + (Number(quinella.invest_yen) || 0);
  const totalReturn = (Number(single.return_yen) || 0) + (Number(place.return_yen) || 0) + (Number(quinella.return_yen) || 0);
  const totalRoi    = totalInvest > 0 ? Math.round(totalReturn / totalInvest * 10000) / 100 : null;
  const totalRoiStr = totalRoi !== null ? totalRoi.toFixed(2) : '---';
  const quinellaCard = quinella.races
    ? `<div class="card ${Number(quinella.roi_percent) >= 100 ? 'good' : ''}">
        <h3>馬複4頭</h3>
        <p class="roi-val">${quinella.roi_percent || '---'}%</p>
        <p class="roi-detail">${quinella.return_yen || 0} / ${quinella.invest_yen || 0}円 (${quinella.races || 0}R)</p>
      </div>` : '';
  return `
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
    ${quinellaCard}
    <div class="card total ${totalRoi !== null && totalRoi >= 100 ? 'good' : ''}">
      <h3>合計</h3>
      <p class="roi-val">${totalRoiStr}%</p>
      <p class="roi-detail">${totalReturn} / ${totalInvest}円</p>
    </div>
  `;
}

function renderRaceListItem(race, venueMap) {
  const memo      = safeJSON(race.memo);
  const venueCode = race.race_id.slice(10, 12);
  const rr        = race.race_id.slice(8, 10);
  const venueName = venueMap.get(venueCode) || `Venue${venueCode}`;
  const best      = memo?.best?.horse_number || '-';
  const bestName  = memo?.best?.horse_name   || '';

  let statusClass = 'pending';
  if (race.win_hit === 1) statusClass = 'win';
  else if (race.place_hit === 1) statusClass = 'place-hit';
  else if (race.win_hit === 0)   statusClass = 'lose';

  const winBadge = race.win_hit === null
    ? `<span class="result-badge pending">単勝: 未確定</span>`
    : race.win_hit
      ? `<span class="result-badge hit">単勝: 的中🎯 (利益: ${race.eval_win_return || 0} YEN)</span>`
      : `<span class="result-badge miss">単勝: 不的中 (利益: 0 YEN)</span>`;

  const placeBadge = race.place_hit === null
    ? `<span class="result-badge pending">複勝: 未確定</span>`
    : race.place_hit
      ? `<span class="result-badge hit">複勝: 的中🎯 (利益: ${race.eval_place_return || 0} YEN)</span>`
      : `<span class="result-badge miss">複勝: 不的中 (利益: 0 YEN)</span>`;

  const quinellaBadge = race.quinella_hit === null || race.quinella_hit === undefined
    ? ''
    : race.quinella_hit
      ? `<span class="result-badge hit">馬複: 的中🎯 (利益: ${race.eval_quinella_return || 0} YEN)</span>`
      : `<span class="result-badge miss">馬複: 不的中</span>`;

  return `
    <li>
      <a href="${race.race_id}.html" class="race-link ${statusClass}">
        <span class="venue">${venueName} ${parseInt(rr)}R</span>
        <span class="pred">◎ ${best} ${bestName}</span>
        <span class="result-badges">${winBadge}${placeBadge}${quinellaBadge}</span>
      </a>
    </li>
  `;
}

function renderIndexPage({ isoDate, races, dailyRoi, venueMap, cssPath = 'css/style.css', dailyDirs = [] }) {
  let html = htmlHead(`レース一覧 ${isoDate}`, { cssPath });
  html += `<section class="roi-summary"><h2>今日の回収率 (${isoDate})</h2><div class="roi-cards">`;
  html += renderRoiCards(dailyRoi);
  html += `</div></section>`;
  html += `<section class="race-list"><h2>レース一覧 (${races.length}件)</h2><ul>`;
  for (const r of races) html += renderRaceListItem(r, venueMap);
  html += `</ul></section>`;
  if (dailyDirs.length > 0) {
    html += `<section class="race-list"><h2>日次アーカイブ (最大30日)</h2><ul>`;
    for (const d of dailyDirs) {
      const label = `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
      html += `<li><a class="race-link" href="daily/${d}/index.html"><span class="venue">${label}</span><span class="pred">一覧ページ</span></a></li>`;
    }
    html += `</ul></section>`;
  }
  html += htmlFoot();
  return html;
}

function renderDetailPage({ race, venueMap, cssPath = 'css/style.css' }) {
  const memo      = safeJSON(race.memo);
  const items     = Array.isArray(memo?.items) ? memo.items : [];
  const venueCode = race.race_id.slice(10, 12);
  const rr        = race.race_id.slice(8, 10);
  const venueName = venueMap.get(venueCode) || `Venue${venueCode}`;

  let html = htmlHead(`${venueName}${parseInt(rr)}R 詳細`, { cssPath });
  html += `
    <div class="breadcrumb"><a href="/index.html">&lt; 一覧へ戻る</a></div>
    <h2>${venueName} ${parseInt(rr)}R (${race.race_id})</h2>
    <p class="model-info">Model: ${race.model_version}</p>
  `;
  html += `<section class="prediction-table"><h3>AI予想</h3><table><thead><tr><th>印</th><th>馬番</th><th>馬名</th><th>Score</th></tr></thead><tbody>`;
  if (items.length > 0) {
    items.sort((a, b) => (b.score || 0) - (a.score || 0));
    for (let i = 0; i < Math.min(5, items.length); i++) {
      const item = items[i];
      const mark = i === 0 ? '◎' : '○';
      html += `<tr><td>${mark}</td><td>${item.horse_number}</td><td>${item.horse_name || ''}</td><td>${Number(item.score).toFixed(4)}</td></tr>`;
    }
  } else {
    const best = memo?.best || {};
    html += `<tr><td>◎</td><td>${best.horse_number || '?'}</td><td>${best.horse_name || ''}</td><td>-</td></tr>`;
  }
  html += `</tbody></table></section>`;
  if (race.win_hit !== null) {
    // 馬複top4の表示（memo.itemsから上位4頭を取得）
    const top4 = items.length >= 2
      ? [...items].sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, 4).map(i => i.horse_number)
      : [];
    const quinellaRow = top4.length >= 2
      ? `<dt>馬複4頭</dt><dd>対象: ${top4.join('・')}番 ${race.quinella_hit ? '<span class="win">的中🎯</span>' : '不的中'} (利益: ${race.eval_quinella_return || 0} YEN)</dd>`
      : '';
    html += `<section class="result-info"><h3>結果</h3>
      <dl>
        <dt>単勝</dt><dd>${race.win_hit ? '<span class="win">的中🎯</span>' : '不的中'} (利益: ${race.eval_win_return || 0} YEN)</dd>
        <dt>複勝</dt><dd>${race.place_hit ? '<span class="win">的中🎯</span>' : '不的中'} (利益: ${race.eval_place_return || 0} YEN)</dd>
        ${quinellaRow}
      </dl>
    </section>`;
  }
  html += htmlFoot();
  return html;
}

function renderRecoveryPage({ isoDate, dateStats, cssPath = 'css/style.css' }) {
  let html = htmlHead(`回収率推移`, { cssPath });
  html += `<h2>直近30日の回収率推移</h2><div class="chart-container">`;
  for (const [d, st] of dateStats) {
    const sVal = Math.round(Math.min(200, st['single'] ? Number(st['single'].roi_percent) : 0));
    const pVal = Math.round(Math.min(200, st['place']  ? Number(st['place'].roi_percent)  : 0));
    html += `
      <div class="chart-bar-group">
        <div class="bars">
          <div class="bar single" style="height: ${sVal}px" title="単: ${st['single']?.roi_percent}%"></div>
          <div class="bar place" style="height: ${pVal}px" title="複: ${st['place']?.roi_percent}%"></div>
        </div>
        <div class="label">${d.slice(5)}</div>
      </div>
    `;
  }
  html += `</div><p style="font-size:0.8em; text-align:right;">※グラフは最大200%で表示</p>`;
  html += `<table class="recovery-table"><thead><tr><th>日付</th><th>単勝ROI</th><th>複勝ROI</th><th>馬複4頭ROI</th><th>合計ROI</th><th>投資合計</th></tr></thead><tbody>`;
  for (const d of Array.from(dateStats.keys()).sort().reverse()) {
    const st = dateStats.get(d);
    const s = st['single'], p = st['place'], q = st['quinella'];
    const tInvest = (Number(s?.invest_yen) || 0) + (Number(p?.invest_yen) || 0) + (Number(q?.invest_yen) || 0);
    const tReturn = (Number(s?.return_yen) || 0) + (Number(p?.return_yen) || 0) + (Number(q?.return_yen) || 0);
    const tRoi    = tInvest > 0 ? (Math.round(tReturn / tInvest * 10000) / 100).toFixed(2) : '-';
    html += `
      <tr>
        <td>${d}</td>
        <td class="${(Number(s?.roi_percent) || 0) >= 100 ? 'win' : ''}">${s?.roi_percent || '-'}%</td>
        <td class="${(Number(p?.roi_percent) || 0) >= 100 ? 'win' : ''}">${p?.roi_percent || '-'}%</td>
        <td class="${(Number(q?.roi_percent) || 0) >= 100 ? 'win' : ''}">${q?.roi_percent || '-'}%</td>
        <td class="${tInvest > 0 && Number(tRoi) >= 100 ? 'win' : ''}">${tRoi}%</td>
        <td>${tInvest || 0}円</td>
      </tr>
    `;
  }
  html += `</tbody></table>`;
  html += htmlFoot();
  return html;
}

module.exports = { htmlHead, htmlFoot, renderIndexPage, renderDetailPage, renderRecoveryPage };
