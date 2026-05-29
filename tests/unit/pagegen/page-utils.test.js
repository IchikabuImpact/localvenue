const test = require('node:test');
const assert = require('node:assert/strict');
const { buildCutoffYmdFromBaseYmd, safeJSON, stripMergeConflictMarkers } = require('../../../scripts/lib/pagegen/page-utils');

test('safeJSON parses strings and buffers and returns null for invalid JSON', () => {
  assert.deepEqual(safeJSON('{"a":1}'), { a: 1 });
  assert.deepEqual(safeJSON(Buffer.from('{"b":2}')), { b: 2 });
  assert.equal(safeJSON('{'), null);
});

test('stripMergeConflictMarkers removes conflict marker lines', () => {
  assert.equal(stripMergeConflictMarkers('a\n<<<<<<< HEAD\nb\n=======\nc\n>>>>>>> branch\nd'), 'a\nb\nc\nd');
});

test('buildCutoffYmdFromBaseYmd subtracts days from the page target date', () => {
  assert.equal(buildCutoffYmdFromBaseYmd('20260529', 30), '20260429');
});
