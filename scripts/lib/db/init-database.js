'use strict';

const mysql = require('mysql2/promise');

function getAppConfig() {
  return require('../../../config/config');
}

function resolveDbConfig(appConfig = getAppConfig()) {
  return appConfig.db || appConfig.mysql;
}

function buildServerConnectionConfig(dbConfig) {
  return {
    host: dbConfig.host || 'localhost',
    user: dbConfig.user,
    password: dbConfig.password,
    port: dbConfig.port || 3306,
  };
}

async function initDatabase({ appConfig = getAppConfig(), mysqlClient = mysql, logger = console } = {}) {
  const dbConfig = resolveDbConfig(appConfig);
  if (!dbConfig) {
    throw new Error('Missing database config in config/config.js');
  }
  if (!dbConfig.database) {
    throw new Error('Missing database name in config/config.js');
  }

  const connectionConfig = buildServerConnectionConfig(dbConfig);
  logger.log(`Connecting to MySQL at ${connectionConfig.host} to ensure database exists...`);
  const connection = await mysqlClient.createConnection(connectionConfig);
  try {
    logger.log(`Checking/Creating database: ${dbConfig.database}`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`;`);
    logger.log(`Database \`${dbConfig.database}\` is ready.`);
  } finally {
    await connection.end();
  }
}

module.exports = {
  buildServerConnectionConfig,
  initDatabase,
  resolveDbConfig,
};
