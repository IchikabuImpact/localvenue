'use strict';

const { isValidCategory, isValidTag } = require('./blog-taxonomy');

const FRONTMATTER_DELIM = /^---\s*$/;
const REQUIRED_FIELDS = ['title', 'date', 'period', 'slug', 'category', 'description'];
const SLUG_RE = /^[a-z0-9-]+$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const PERIOD_RE = /^\d{4}-\d{2}$/;

function stripQuotes(value) {
  const v = value.trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1);
  }
  return v;
}

function parseScalar(raw) {
  const v = raw.trim();
  if (v === 'true') return true;
  if (v === 'false') return false;
  return stripQuotes(v);
}

function parseValue(raw) {
  const v = raw.trim();
  if (v.startsWith('[') && v.endsWith(']')) {
    const inner = v.slice(1, -1).trim();
    if (!inner) return [];
    return inner.split(',').map((item) => stripQuotes(item.trim())).filter(Boolean);
  }
  return parseScalar(v);
}

// content/blog/*.md 先頭の `---` ブロックを単純な key: value / key: [a, b] 形式でパースする。
// フルYAML文法は不要なので js-yaml 等の依存は追加しない。
function parseFrontmatter(raw, filePath) {
  const lines = String(raw).replace(/\r\n/g, '\n').split('\n');
  if (!FRONTMATTER_DELIM.test(lines[0] || '')) {
    throw new Error(`[blog-frontmatter] ${filePath}: frontmatter block (--- ... ---) not found`);
  }
  let endIndex = -1;
  for (let i = 1; i < lines.length; i++) {
    if (FRONTMATTER_DELIM.test(lines[i])) {
      endIndex = i;
      break;
    }
  }
  if (endIndex === -1) {
    throw new Error(`[blog-frontmatter] ${filePath}: closing --- not found`);
  }

  const frontmatter = {};
  for (const line of lines.slice(1, endIndex)) {
    if (!line.trim()) continue;
    const m = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (!m) {
      throw new Error(`[blog-frontmatter] ${filePath}: unparsable frontmatter line: "${line}"`);
    }
    frontmatter[m[1]] = parseValue(m[2]);
  }

  const body = lines.slice(endIndex + 1).join('\n');
  return { frontmatter, body };
}

function validateFrontmatter(frontmatter, filePath) {
  for (const field of REQUIRED_FIELDS) {
    if (!frontmatter[field]) {
      throw new Error(`[blog-frontmatter] ${filePath}: missing required field "${field}"`);
    }
  }
  if (!SLUG_RE.test(frontmatter.slug)) {
    throw new Error(`[blog-frontmatter] ${filePath}: slug "${frontmatter.slug}" must match ${SLUG_RE}`);
  }
  if (!DATE_RE.test(frontmatter.date)) {
    throw new Error(`[blog-frontmatter] ${filePath}: date "${frontmatter.date}" must be YYYY-MM-DD`);
  }
  if (!PERIOD_RE.test(frontmatter.period)) {
    throw new Error(`[blog-frontmatter] ${filePath}: period "${frontmatter.period}" must be YYYY-MM`);
  }
  if (!isValidCategory(frontmatter.category)) {
    throw new Error(`[blog-frontmatter] ${filePath}: unknown category "${frontmatter.category}"`);
  }

  const rawTags = frontmatter.tags === undefined ? [] : frontmatter.tags;
  const tags = Array.isArray(rawTags) ? rawTags : [rawTags];
  if (tags.length > 1) {
    throw new Error(`[blog-frontmatter] ${filePath}: at most 1 tag is allowed, got ${tags.length}`);
  }
  for (const tag of tags) {
    if (!isValidTag(tag)) {
      throw new Error(`[blog-frontmatter] ${filePath}: unknown tag "${tag}"`);
    }
  }

  return {
    title: String(frontmatter.title),
    date: frontmatter.date,
    period: frontmatter.period,
    slug: frontmatter.slug,
    category: frontmatter.category,
    tags,
    description: String(frontmatter.description),
    image: frontmatter.image ? String(frontmatter.image) : null,
    draft: frontmatter.draft === true,
  };
}

module.exports = { parseFrontmatter, validateFrontmatter };
