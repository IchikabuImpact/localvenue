'use strict';
const mysql = require('mysql2/promise');

function connectionConfig(c) {
  return {
    host:     c.host     || 'localhost',
    user:     c.user,
    password: c.password,
    database: c.database || 'localvenue',
    port:     c.port     || 3306,
    charset:  'utf8mb4',
    waitForConnections: true,
    connectionLimit:    5,
  };
}

function createPool(mysqlConfig, client = mysql) {
  return client.createPool(connectionConfig(mysqlConfig));
}

// リポジトリのコンストラクタ共通パターン
// pool が外部から渡された場合は所有しない（呼び出し側が管理）
// mysqlConfig から内部生成した場合は自分で所有し、close() 時に終了する
function resolvePool({ pool, mysqlConfig, mysqlClient = mysql }) {
  if (pool) return { pool, ownsPool: false };
  return { pool: createPool(mysqlConfig, mysqlClient), ownsPool: true };
}

module.exports = { createPool, connectionConfig, resolvePool };
