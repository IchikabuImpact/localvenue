'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { buildFeedXml, writeFeed } = require('../../../scripts/lib/blog/blog-feed-generator');

const POST = {
  slug: '2026-07-nar-sire-natsu',
  title: '2026年7月 NAR種牡馬別成績',
  date: '2026-08-01',
  description: '7月の種牡馬別成績まとめ',
};

test('buildFeedXml throws when siteUrl is missing', () => {
  assert.throws(() => buildFeedXml({ posts: [POST], siteUrl: '' }), /siteUrl is required/);
});

test('buildFeedXml builds an RSS 2.0 channel with one item per post', () => {
  const xml = buildFeedXml({ posts: [POST], siteUrl: 'https://example.jp/' });
  assert.match(xml, /<rss version="2.0">/);
  assert.match(xml, /<link>https:\/\/example\.jp\/blog\/index\.html<\/link>/);
  assert.match(xml, /<title>2026年7月 NAR種牡馬別成績<\/title>/);
  assert.match(xml, /<link>https:\/\/example\.jp\/blog\/2026-07-nar-sire-natsu\.html<\/link>/);
  assert.equal((xml.match(/<item>/g) || []).length, 1);
});

test('writeFeed writes the xml to disk and reports the item count', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'localvenue-feed-'));
  const outputPath = path.join(dir, 'feed.xml');
  const result = writeFeed({ posts: [POST], siteUrl: 'https://example.jp', outputPath });
  assert.equal(result.itemCount, 1);
  assert.equal(fs.readFileSync(outputPath, 'utf8').includes('<rss version="2.0">'), true);
});
