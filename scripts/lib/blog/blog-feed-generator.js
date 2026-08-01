'use strict';

const fs = require('fs');
const { normalizeBaseUrl } = require('../seo/sitemap-generator');

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function rfc822(dateYmd) {
  return new Date(`${dateYmd}T00:00:00Z`).toUTCString();
}

// R10: 公開記事(draft除く)からRSS 2.0のfeed.xmlを組み立てる
function buildFeedXml({ posts, siteUrl, title = 'けんちゃん馬券☆WEB ブログ', description = '地方競馬(NAR)データの面白い傾向・回収率・血統/騎手成績を紹介するブログです。' }) {
  const baseUrl = normalizeBaseUrl(siteUrl);
  if (!baseUrl) throw new Error('siteUrl is required to generate feed.xml');

  const channelLink = `${baseUrl}/blog/index.html`;
  const items = posts
    .map((post) => `
    <item>
      <title>${xmlEscape(post.title)}</title>
      <link>${xmlEscape(`${baseUrl}/blog/${post.slug}.html`)}</link>
      <guid>${xmlEscape(`${baseUrl}/blog/${post.slug}.html`)}</guid>
      <pubDate>${rfc822(post.date)}</pubDate>
      <description>${xmlEscape(post.description)}</description>
    </item>`)
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${xmlEscape(title)}</title>
    <link>${xmlEscape(channelLink)}</link>
    <description>${xmlEscape(description)}</description>
    <language>ja</language>${items}
  </channel>
</rss>
`;
}

function writeFeed({ posts, siteUrl, outputPath, title, description }) {
  const xml = buildFeedXml({ posts, siteUrl, title, description });
  fs.writeFileSync(outputPath, xml, 'utf8');
  return { outputPath, itemCount: posts.length };
}

module.exports = { buildFeedXml, writeFeed };
