#!/usr/bin/env node
/**
 * @file    generate-daily-pages.js
 * @pipeline [5/5 夜バッチ最終] 静的HTML生成 + 古ファイル削除
 *
 * Usage:
 *   node scripts/generate-daily-pages.js [YYYYMMDD] [model_version]
 */
'use strict';

const fs   = require('fs');
const path = require('path');
const config = require('../config/config.js');
const { createPool } = require('./lib/db/pool-factory');
const { jstTodayYmd } = require('./lib/shared/date-utils');
const { buildCutoffYmdFromBaseYmd, stripMergeConflictMarkers } = require('./lib/pagegen/page-utils');
const { loadVenueMap, loadDailyRoi, loadRaces, loadRoiStats, loadRoiSummary } = require('./lib/pagegen/page-query-service');
const { renderIndexPage, renderDetailPage, renderRecoveryPage } = require('./lib/pagegen/html-renderer');
const { writeSitemap } = require('./lib/seo/sitemap-generator');
const { loadPosts } = require('./lib/blog/blog-post-loader');
const { renderBlogTeaser } = require('./lib/blog/blog-html-renderer');

const CONTENT_BLOG_DIR = path.resolve(__dirname, '../content/blog');

// ブログ記事(content/blog/*.md)を読んで最新1件のティザーHTMLを作る。
// R6: ブログのビルド(HTML変換・commit)は自宅セッションで行うが、
// 既に公開済みの記事一覧を読むだけなので日次バッチから参照しても問題ない。
function buildLatestBlogTeaser() {
  try {
    const posts = loadPosts(CONTENT_BLOG_DIR);
    return renderBlogTeaser({ latestPost: posts[0] || null });
  } catch (e) {
    console.warn('[WARN] blog teaser skipped:', e.message);
    return '';
  }
}

const ymdArg   = process.argv[2] || jstTodayYmd();
const modelArg = process.argv[3] || null;

if (!/^\d{8}$/.test(ymdArg)) {
  console.error('Usage: node scripts/generate-daily-pages.js [YYYYMMDD] [model_version]');
  process.exit(1);
}

const PUBLIC_DIR      = path.resolve(__dirname, '../public');
const DAILY_DIR       = path.join(PUBLIC_DIR, 'daily');
const currentDailyDir = path.join(DAILY_DIR, ymdArg);
const isoDate         = `${ymdArg.slice(0, 4)}-${ymdArg.slice(4, 6)}-${ymdArg.slice(6, 8)}`;

if (!fs.existsSync(DAILY_DIR))       fs.mkdirSync(DAILY_DIR, { recursive: true });
if (!fs.existsSync(currentDailyDir)) fs.mkdirSync(currentDailyDir, { recursive: true });

function write(filePath, html) {
  fs.writeFileSync(filePath, stripMergeConflictMarkers(html), 'utf8');
}

function getDailyDirs() {
  return fs.readdirSync(DAILY_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory() && /^\d{8}$/.test(d.name))
    .map(d => d.name)
    .sort().reverse().slice(0, 30);
}

function purgeOldFiles() {
  const days   = Number(config.htmlRetentionDays) || 30;
  const cutoff = buildCutoffYmdFromBaseYmd(ymdArg, days);

  if (fs.existsSync(DAILY_DIR)) {
    for (const d of fs.readdirSync(DAILY_DIR, { withFileTypes: true })) {
      if (!d.isDirectory() || !/^\d{8}$/.test(d.name)) continue;
      if (d.name < cutoff) {
        fs.rmSync(path.join(DAILY_DIR, d.name), { recursive: true, force: true });
        console.log(`[CLEAN] removed daily/${d.name}/`);
      }
    }
  }
  for (const file of fs.readdirSync(PUBLIC_DIR)) {
    if (!/^\d{12}\.html$/.test(file)) continue;
    if (file.slice(0, 8) < cutoff) {
      fs.rmSync(path.join(PUBLIC_DIR, file), { force: true });
      console.log(`[CLEAN] removed ${file}`);
    }
  }
}

(async () => {
  const pool = createPool(config.mysql);
  try {
    // ── DB queries ──────────────────────────────────────────────
    const [venueMap, dailyRoi, races, dateStats, roiSummary] = await Promise.all([
      loadVenueMap(pool),
      loadDailyRoi(pool, isoDate),
      loadRaces(pool, ymdArg, modelArg),
      loadRoiStats(pool, isoDate),
      loadRoiSummary(pool, isoDate, 30).catch(() => []),
    ]);

    // ── index.html ──────────────────────────────────────────────
    // ルート直下（public/index.html, public/recovery.html）は「今日」の状態を表す本番トップページ。
    // ymdArg が今日以外（未来の先出し予想 / 過去日の再集計）のときに上書きすると、
    // 本番トップが違う日付の内容にすり替わってしまうため、今日のときだけ書き込む。
    const isToday = ymdArg === jstTodayYmd();
    const dailyDirs = getDailyDirs();
    const teaserHtml = buildLatestBlogTeaser();
    if (isToday) {
      write(path.join(PUBLIC_DIR, 'index.html'),
        renderIndexPage({ isoDate, races, dailyRoi, venueMap, cssPath: 'css/style.css', dailyDirs, teaserHtml }));
    }
    write(path.join(currentDailyDir, 'index.html'),
      renderIndexPage({ isoDate, races, dailyRoi, venueMap, cssPath: '../../css/style.css' }));
    console.log(`[GEN] index.html${isToday ? '' : ' (daily配下のみ、rootは今日以外のためskip)'}`);

    // ── 個別レースページ ─────────────────────────────────────────
    for (const race of races) {
      write(path.join(PUBLIC_DIR, `${race.race_id}.html`),
        renderDetailPage({ race, venueMap, cssPath: 'css/style.css' }));
      write(path.join(currentDailyDir, `${race.race_id}.html`),
        renderDetailPage({ race, venueMap, cssPath: '../../css/style.css' }));
    }
    console.log(`[GEN] ${races.length} race pages`);

    // ── recovery.html ────────────────────────────────────────────
    if (isToday) {
      write(path.join(PUBLIC_DIR, 'recovery.html'),
        renderRecoveryPage({ isoDate, dateStats, roiSummary, cssPath: 'css/style.css' }));
    }
    write(path.join(currentDailyDir, 'recovery.html'),
      renderRecoveryPage({ isoDate, dateStats, roiSummary, cssPath: '../../css/style.css' }));
    console.log(`[GEN] recovery.html${isToday ? '' : ' (daily配下のみ)'}`);

    purgeOldFiles();

    const siteUrl = process.env.SITE_URL || config.siteUrl;
    if (siteUrl) {
      const result = writeSitemap({ publicDir: PUBLIC_DIR, siteUrl });
      console.log(`[GEN] sitemap.xml (${result.urlCount} urls)`);
    } else {
      console.warn('[WARN] sitemap.xml skipped: set SITE_URL env or config.siteUrl');
    }
  } catch (e) {
    console.error('[FATAL]', e);
    process.exit(1);
  } finally {
    await pool.end().catch(() => {});
  }
})();
