'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { CATEGORIES, TAGS, isValidCategory, isValidTag } = require('../../../scripts/lib/blog/blog-taxonomy');

test('CATEGORIES has exactly the 4 fixed categories', () => {
  assert.deepEqual(
    Object.keys(CATEGORIES).sort(),
    ['jockey-trainer', 'keito', 'roi', 'venue-season'].sort()
  );
});

test('TAGS has exactly the 3 fixed tags', () => {
  assert.deepEqual(
    Object.keys(TAGS).sort(),
    ['deep-dive', 'monthly-report', 'quick-take'].sort()
  );
});

test('isValidCategory / isValidTag accept known ids and reject unknown ones', () => {
  assert.equal(isValidCategory('keito'), true);
  assert.equal(isValidCategory('yosou-logic'), false);
  assert.equal(isValidTag('monthly-report'), true);
  assert.equal(isValidTag('unknown-tag'), false);
});
