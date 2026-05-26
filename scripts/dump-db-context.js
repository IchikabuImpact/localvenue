/**
 * @file scripts/dump-db-context.js
 * @description Dumps the database schema and content to docs/DB_CONTEXT.md for AI context sharing.
 */

const fs = require('fs').promises;
const path = require('path');
const mysql = require('mysql2/promise');
const config = require('../config/config');

const OUTPUT_FILE = path.join(__dirname, '../docs/DB_CONTEXT.md');

async function main() {
    let connection;
    try {
        console.log('Connecting to database...');
        connection = await mysql.createConnection(config.mysql);

        console.log('Fetching tables...');
        const [tables] = await connection.query('SHOW TABLES');
        const tableKeys = Object.keys(tables[0]);
        const tableNameKey = tableKeys[0];
        const tableNames = tables.map(row => row[tableNameKey]);

        let markdownOutput = '# Database Context\n\n';
        markdownOutput += `Generated at: ${new Date().toISOString()}\n\n`;

        for (const tableName of tableNames) {
            console.log(`Processing table: ${tableName}`);
            markdownOutput += `## Table: ${tableName}\n\n`;

            // 1. Get Schema
            const [schema] = await connection.query(`DESCRIBE \`${tableName}\``);
            markdownOutput += '### Schema\n\n';
            markdownOutput += '| Field | Type | Null | Key | Default | Extra |\n';
            markdownOutput += '|---|---|---|---|---|---|\n';

            for (const col of schema) {
                markdownOutput += `| ${col.Field} | ${col.Type} | ${col.Null} | ${col.Key} | ${col.Default} | ${col.Extra} |\n`;
            }
            markdownOutput += '\n';

            // 2. Get Data
            const [rows] = await connection.query(`SELECT * FROM \`${tableName}\``);
            markdownOutput += `### Data (${rows.length} rows)\n\n`;

            if (rows.length > 0) {
                const columns = Object.keys(rows[0]);
                markdownOutput += `| ${columns.join(' | ')} |\n`;
                markdownOutput += `| ${columns.map(() => '---').join(' | ')} |\n`;

                for (const row of rows) {
                    const rowValues = columns.map(col => {
                        const val = row[col];
                        if (val === null) return 'NULL';
                        if (val instanceof Date) return val.toISOString();
                        if (typeof val === 'object') return JSON.stringify(val);
                        // Escape pipes in content to avoid breaking the table
                        return String(val).replace(/\|/g, '\\|').replace(/\n/g, '<br>');
                    });
                    markdownOutput += `| ${rowValues.join(' | ')} |\n`;
                }
            } else {
                markdownOutput += '*No data*\n';
            }
            markdownOutput += '\n---\n\n';
        }

        // Ensure docs directory exists
        const docsDir = path.dirname(OUTPUT_FILE);
        try {
            await fs.access(docsDir);
        } catch {
            await fs.mkdir(docsDir, { recursive: true });
        }

        await fs.writeFile(OUTPUT_FILE, markdownOutput, 'utf8');
        console.log(`Successfully dumped database context to: ${OUTPUT_FILE}`);

    } catch (error) {
        console.error('Error dumping database:', error);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

main();
