'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { renderMarkdownBody, slugify } = require('../../../scripts/lib/blog/blog-markdown');

test('renderMarkdownBody converts markdown to html', () => {
  const html = renderMarkdownBody('## 見出し\n\n本文です。', 'test.md');
  assert.match(html, /<h2[^>]*>見出し<\/h2>/);
  assert.match(html, /<p>本文です。<\/p>/);
});

test('renderMarkdownBody assigns slugified ids to headings', () => {
  const html = renderMarkdownBody('## 夏に強い種牡馬', 'test.md');
  assert.match(html, /<h2 id="夏に強い種牡馬">/);
});

test('renderMarkdownBody throws when the body contains an h1', () => {
  assert.throws(
    () => renderMarkdownBody('# タイトルはここに書かない\n\n本文', 'test.md'),
    /h1 \(#\) is not allowed/
  );
});

test('renderMarkdownBody allows "#" that is part of an h2+ heading (not a bare h1)', () => {
  assert.doesNotThrow(() => renderMarkdownBody('## OK\n### also OK', 'test.md'));
});

test('slugify lowercases, trims, and hyphenates non-alphanumeric runs', () => {
  assert.equal(slugify('  Hello World!!  '), 'hello-world');
  assert.equal(slugify('夏に強い種牡馬'), '夏に強い種牡馬');
});
