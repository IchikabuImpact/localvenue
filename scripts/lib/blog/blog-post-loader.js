'use strict';

const fs = require('fs');
const path = require('path');
const { parseFrontmatter, validateFrontmatter } = require('./blog-frontmatter');
const { renderMarkdownBody } = require('./blog-markdown');

// R7: ファイル名は period+slug から機械生成する（frontmatterに直書きさせない）
function buildOutputSlug(frontmatter) {
  return `${frontmatter.period}-${frontmatter.slug}`;
}

function loadPost(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const { frontmatter: rawFrontmatter, body } = parseFrontmatter(raw, filePath);
  const frontmatter = validateFrontmatter(rawFrontmatter, filePath);
  const bodyHtml = renderMarkdownBody(body, filePath);

  return {
    slug: buildOutputSlug(frontmatter),
    title: frontmatter.title,
    date: frontmatter.date,
    period: frontmatter.period,
    category: frontmatter.category,
    tags: frontmatter.tags,
    description: frontmatter.description,
    image: frontmatter.image,
    draft: frontmatter.draft,
    bodyHtml,
    sourcePath: filePath,
  };
}

// content/blog/*.md を全て読み込み、draftを除外し、date降順でソートしたPost[]を返す。
function loadPosts(contentDir) {
  if (!fs.existsSync(contentDir)) return [];

  const files = fs.readdirSync(contentDir, { withFileTypes: true })
    .filter((d) => d.isFile() && d.name.endsWith('.md'))
    .map((d) => path.join(contentDir, d.name));

  const posts = files.map(loadPost).filter((post) => !post.draft);

  const seen = new Map();
  for (const post of posts) {
    const prior = seen.get(post.slug);
    if (prior) {
      throw new Error(`[blog-post-loader] slug collision "${post.slug}": ${prior.sourcePath} and ${post.sourcePath}`);
    }
    seen.set(post.slug, post);
  }

  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

module.exports = { loadPost, loadPosts, buildOutputSlug };
