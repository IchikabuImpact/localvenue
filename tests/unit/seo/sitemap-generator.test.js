'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { buildSitemapXml, normalizeBaseUrl } = require('../../../scripts/lib/seo/sitemap-generator');

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
