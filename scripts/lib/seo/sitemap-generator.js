'use strict';

const fs = require('fs');
const path = require('path');

const STATIC_HTML_PRIORITIES = new Map([
  ['index.html', '1.0'],
  ['recovery.html', '0.8'],
]);

function normalizeBaseUrl(raw) {
  const value = String(raw || '').trim();
  if (!value) return null;
  return value.replace(/\/+$/, '');
}

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toUrlPath(relativePath) {
  const normalized = relativePath.split(path.sep).join('/');
  if (normalized === 'index.html') return '/';
  return `/${normalized}`;
}

function priorityFor(relativePath) {
  const normalized = relativePath.split(path.sep).join('/');
  if (STATIC_HTML_PRIORITIES.has(normalized)) return STATIC_HTML_PRIORITIES.get(normalized);
  if (/^daily\/\d{8}\/index\.html$/.test(normalized)) return '0.7';
  if (/^\d{12}\.html$/.test(normalized)) return '0.6';
  if (/^daily\/\d{8}\/\d{12}\.html$/.test(normalized)) return '0.5';
  return '0.4';
}

function changefreqFor(relativePath) {
  const normalized = relativePath.split(path.sep).join('/');
  if (normalized === 'index.html' || normalized === 'recovery.html') return 'daily';
  return 'weekly';
}

function collectHtmlFiles(publicDir) {
  const entries = [];

  function walk(currentDir) {
    for (const dirent of fs.readdirSync(currentDir, { withFileTypes: true })) {
      if (dirent.name.startsWith('.')) continue;
      const fullPath = path.join(currentDir, dirent.name);
      const relativePath = path.relative(publicDir, fullPath);
      if (dirent.isDirectory()) {
        walk(fullPath);
        continue;
      }
      if (!dirent.isFile() || !dirent.name.endsWith('.html')) continue;
      const stat = fs.statSync(fullPath);
      entries.push({
        relativePath,
        lastmod: stat.mtime.toISOString().slice(0, 10),
      });
    }
  }

  walk(publicDir);
  return entries.sort((a, b) => toUrlPath(a.relativePath).localeCompare(toUrlPath(b.relativePath)));
}

function buildSitemapXml({ publicDir, siteUrl }) {
  const baseUrl = normalizeBaseUrl(siteUrl);
  if (!baseUrl) throw new Error('siteUrl is required to generate sitemap.xml');

  const urls = collectHtmlFiles(publicDir).map((entry) => ({
    loc: `${baseUrl}${toUrlPath(entry.relativePath)}`,
    lastmod: entry.lastmod,
    changefreq: changefreqFor(entry.relativePath),
    priority: priorityFor(entry.relativePath),
  }));

  const body = urls.map((url) => [
    '  <url>',
    `    <loc>${xmlEscape(url.loc)}</loc>`,
    `    <lastmod>${url.lastmod}</lastmod>`,
    `    <changefreq>${url.changefreq}</changefreq>`,
    `    <priority>${url.priority}</priority>`,
    '  </url>',
  ].join('\n')).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

function writeSitemap({ publicDir, siteUrl, outputPath = path.join(publicDir, 'sitemap.xml') }) {
  const xml = buildSitemapXml({ publicDir, siteUrl });
  fs.writeFileSync(outputPath, xml, 'utf8');
  return { outputPath, urlCount: (xml.match(/<url>/g) || []).length };
}

module.exports = {
  buildSitemapXml,
  collectHtmlFiles,
  normalizeBaseUrl,
  writeSitemap,
};
