'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { buildSitemapXml, normalizeBaseUrl, writeSitemap } = require('../../../scripts/lib/seo/sitemap-generator');

test('normalizeBaseUrl removes trailing slashes', () => {
  assert.equal(normalizeBaseUrl('https://example.com///'), 'https://example.com');
});

test('buildSitemapXml lists public html files with absolute urls', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'localvenue-sitemap-'));
  fs.mkdirSync(path.join(dir, 'daily', '20260721'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), '<html></html>');
  fs.writeFileSync(path.join(dir, 'recovery.html'), '<html></html>');
  fs.writeFileSync(path.join(dir, '202607211220.html'), '<html></html>');
  fs.writeFileSync(path.join(dir, 'daily', '20260721', 'index.html'), '<html></html>');
  fs.writeFileSync(path.join(dir, 'daily', '20260721', '202607211220.html'), '<html></html>');
  fs.writeFileSync(path.join(dir, 'robots.txt'), 'User-agent: *');

  const xml = buildSitemapXml({ publicDir: dir, siteUrl: 'https://example.com/' });

  assert.match(xml, /<loc>https:\/\/example\.com\/<\/loc>/);
  assert.match(xml, /<loc>https:\/\/example\.com\/recovery\.html<\/loc>/);
  assert.match(xml, /<loc>https:\/\/example\.com\/202607211220\.html<\/loc>/);
  assert.match(xml, /<loc>https:\/\/example\.com\/daily\/20260721\/index\.html<\/loc>/);
  assert.match(xml, /<loc>https:\/\/example\.com\/daily\/20260721\/202607211220\.html<\/loc>/);
  assert.doesNotMatch(xml, /robots\.txt/);
  assert.equal((xml.match(/<url>/g) || []).length, 5);
});

test('buildSitemapXml includes blog post/category/index pages but excludes noindex tag pages (R8)', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'localvenue-sitemap-blog-'));
  fs.mkdirSync(path.join(dir, 'blog', 'category'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'blog', 'tag'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'blog', 'index.html'), '<html></html>');
  fs.writeFileSync(path.join(dir, 'blog', '2026-07-nar-sire-natsu.html'), '<html></html>');
  fs.writeFileSync(path.join(dir, 'blog', 'category', 'keito.html'), '<html></html>');
  fs.writeFileSync(path.join(dir, 'blog', 'tag', 'monthly-report.html'), '<html></html>');

  const xml = buildSitemapXml({ publicDir: dir, siteUrl: 'https://example.com' });

  assert.match(xml, /<loc>https:\/\/example\.com\/blog\/index\.html<\/loc>/);
  assert.match(xml, /<loc>https:\/\/example\.com\/blog\/2026-07-nar-sire-natsu\.html<\/loc>/);
  assert.match(xml, /<loc>https:\/\/example\.com\/blog\/category\/keito\.html<\/loc>/);
  assert.doesNotMatch(xml, /blog\/tag\/monthly-report\.html/);
  assert.equal((xml.match(/<url>/g) || []).length, 3);
});

test('writeSitemap writes the xml file and reports the url count', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'localvenue-sitemap-write-'));
  fs.writeFileSync(path.join(dir, 'index.html'), '<html></html>');
  const outputPath = path.join(dir, 'sitemap.xml');

  const result = writeSitemap({ publicDir: dir, siteUrl: 'https://example.com', outputPath });

  assert.equal(result.urlCount, 1);
  assert.equal(fs.existsSync(outputPath), true);
});
