'use strict';

function isDeadlock(err) {
  const msg = err?.message || '';
  return !!(err && (err.code === 'ER_LOCK_DEADLOCK' || /Deadlock found/i.test(msg)));
}

module.exports = { isDeadlock };
