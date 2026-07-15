'use strict';
const { safeJSON } = require('./page-utils');

// ISO文字列をJST "yyyy/mm/dd hh:mm" に変換
function fmtJst(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  if (isNaN(d.getTime())) return '';
  const j = new Date(d.getTime() + 9 * 3600 * 1000);
  return `${j.getUTCFullYear()}/${String(j.getUTCMonth()+1).padStart(2,'0')}/${String(j.getUTCDate()).padStart(2,'0')} ${String(j.getUTCHours()).padStart(2,'0')}:${String(j.getUTCMinutes()).padStart(2,'0')}`;
}

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

function renderRoiCards(dailyRoi, raceSummary = null) {
  const summaryCard = raceSummary
    ? `<div class="card status ${raceSummary.pending > 0 ? 'partial' : 'complete'}">
        <h3>${raceSummary.pending > 0 ? '途中集計' : '確定済み'}</h3>
        <p class="roi-val">${raceSummary.confirmed}/${raceSummary.total}R</p>
        <p class="roi-detail">未確定 ${raceSummary.pending}R</p>
      </div>`
    : '';
  if (!dailyRoi.length) return `${summaryCard}<p>集計データなし</p>`;
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
        <p class="roi-detail">${quinella.return_yen || 0} / ${quinella.invest_yen || 0}円 (${quinella.races || 0}R確定分)</p>
      </div>` : '';
  return `
    ${summaryCard}
    <div class="card ${Number(single.roi_percent) >= 100 ? 'good' : ''}">
      <h3>単勝</h3>
      <p class="roi-val">${single.roi_percent || '---'}%</p>
      <p class="roi-detail">${single.return_yen || 0} / ${single.invest_yen || 0}円 (${single.races || 0}R確定分)</p>
    </div>
    <div class="card ${Number(place.roi_percent) >= 100 ? 'good' : ''}">
      <h3>複勝</h3>
      <p class="roi-val">${place.roi_percent || '---'}%</p>
      <p class="roi-detail">${place.return_yen || 0} / ${place.invest_yen || 0}円 (${place.races || 0}R確定分)</p>
    </div>
    ${quinellaCard}
    <div class="card total ${totalRoi !== null && totalRoi >= 100 ? 'good' : ''}">
      <h3>合計</h3>
      <p class="roi-val">${totalRoiStr}%</p>
      <p class="roi-detail">${totalReturn} / ${totalInvest}円（確定分）</p>
    </div>
  `;
}

function summarizeRaceStatus(races) {
  const total = races.length;
  const confirmed = races.filter(r => r.win_hit !== null && r.win_hit !== undefined).length;
  return { total, confirmed, pending: Math.max(0, total - confirmed) };
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

  const distStr   = race.distance_m ? `${race.distance_m}m` : '';
  const condStr   = [race.weather, race.track_condition].filter(Boolean).join(' ');
  const condBadge = condStr ? `<span class="baba-cond">${condStr}</span>` : '';
  const updatedAt = fmtJst(memo?.generatedAt);
  const updBadge  = updatedAt ? `<span class="updated-at">更新 ${updatedAt}</span>` : '';

  return `
    <li>
      <a href="${race.race_id}.html" class="race-link ${statusClass}">
        <span class="venue">${venueName} ${parseInt(rr)}R${distStr ? ' ' + distStr : ''}${condBadge}</span>
        <span class="pred">◎ ${best} ${bestName}${updBadge}</span>
        <span class="result-badges">${winBadge}${placeBadge}${quinellaBadge}</span>
      </a>
    </li>
  `;
}

function renderIndexPage({ isoDate, races, dailyRoi, venueMap, cssPath = 'css/style.css', dailyDirs = [] }) {
  let html = htmlHead(`レース一覧 ${isoDate}`, { cssPath });
  html += `<section class="roi-summary"><h2>今日の回収率 (${isoDate})</h2><div class="roi-cards">`;
  html += renderRoiCards(dailyRoi, summarizeRaceStatus(races));
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

  const distStr = race.distance_m ? `${race.distance_m}m ` : '';
  const wxStr   = race.weather        ? `天候: ${race.weather}` : '';
  const tcStr   = race.track_condition ? `馬場: ${race.track_condition}` : '';
  const condParts = [wxStr, tcStr].filter(Boolean);
  const condLine = condParts.length
    ? `<p class="baba-info">${condParts.join(' / ')}</p>`
    : '';

  let html = htmlHead(`${venueName}${parseInt(rr)}R 詳細`, { cssPath });
  html += `
    <div class="breadcrumb"><a href="/index.html">&lt; 一覧へ戻る</a></div>
    <h2>${venueName} ${parseInt(rr)}R ${distStr}(${race.race_id})</h2>
    ${condLine}
    <p class="model-info">Model: ${race.model_version}</p>
  `;
  const predUpdatedAt = fmtJst(memo?.generatedAt);
  const predTitle = predUpdatedAt ? `AI予想(更新日 ${predUpdatedAt})` : 'AI予想';
  html += `<section class="prediction-table"><h3>${predTitle}</h3><table><thead><tr><th>印</th><th>馬番</th><th>馬名</th><th>Score</th></tr></thead><tbody>`;
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

function renderLineChart(dateStats) {
  const entries = Array.from(dateStats.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  const n = entries.length;
  if (n === 0) return '<p>データなし</p>';

  const svgW = 800, svgH = 280;
  const mTop = 30, mRight = 30, mBottom = 45, mLeft = 55;
  const plotW = svgW - mLeft - mRight;
  const plotH = svgH - mTop - mBottom;
  const maxY  = 200;

  const xPos = i  => mLeft + (n === 1 ? plotW / 2 : (i / (n - 1)) * plotW);
  const yPos = v  => mTop + plotH - Math.min(maxY, Math.max(0, Number(v) || 0)) / maxY * plotH;

  function makePath(values, color, dash = '') {
    let d = '', prev = true;
    values.forEach((v, i) => {
      if (v === null) { prev = true; return; }
      const x = xPos(i).toFixed(1), y = yPos(v).toFixed(1);
      d += prev ? `M${x},${y}` : `L${x},${y}`;
      prev = false;
    });
    if (!d) return '';
    const da = dash ? `stroke-dasharray="${dash}"` : '';
    return `<path d="${d}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" ${da}/>`;
  }

  function makeCircles(values, color) {
    return values.map((v, i) => v === null ? '' :
      `<circle cx="${xPos(i).toFixed(1)}" cy="${yPos(v).toFixed(1)}" r="3.5" fill="${color}" stroke="white" stroke-width="1.5"><title>${entries[i][0]}: ${Number(v).toFixed(2)}%</title></circle>`
    ).join('');
  }

  // グリッド線・Y軸ラベル
  let grids = '';
  [0, 50, 100, 150, 200].forEach(y => {
    const yp = yPos(y).toFixed(1);
    const is100 = y === 100;
    grids += `<line x1="${mLeft}" y1="${yp}" x2="${svgW - mRight}" y2="${yp}" stroke="${is100 ? '#e74c3c' : '#e0e0e0'}" stroke-width="${is100 ? 1.5 : 1}" stroke-dasharray="${is100 ? '5,3' : '3,3'}"/>`;
    grids += `<text x="${mLeft - 8}" y="${(Number(yp) + 4).toFixed(1)}" text-anchor="end" font-size="11" fill="${is100 ? '#ff9999' : 'white'}">${y}%</text>`;
  });

  // X軸ラベル（多い場合は間引く）
  const step = Math.ceil(n / 12);
  let xlabels = '';
  entries.forEach(([d], i) => {
    if (i % step === 0 || i === n - 1) {
      xlabels += `<text x="${xPos(i).toFixed(1)}" y="${svgH - mBottom + 18}" text-anchor="middle" font-size="10" fill="white">${d.slice(5)}</text>`;
    }
  });

  // 凡例
  const legend = [
    { color: '#3498db', label: '単勝', dash: '' },
    { color: '#27ae60', label: '複勝', dash: '' },
    { color: '#e67e22', label: '馬複4頭', dash: '5,3' },
  ].map((l, i) => {
    const lx = mLeft + i * 80;
    const da = l.dash ? `stroke-dasharray="${l.dash}"` : '';
    return `<line x1="${lx}" y1="14" x2="${lx + 20}" y2="14" stroke="${l.color}" stroke-width="2.5" ${da}/>` +
           `<circle cx="${lx + 10}" cy="14" r="3" fill="${l.color}"/>` +
           `<text x="${lx + 25}" y="18" font-size="11" fill="white">${l.label}</text>`;
  }).join('');

  const singles   = entries.map(([, st]) => st['single']?.roi_percent   ?? null);
  const places    = entries.map(([, st]) => st['place']?.roi_percent    ?? null);
  const quinellas = entries.map(([, st]) => st['quinella']?.roi_percent ?? null);

  return `<svg viewBox="0 0 ${svgW} ${svgH}" style="width:100%;height:320px;display:block;overflow:visible;">
    ${grids}
    <line x1="${mLeft}" y1="${mTop}" x2="${mLeft}" y2="${mTop + plotH}" stroke="#ccc" stroke-width="1"/>
    ${makePath(singles,   '#3498db')}
    ${makePath(places,    '#27ae60')}
    ${makePath(quinellas, '#e67e22', '5,3')}
    ${makeCircles(singles,   '#3498db')}
    ${makeCircles(places,    '#27ae60')}
    ${makeCircles(quinellas, '#e67e22')}
    ${xlabels}
    <g transform="translate(${mLeft},0)">${legend}</g>
  </svg>`;
}

function renderRecoveryPage({ isoDate, dateStats, cssPath = 'css/style.css' }) {
  let html = htmlHead(`回収率推移`, { cssPath });
  html += `<h2>直近30日の回収率推移</h2>`;
  html += renderLineChart(dateStats);
  html += `<p style="font-size:0.8em;text-align:right;color:#888;">─ 100%ライン（赤破線）以上が黒字</p>`;
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
