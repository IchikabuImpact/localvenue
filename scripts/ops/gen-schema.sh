#!/bin/bash

# Extract config values using node
# @copyright © 2026 IchikabuImpact
# @license Commercial use prohibited without permission.
# We use a small script to print space-separated values: HOST USER PASSWORD DATABASE
CONFIG_VALS=$(node -e "
try {
  const c = require('../../config/config').mysql;
  console.log([c.host, c.user, c.password, c.database].join(' '));
} catch(e) {
  process.exit(1);
}
")

if [ $? -ne 0 ]; then
  echo "Error: Could not read config/config.js"
  exit 1
fi

read HOST USER PASS DB <<< "$CONFIG_VALS"

echo "Exporting schema for database: ${DB} (User: ${USER})..."

# Run mysqldump with credentials
# Note: Using -p${PASS} directly in command line can differ by version (sometimes needs no space).
# If password contains special chars, this might be fragile, but assuming alphanumeric '331155'.
mysqldump -h "${HOST}" -u "${USER}" -p"${PASS}" --no-data --skip-dump-date --routines --triggers --no-tablespaces "${DB}" > ../../data/schema.sql

if [ $? -eq 0 ]; then
    echo "Done. data/schema.sql updated."
else
    echo "Error: mysqldump failed."
    exit 1
fi
