const test = require('node:test');
const assert = require('node:assert/strict');
const { createStaticServer } = require('../../../scripts/lib/server/static-server');

test('createStaticServer returns an express app', () => {
  const app = createStaticServer({ publicPath: '/tmp/public' });
  assert.equal(typeof app.use, 'function');
  assert.equal(typeof app.listen, 'function');
});
