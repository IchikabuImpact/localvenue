'use strict';

const { htmlHead, htmlFoot } = require('../pagegen/html-renderer');
const { CATEGORIES, TAGS } = require('./blog-taxonomy');

function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function absoluteUrl(siteUrl, urlPath) {
  if (!siteUrl) return urlPath;
  return `${String(siteUrl).replace(/\/+$/, '')}${urlPath}`;
}

function postUrlPath(post) {
  return `/blog/${post.slug}.html`;
}

function categoryLabel(id) {
  return CATEGORIES[id] ? CATEGORIES[id].label : id;
}

function tagLabel(id) {
  return TAGS[id] ? TAGS[id].label : id;
}

function buildMetaBlock({ description, canonicalUrl, image, robots, jsonLd }) {
  const parts = [];
  if (description) parts.push(`<meta name="description" content="${esc(description)}">`);
  if (robots) parts.push(`<meta name="robots" content="${esc(robots)}">`);
  if (canonicalUrl) parts.push(`<link rel="canonical" href="${esc(canonicalUrl)}">`);
  if (description) {
    parts.push(`<meta property="og:description" content="${esc(description)}">`);
    parts.push(`<meta name="twitter:card" content="summary_large_image">`);
  }
  if (canonicalUrl) parts.push(`<meta property="og:url" content="${esc(canonicalUrl)}">`);
  if (image) parts.push(`<meta property="og:image" content="${esc(image)}">`);
  parts.push(`<meta property="og:type" content="article">`);
  if (jsonLd) parts.push(`<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`);
  return parts.join('\n  ');
}

function buildPostJsonLd(post, { siteUrl }) {
  const url = absoluteUrl(siteUrl, postUrlPath(post));
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
    image: post.image ? absoluteUrl(siteUrl, post.image) : undefined,
    author: { '@type': 'Organization', name: 'けんちゃん馬券☆WEB' },
    publisher: { '@type': 'Organization', name: 'けんちゃん馬券☆WEB' },
  };
}

function renderPostCard(post, { headingLevel = 'h3' } = {}) {
  return `
    <li class="blog-card">
      <a class="blog-card-link" href="${esc(postUrlPath(post))}">
        <${headingLevel} class="blog-card-title">${esc(post.title)}</${headingLevel}>
      </a>
      <p class="blog-card-meta">
        <span class="blog-date">${esc(post.date)}</span>
        <span class="blog-taxonomy-badge">${esc(categoryLabel(post.category))}</span>
        ${post.tags.map((t) => `<span class="blog-taxonomy-badge tag">${esc(tagLabel(t))}</span>`).join('')}
      </p>
      <p class="blog-card-desc">${esc(post.description)}</p>
    </li>
  `;
}

function renderPostList(posts) {
  if (!posts.length) return '<p>まだ記事がありません。</p>';
  return `<ul class="blog-list">${posts.map((p) => renderPostCard(p)).join('')}</ul>`;
}

function renderBlogIndexPage({ posts, siteUrl, cssPath = '../css/style.css' }) {
  const canonicalUrl = absoluteUrl(siteUrl, '/blog/index.html');
  const description = '地方競馬(NAR)のデータから見つけた面白い傾向・回収率・血統/騎手成績を紹介するブログです。';
  let html = htmlHead('ブログ', {
    cssPath,
    meta: buildMetaBlock({ description, canonicalUrl }),
  });
  html += `<div class="breadcrumb"><a href="/index.html">&lt; 予想一覧へ戻る</a></div>`;
  html += `<section class="blog-section"><h2>ブログ</h2>`;
  html += `<p class="blog-taxonomy-nav">`;
  html += Object.entries(CATEGORIES)
    .map(([id, c]) => `<a href="/blog/${esc(c.path)}">${esc(c.label)}</a>`)
    .join(' / ');
  html += `</p>`;
  html += renderPostList(posts);
  html += `</section>`;
  html += htmlFoot();
  return html;
}

function renderBlogPostPage({ post, relatedPosts = [], siteUrl, cssPath = '../css/style.css' }) {
  const canonicalUrl = absoluteUrl(siteUrl, postUrlPath(post));
  const image = post.image ? absoluteUrl(siteUrl, post.image) : null;
  let html = htmlHead(post.title, {
    cssPath,
    meta:
      `<meta property="og:title" content="${esc(post.title)}">\n  ` +
      buildMetaBlock({
        description: post.description,
        canonicalUrl,
        image,
        jsonLd: buildPostJsonLd(post, { siteUrl }),
      }),
  });
  html += `<div class="breadcrumb"><a href="/blog/index.html">&lt; ブログ一覧へ戻る</a></div>`;
  html += `<article class="blog-post">`;
  html += `<h2>${esc(post.title)}</h2>`;
  html += `<p class="blog-card-meta">
      <span class="blog-date">${esc(post.date)}</span>
      <a class="blog-taxonomy-badge" href="/blog/${esc(CATEGORIES[post.category].path)}">${esc(categoryLabel(post.category))}</a>
      ${post.tags.map((t) => `<a class="blog-taxonomy-badge tag" href="/blog/${esc(TAGS[t].path)}">${esc(tagLabel(t))}</a>`).join('')}
    </p>`;
  html += `<div class="blog-body">${post.bodyHtml}</div>`;
  html += `</article>`;
  if (relatedPosts.length) {
    html += `<section class="blog-section"><h3>関連記事</h3>${renderPostList(relatedPosts)}</section>`;
  }
  html += htmlFoot();
  return html;
}

function renderBlogCategoryPage({ category, posts, siteUrl, cssPath = '../../css/style.css' }) {
  const label = categoryLabel(category);
  const canonicalUrl = absoluteUrl(siteUrl, `/blog/${CATEGORIES[category].path}`);
  let html = htmlHead(`カテゴリ: ${label}`, {
    cssPath,
    meta: buildMetaBlock({ description: `「${label}」カテゴリの記事一覧です。`, canonicalUrl }),
  });
  html += `<div class="breadcrumb"><a href="/blog/index.html">&lt; ブログ一覧へ戻る</a></div>`;
  html += `<section class="blog-section"><h2>カテゴリ: ${esc(label)}</h2>`;
  html += renderPostList(posts);
  html += `</section>`;
  html += htmlFoot();
  return html;
}

// R8: タグページは回遊用途に限定し、noindexとする
function renderBlogTagPage({ tag, posts, siteUrl, cssPath = '../../css/style.css' }) {
  const label = tagLabel(tag);
  const canonicalUrl = absoluteUrl(siteUrl, `/blog/${TAGS[tag].path}`);
  let html = htmlHead(`タグ: ${label}`, {
    cssPath,
    meta: buildMetaBlock({ description: `「${label}」タグの記事一覧です。`, canonicalUrl, robots: 'noindex' }),
  });
  html += `<div class="breadcrumb"><a href="/blog/index.html">&lt; ブログ一覧へ戻る</a></div>`;
  html += `<section class="blog-section"><h2>タグ: ${esc(label)}</h2>`;
  html += renderPostList(posts);
  html += `</section>`;
  html += htmlFoot();
  return html;
}

// R9: 予想一覧ページ内に「最新ブログ」ティザーを1枠出す(ポータル誘導用のHOMEページは新設しない)
function renderBlogTeaser({ latestPost }) {
  if (!latestPost) return '';
  return `
    <section class="blog-teaser">
      <h2>📊 今週の面白いデータ</h2>
      <a class="blog-card-link" href="${esc(postUrlPath(latestPost))}">
        <p class="blog-card-title">${esc(latestPost.title)}</p>
        <p class="blog-card-desc">${esc(latestPost.description)}</p>
      </a>
      <p class="blog-teaser-more"><a href="/blog/index.html">ブログをもっと読む &gt;</a></p>
    </section>
  `;
}

module.exports = {
  renderBlogIndexPage,
  renderBlogPostPage,
  renderBlogCategoryPage,
  renderBlogTagPage,
  renderBlogTeaser,
  postUrlPath,
};
