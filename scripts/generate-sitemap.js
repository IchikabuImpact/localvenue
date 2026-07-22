#!/usr/bin/env node
/**
 * @file generate-sitemap.js
 * @description public/ 配下のHTMLを走査して sitemap.xml を生成する。
 *
 * Usage:
 *   SITE_URL=https://example.com node scripts/generate-sitemap.js
 */
'use strict';

const fs = require('fs');
const path = require('path');
const configPath = path.resolve(__dirname, '../config/config.js');
const config = fs.existsSync(configPath) ? require(configPath) : {};
const { writeSitemap } = require('./lib/seo/sitemap-generator');

const PUBLIC_DIR = path.resolve(__dirname, '../public');
const siteUrl = process.env.SITE_URL || config.siteUrl;

if (!siteUrl) {
  console.error('Usage: SITE_URL=https://example.com node scripts/generate-sitemap.js');
  console.error('Set SITE_URL env or config.siteUrl in local config/config.js.');
  process.exit(1);
}

try {
  const result = writeSitemap({ publicDir: PUBLIC_DIR, siteUrl });
  console.log(`[GEN] ${path.relative(process.cwd(), result.outputPath)} (${result.urlCount} urls)`);
} catch (e) {
  console.error('[FATAL]', e);
  process.exit(1);
}
