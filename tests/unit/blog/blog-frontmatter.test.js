'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { parseFrontmatter, validateFrontmatter } = require('../../../scripts/lib/blog/blog-frontmatter');

const VALID_RAW = `---
title: 夏に強い種牡馬まとめ
date: 2026-08-01
period: 2026-07
slug: nar-sire-natsu
category: keito
tags: [monthly-report]
description: 7月のNAR種牡馬別成績まとめ
---
## 本文
`;

test('parseFrontmatter splits the --- block from the body', () => {
  const { frontmatter, body } = parseFrontmatter(VALID_RAW, 'test.md');
  assert.equal(frontmatter.title, '夏に強い種牡馬まとめ');
  assert.equal(frontmatter.slug, 'nar-sire-natsu');
  assert.deepEqual(frontmatter.tags, ['monthly-report']);
  assert.match(body, /## 本文/);
});

test('parseFrontmatter throws when the opening --- is missing', () => {
  assert.throws(() => parseFrontmatter('title: x\n', 'test.md'), /frontmatter block/);
});

test('parseFrontmatter throws when the closing --- is missing', () => {
  assert.throws(() => parseFrontmatter('---\ntitle: x\n', 'test.md'), /closing ---/);
});

test('validateFrontmatter returns a normalized post-meta object for valid input', () => {
  const { frontmatter } = parseFrontmatter(VALID_RAW, 'test.md');
  const meta = validateFrontmatter(frontmatter, 'test.md');
  assert.equal(meta.category, 'keito');
  assert.deepEqual(meta.tags, ['monthly-report']);
  assert.equal(meta.draft, false);
  assert.equal(meta.image, null);
});

test('validateFrontmatter throws when a required field is missing', () => {
  const { frontmatter } = parseFrontmatter(VALID_RAW.replace('title: 夏に強い種牡馬まとめ\n', ''), 'test.md');
  assert.throws(() => validateFrontmatter(frontmatter, 'test.md'), /missing required field "title"/);
});

test('validateFrontmatter throws on malformed slug', () => {
  const { frontmatter } = parseFrontmatter(VALID_RAW.replace('slug: nar-sire-natsu', 'slug: NAR_Sire!'), 'test.md');
  assert.throws(() => validateFrontmatter(frontmatter, 'test.md'), /slug .* must match/);
});

test('validateFrontmatter throws on malformed date/period', () => {
  const badDate = parseFrontmatter(VALID_RAW.replace('date: 2026-08-01', 'date: 2026/08/01'), 'test.md');
  assert.throws(() => validateFrontmatter(badDate.frontmatter, 'test.md'), /date .* must be YYYY-MM-DD/);

  const badPeriod = parseFrontmatter(VALID_RAW.replace('period: 2026-07', 'period: 202607'), 'test.md');
  assert.throws(() => validateFrontmatter(badPeriod.frontmatter, 'test.md'), /period .* must be YYYY-MM/);
});

test('validateFrontmatter throws on unknown category', () => {
  const { frontmatter } = parseFrontmatter(VALID_RAW.replace('category: keito', 'category: yosou-logic'), 'test.md');
  assert.throws(() => validateFrontmatter(frontmatter, 'test.md'), /unknown category/);
});

test('validateFrontmatter throws on unknown tag and on more than 1 tag', () => {
  const badTag = parseFrontmatter(VALID_RAW.replace('tags: [monthly-report]', 'tags: [breaking-news]'), 'test.md');
  assert.throws(() => validateFrontmatter(badTag.frontmatter, 'test.md'), /unknown tag/);

  const twoTags = parseFrontmatter(VALID_RAW.replace('tags: [monthly-report]', 'tags: [monthly-report, deep-dive]'), 'test.md');
  assert.throws(() => validateFrontmatter(twoTags.frontmatter, 'test.md'), /at most 1 tag/);
});

test('validateFrontmatter defaults tags to [] when omitted', () => {
  const raw = VALID_RAW.replace('tags: [monthly-report]\n', '');
  const { frontmatter } = parseFrontmatter(raw, 'test.md');
  const meta = validateFrontmatter(frontmatter, 'test.md');
  assert.deepEqual(meta.tags, []);
});
