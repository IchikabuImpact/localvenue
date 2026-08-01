#!/usr/bin/env node
/**
 * @file generate-blog-pages.js
 * @description content/blog/*.md を静的HTML化し、public/blog/ 以下へ出力する。
 *
 * R6: 自宅の執筆セッション内でその場で実行し、生成物ごとcommit・pushする。
 *     競馬データバッチ（daily-yosou/result-batch）からは呼ばれない、独立したエントリポイント。
 *
 * Usage:
 *   SITE_URL=https://example.com node scripts/generate-blog-pages.js
 */
'use strict';

const fs = require('fs');
const path = require('path');
const configPath = path.resolve(__dirname, '../config/config.js');
const config = fs.existsSync(configPath) ? require(configPath) : {};

const { loadPosts } = require('./lib/blog/blog-post-loader');
const { CATEGORIES, TAGS } = require('./lib/blog/blog-taxonomy');
const {
  renderBlogIndexPage,
  renderBlogPostPage,
  renderBlogCategoryPage,
  renderBlogTagPage,
} = require('./lib/blog/blog-html-renderer');
const { writeFeed } = require('./lib/blog/blog-feed-generator');
const { writeSitemap } = require('./lib/seo/sitemap-generator');
const { stripMergeConflictMarkers } = require('./lib/pagegen/page-utils');

const CONTENT_DIR = path.resolve(__dirname, '../content/blog');
const PUBLIC_DIR = path.resolve(__dirname, '../public');
const BLOG_DIR = path.join(PUBLIC_DIR, 'blog');
const CATEGORY_DIR = path.join(BLOG_DIR, 'category');
const TAG_DIR = path.join(BLOG_DIR, 'tag');

const siteUrl = process.env.SITE_URL || config.siteUrl;

function write(filePath, html) {
  fs.writeFileSync(filePath, stripMergeConflictMarkers(html), 'utf8');
}

function relatedPostsFor(post, allPosts, limit = 3) {
  return allPosts
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, limit);
}

(function main() {
  for (const dir of [BLOG_DIR, CATEGORY_DIR, TAG_DIR]) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const posts = loadPosts(CONTENT_DIR);

  for (const post of posts) {
    write(
      path.join(BLOG_DIR, `${post.slug}.html`),
      renderBlogPostPage({ post, relatedPosts: relatedPostsFor(post, posts), siteUrl, cssPath: '../css/style.css' })
    );
  }
  console.log(`[GEN] ${posts.length} blog post pages`);

  write(path.join(BLOG_DIR, 'index.html'), renderBlogIndexPage({ posts, siteUrl, cssPath: '../css/style.css' }));
  console.log('[GEN] blog/index.html');

  for (const categoryId of Object.keys(CATEGORIES)) {
    const categoryPosts = posts.filter((p) => p.category === categoryId);
    write(
      path.join(CATEGORY_DIR, `${categoryId}.html`),
      renderBlogCategoryPage({ category: categoryId, posts: categoryPosts, siteUrl, cssPath: '../../css/style.css' })
    );
  }
  console.log(`[GEN] ${Object.keys(CATEGORIES).length} category pages`);

  for (const tagId of Object.keys(TAGS)) {
    const tagPosts = posts.filter((p) => p.tags.includes(tagId));
    write(
      path.join(TAG_DIR, `${tagId}.html`),
      renderBlogTagPage({ tag: tagId, posts: tagPosts, siteUrl, cssPath: '../../css/style.css' })
    );
  }
  console.log(`[GEN] ${Object.keys(TAGS).length} tag pages`);

  if (siteUrl) {
    const feedResult = writeFeed({ posts, siteUrl, outputPath: path.join(BLOG_DIR, 'feed.xml') });
    console.log(`[GEN] blog/feed.xml (${feedResult.itemCount} items)`);

    const sitemapResult = writeSitemap({ publicDir: PUBLIC_DIR, siteUrl });
    console.log(`[GEN] sitemap.xml (${sitemapResult.urlCount} urls)`);
  } else {
    console.warn('[WARN] feed.xml / sitemap.xml skipped: set SITE_URL env or config.siteUrl');
  }
})();
