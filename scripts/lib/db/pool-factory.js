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

module.exports = { createPool, connectionConfig };
