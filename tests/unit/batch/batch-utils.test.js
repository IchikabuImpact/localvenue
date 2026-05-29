const test = require('node:test');
const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const { PassThrough } = require('node:stream');
const { createNodeRunner, eachLimit, parseRaceIdsOutput, timestamp } = require('../../../scripts/lib/batch/batch-utils');

test('parseRaceIdsOutput trims blank lines', () => {
  assert.deepEqual(parseRaceIdsOutput(' 202601190101\n\n202601190102\r\n'), ['202601190101', '202601190102']);
});

test('timestamp uses local Date fields with zero padding', () => {
  assert.equal(timestamp(new Date(2026, 0, 2, 3, 4, 5)), '2026-01-02 03:04:05');
});

test('eachLimit processes every item without exceeding concurrency', async () => {
  let active = 0;
  let maxActive = 0;
  const seen = [];
  await eachLimit([1, 2, 3, 4], 2, async (item) => {
    active += 1;
    maxActive = Math.max(maxActive, active);
    seen.push(item);
    await new Promise((resolve) => setTimeout(resolve, 5));
    active -= 1;
  });
  assert.equal(maxActive, 2);
  assert.deepEqual(seen.sort(), [1, 2, 3, 4]);
});

test('createNodeRunner captures stdout and reports exit codes', async () => {
  const spawnCalls = [];
  const spawnFn = (cmd, args) => {
    spawnCalls.push({ cmd, args });
    const child = new EventEmitter();
    child.stdout = new PassThrough();
    process.nextTick(() => {
      child.stdout.write('race1\nrace2\n');
      child.stdout.end();
      child.emit('exit', 0);
    });
    return child;
  };
  const runner = createNodeRunner({ nodeBin: 'node-test', cwd: '/tmp/scripts', existsFn: () => true, spawnFn });
  assert.equal(await runner.runCaptureNode('/tmp/scripts/003.js', ['20260119']), 'race1\nrace2\n');
  assert.equal(await runner.runNodeWithCode('/tmp/scripts/101.js', ['race1']), 0);
  assert.equal(spawnCalls[0].cmd, 'node-test');
});
