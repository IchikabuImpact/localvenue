'use strict';

// data/schema.sql の CREATE TABLE 定義から「テーブル名 → カラム名配列」を抽出する。
// KEY/PRIMARY KEY/CONSTRAINT行はバッククォート始まりでないため自然に除外される。
function parseSchemaColumns(schemaSql) {
  const tables = {};
  const tableRe = /CREATE TABLE `(\w+)` \(([\s\S]*?)\n\) ENGINE=/g;
  let m;
  while ((m = tableRe.exec(schemaSql))) {
    const [, tableName, body] = m;
    const columns = [];
    for (const line of body.split('\n')) {
      const colMatch = line.match(/^\s*`(\w+)`\s+\S/);
      if (colMatch) columns.push(colMatch[1]);
    }
    tables[tableName] = columns;
  }
  return tables;
}

// schema.sql の各テーブルについて、実DB（pool.execute先のDB）に
// 同名カラムが揃っているかを照合する。
// 戻り値: [{ table, status: 'missing_table' } | { table, status: 'missing_columns', missingColumns }]
async function findSchemaDrift({ pool, schemaSql, tables }) {
  const schemaTables = tables || parseSchemaColumns(schemaSql);
  const drift = [];

  for (const [tableName, columns] of Object.entries(schemaTables)) {
    const [rows] = await pool.execute(
      `SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?`,
      [tableName]
    );
    if (rows.length === 0) {
      drift.push({ table: tableName, status: 'missing_table' });
      continue;
    }
    const existing = new Set(rows.map(r => r.COLUMN_NAME));
    const missingColumns = columns.filter(c => !existing.has(c));
    if (missingColumns.length > 0) {
      drift.push({ table: tableName, status: 'missing_columns', missingColumns });
    }
  }

  return drift;
}

module.exports = { parseSchemaColumns, findSchemaDrift };
