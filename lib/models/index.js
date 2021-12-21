require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const userModel = require('./users');
const preferenceModel = require('./preferences');
const noteModel = require('./notes');

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

const users = userModel(sequelize, DataTypes);
const preferences = preferenceModel(sequelize, DataTypes);
const notes = noteModel(sequelize, DataTypes);

// users.hasMany(preferences, { foreignKey: 'preferenceId', sourceKey: 'id' });
// preferences.belongsTo(users, { foreignKey: 'preferenceId', targetKey: 'id' });

module.exports = {
  db: sequelize,
  users,
  preferences,
  notes,
};
