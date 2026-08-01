'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const {
  renderBlogIndexPage,
  renderBlogPostPage,
  renderBlogCategoryPage,
  renderBlogTagPage,
  renderBlogTeaser,
  postUrlPath,
} = require('../../../scripts/lib/blog/blog-html-renderer');

const POST = {
  slug: '2026-07-nar-sire-natsu',
  title: '2026年7月 NAR種牡馬別成績',
  date: '2026-08-01',
  period: '2026-07',
  category: 'keito',
  tags: ['monthly-report'],
  description: '7月の種牡馬別成績まとめ',
  image: null,
  bodyHtml: '<h2 id="集計条件">集計条件</h2><p>本文</p>',
};

test('postUrlPath builds the public URL path for a post', () => {
  assert.equal(postUrlPath(POST), '/blog/2026-07-nar-sire-natsu.html');
});

test('renderBlogPostPage embeds BlogPosting JSON-LD with the site as author/publisher', () => {
  const html = renderBlogPostPage({ post: POST, siteUrl: 'https://example.jp' });
  const jsonLdMatch = html.match(/<script type="application\/ld\+json">(.+?)<\/script>/s);
  assert.ok(jsonLdMatch, 'expected a JSON-LD script tag');
  const jsonLd = JSON.parse(jsonLdMatch[1]);
  assert.equal(jsonLd['@type'], 'BlogPosting');
  assert.equal(jsonLd.headline, POST.title);
  assert.equal(jsonLd.url, 'https://example.jp/blog/2026-07-nar-sire-natsu.html');
  assert.equal(jsonLd.author.name, 'けんちゃん馬券☆WEB');
  assert.equal(jsonLd.publisher.name, 'けんちゃん馬券☆WEB');
});

test('renderBlogPostPage includes canonical link and body html', () => {
  const html = renderBlogPostPage({ post: POST, siteUrl: 'https://example.jp' });
  assert.match(html, /<link rel="canonical" href="https:\/\/example\.jp\/blog\/2026-07-nar-sire-natsu\.html">/);
  assert.match(html, /本文/);
});

test('renderBlogIndexPage lists posts and links to all 4 categories', () => {
  const html = renderBlogIndexPage({ posts: [POST], siteUrl: 'https://example.jp' });
  assert.match(html, /2026年7月 NAR種牡馬別成績/);
  assert.match(html, /category\/keito\.html/);
  assert.match(html, /category\/jockey-trainer\.html/);
  assert.match(html, /category\/roi\.html/);
  assert.match(html, /category\/venue-season\.html/);
});

test('renderBlogIndexPage shows a placeholder when there are no posts', () => {
  const html = renderBlogIndexPage({ posts: [], siteUrl: 'https://example.jp' });
  assert.match(html, /まだ記事がありません。/);
});

test('renderBlogCategoryPage renders the category label and its posts', () => {
  const html = renderBlogCategoryPage({ category: 'keito', posts: [POST], siteUrl: 'https://example.jp' });
  assert.match(html, /カテゴリ: 血統・種牡馬/);
  assert.match(html, /2026年7月 NAR種牡馬別成績/);
});

test('renderBlogTagPage sets robots noindex (R8: tag pages are for browsing only)', () => {
  const html = renderBlogTagPage({ tag: 'monthly-report', posts: [POST], siteUrl: 'https://example.jp' });
  assert.match(html, /<meta name="robots" content="noindex">/);
  assert.match(html, /タグ: 月次定例レポート/);
});

test('renderBlogTeaser returns empty string when there is no latest post', () => {
  assert.equal(renderBlogTeaser({ latestPost: null }), '');
});

test('renderBlogTeaser links to the latest post when present', () => {
  const html = renderBlogTeaser({ latestPost: POST });
  assert.match(html, /href="\/blog\/2026-07-nar-sire-natsu\.html"/);
  assert.match(html, /2026年7月 NAR種牡馬別成績/);
});
