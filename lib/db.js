const Sequelize = require('sequelize');
const logger = require('./logger.js');

if (!process.env.DATABASE_URL) {
  logger.fatal('No env variable of DATABASE_URL being set. Example is postgres://[db-user]:[password]@127.0.0.1:5432/node-postgres-sequelize');
  process.exit(1);
}

const database = new Sequelize(process.env.DATABASE_URL, { logging: process.env.NODE_ENV === 'development' });

module.exports = database;
