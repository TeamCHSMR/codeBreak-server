require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const userModel = require('./users');
const preferenceModel = require('./preferences');
const noteModel = require('./notes');
const Collection = require('./collection');

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

users.hasMany(preferences, { foreignKey: 'userId', sourceKey: 'id' });
preferences.belongsTo(users, { foreignKey: 'userId', targetKey: 'id' });

users.hasMany(notes, { foreignKey: 'userId', sourceKey: 'id' });
notes.belongsTo(users, { foreignKey: 'userId', targetKey: 'id' });

module.exports = {
  db: sequelize,
  users,
  preferences: new Collection(preferences),
  notes: new Collection(notes),
};
