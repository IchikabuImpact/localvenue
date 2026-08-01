'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { loadPost, loadPosts, buildOutputSlug } = require('../../../scripts/lib/blog/blog-post-loader');

function writePost(dir, filename, frontmatterOverrides = {}, body = '## 本文\n\n内容です。') {
  const fm = Object.assign(
    {
      title: 'テスト記事',
      date: '2026-07-01',
      period: '2026-07',
      slug: 'test-post',
      category: 'keito',
      description: 'テスト用の説明文',
    },
    frontmatterOverrides
  );
  const lines = Object.entries(fm).map(([k, v]) => `${k}: ${Array.isArray(v) ? `[${v.join(', ')}]` : v}`);
  fs.writeFileSync(path.join(dir, filename), `---\n${lines.join('\n')}\n---\n${body}\n`, 'utf8');
}

test('buildOutputSlug concatenates period and slug', () => {
  assert.equal(buildOutputSlug({ period: '2026-07', slug: 'nar-sire-natsu' }), '2026-07-nar-sire-natsu');
});

test('loadPost reads a single file into a normalized Post object', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'localvenue-blog-'));
  writePost(dir, 'a.md');
  const post = loadPost(path.join(dir, 'a.md'));
  assert.equal(post.slug, '2026-07-test-post');
  assert.equal(post.title, 'テスト記事');
  assert.match(post.bodyHtml, /<h2[^>]*>本文<\/h2>/);
});

test('loadPosts filters out draft posts and sorts remaining ones by date descending', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'localvenue-blog-'));
  writePost(dir, 'old.md', { slug: 'old-post', date: '2026-06-01', period: '2026-06' });
  writePost(dir, 'new.md', { slug: 'new-post', date: '2026-07-15' });
  writePost(dir, 'draft.md', { slug: 'draft-post', date: '2026-07-20', draft: true });

  const posts = loadPosts(dir);

  assert.equal(posts.length, 2);
  assert.equal(posts[0].slug, '2026-07-new-post');
  assert.equal(posts[1].slug, '2026-06-old-post');
});

test('loadPosts throws on slug collisions across files', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'localvenue-blog-'));
  writePost(dir, 'a.md', { slug: 'dup' });
  writePost(dir, 'b.md', { slug: 'dup' });
  assert.throws(() => loadPosts(dir), /slug collision "2026-07-dup"/);
});

test('loadPosts returns an empty array when the content directory does not exist', () => {
  assert.deepEqual(loadPosts(path.join(os.tmpdir(), 'localvenue-blog-does-not-exist')), []);
});

test('loadPosts ignores non-markdown files', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'localvenue-blog-'));
  writePost(dir, 'a.md');
  fs.writeFileSync(path.join(dir, 'notes.txt'), 'not a post');
  fs.mkdirSync(path.join(dir, 'images'));
  const posts = loadPosts(dir);
  assert.equal(posts.length, 1);
});
