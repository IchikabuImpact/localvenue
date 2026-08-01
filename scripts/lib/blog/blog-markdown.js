'use strict';

const MarkdownIt = require('markdown-it');

const md = new MarkdownIt({ html: false, linkify: true, breaks: false });

// R5: h1は記事タイトル(frontmatterのtitle)専用。本文はh2から。
const H1_RE = /^#(?!#)\s+.+$/m;

function slugify(text) {
  return String(text)
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

// Markdown本文をHTMLに変換する。見出し(h2以降)には目次・アンカーリンク用のidを自動付与する。
function renderMarkdownBody(bodyMarkdown, filePath) {
  if (H1_RE.test(bodyMarkdown)) {
    throw new Error(`[blog-markdown] ${filePath}: h1 (#) is not allowed in article body; use ## or lower`);
  }

  const tokens = md.parse(bodyMarkdown, {});
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type !== 'heading_open') continue;
    const inline = tokens[i + 1];
    const text = inline && inline.type === 'inline' ? inline.content : '';
    token.attrSet('id', slugify(text));
  }
  return md.renderer.render(tokens, md.options, {});
}

module.exports = { renderMarkdownBody, slugify };
