'use strict';

// R8: カテゴリは「分析対象」軸で固定4つ、これ以上増やさない前提
const CATEGORIES = {
  keito: { label: '血統・種牡馬', path: 'category/keito.html' },
  'jockey-trainer': { label: '騎手・調教師', path: 'category/jockey-trainer.html' },
  roi: { label: '回収率・万馬券', path: 'category/roi.html' },
  'venue-season': { label: '会場・季節', path: 'category/venue-season.html' },
};

// R8: タグは「記事の形式」軸で固定3つ、タグページはnoindex
const TAGS = {
  'monthly-report': { label: '月次定例レポート', path: 'tag/monthly-report.html' },
  'deep-dive': { label: '掘り下げ考察', path: 'tag/deep-dive.html' },
  'quick-take': { label: '小ネタ・速報', path: 'tag/quick-take.html' },
};

function isValidCategory(id) {
  return Object.prototype.hasOwnProperty.call(CATEGORIES, id);
}

function isValidTag(id) {
  return Object.prototype.hasOwnProperty.call(TAGS, id);
}

module.exports = { CATEGORIES, TAGS, isValidCategory, isValidTag };
