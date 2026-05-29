#!/usr/bin/env node
/**
 * @file scripts/dump-db-context.js
 * @description Dumps the database schema and content to docs/DB_CONTEXT.md for AI context sharing.
 */

const path = require('path');
const { dumpDbContext } = require('./lib/db/dump-db-context');

const OUTPUT_FILE = path.join(__dirname, '../docs/DB_CONTEXT.md');

console.log('Connecting to database...');
dumpDbContext({ outputFile: OUTPUT_FILE }).catch((error) => {
  console.error('Error dumping database:', error);
  process.exit(1);
});
