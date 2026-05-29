'use strict';

const fs = require('fs').promises;
const path = require('path');
const mysql = require('mysql2/promise');

function escapeMarkdownTableValue(value) {
  if (value === null) return 'NULL';
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value).replace(/\|/g, '\\|').replace(/\n/g, '<br>');
}

function schemaToMarkdown(schema) {
  let markdown = '### Schema\n\n';
  markdown += '| Field | Type | Null | Key | Default | Extra |\n';
  markdown += '|---|---|---|---|---|---|\n';
  for (const col of schema) {
    markdown += `| ${col.Field} | ${col.Type} | ${col.Null} | ${col.Key} | ${col.Default} | ${col.Extra} |\n`;
  }
  return `${markdown}\n`;
}

function rowsToMarkdown(rows) {
  let markdown = `### Data (${rows.length} rows)\n\n`;
  if (!rows.length) return `${markdown}*No data*\n`;
  const columns = Object.keys(rows[0]);
  markdown += `| ${columns.join(' | ')} |\n`;
  markdown += `| ${columns.map(() => '---').join(' | ')} |\n`;
  for (const row of rows) {
    const rowValues = columns.map((col) => escapeMarkdownTableValue(row[col]));
    markdown += `| ${rowValues.join(' | ')} |\n`;
  }
  return markdown;
}

function getAppConfig() {
  return require('../../../config/config');
}

async function dumpDbContext({ outputFile, mysqlClient = mysql, mysqlConfig = getAppConfig().mysql, logger = console, now = new Date() } = {}) {
  const connection = await mysqlClient.createConnection(mysqlConfig);
  try {
    logger.log('Fetching tables...');
    const [tables] = await connection.query('SHOW TABLES');
    const tableNameKey = Object.keys(tables[0] || {})[0];
    const tableNames = tableNameKey ? tables.map((row) => row[tableNameKey]) : [];

    let markdownOutput = '# Database Context\n\n';
    markdownOutput += `Generated at: ${now.toISOString()}\n\n`;

    for (const tableName of tableNames) {
      logger.log(`Processing table: ${tableName}`);
      markdownOutput += `## Table: ${tableName}\n\n`;
      const [schema] = await connection.query(`DESCRIBE \`${tableName}\``);
      markdownOutput += schemaToMarkdown(schema);
      const [rows] = await connection.query(`SELECT * FROM \`${tableName}\``);
      markdownOutput += rowsToMarkdown(rows);
      markdownOutput += '\n---\n\n';
    }

    const docsDir = path.dirname(outputFile);
    await fs.mkdir(docsDir, { recursive: true });
    await fs.writeFile(outputFile, markdownOutput, 'utf8');
    logger.log(`Successfully dumped database context to: ${outputFile}`);
  } finally {
    await connection.end();
  }
}

module.exports = {
  dumpDbContext,
  escapeMarkdownTableValue,
  rowsToMarkdown,
  schemaToMarkdown,
};
