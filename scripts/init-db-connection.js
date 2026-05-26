/**
 * @file scripts/init-db-connection.js
 * @description Ensures the configured MySQL database exists.
 */

const mysql = require('mysql2/promise');
const config = require('../config/config');

async function initDatabase() {
  const dbConfig = config.db || config.mysql;

  if (!dbConfig) {
    console.error('Missing database config in config/config.js');
    process.exit(1);
  }

  const connectionConfig = {
    host: dbConfig.host || 'localhost',
    user: dbConfig.user,
    password: dbConfig.password,
    port: dbConfig.port || 3306
  };

  let connection;

  try {
    console.log(`Connecting to MySQL at ${connectionConfig.host} to ensure database exists...`);
    connection = await mysql.createConnection(connectionConfig);

    const dbName = dbConfig.database;
    if (!dbName) {
      throw new Error('Missing database name in config/config.js');
    }

    console.log(`Checking/Creating database: ${dbName}`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    console.log(`Database \`${dbName}\` is ready.`);

    await connection.end();
  } catch (error) {
    console.error('Error during database initialization:');
    console.error(error.message);
    process.exit(1);
  }
}

initDatabase();
