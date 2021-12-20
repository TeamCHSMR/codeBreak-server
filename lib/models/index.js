require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const users = require('./users');

const DATABASE_URL = process.env.DATABASE_URL || 'sqlite::memory:';

const DATABASE_CONFIG =
  process.env.NODE_ENV === 'production'
    ? {
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
      }
    : {};

const sequelize = new Sequelize(DATABASE_URL, DATABASE_CONFIG);

module.exports = {
  db: sequelize,
  users: users(sequelize, DataTypes),
};
