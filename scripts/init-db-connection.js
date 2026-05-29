#!/usr/bin/env node
/**
 * @file scripts/init-db-connection.js
 * @description Ensures the configured MySQL database exists.
 */

const { initDatabase } = require('./lib/db/init-database');

initDatabase().catch((error) => {
  console.error('Error during database initialization:');
  console.error(error.message);
  process.exit(1);
});
