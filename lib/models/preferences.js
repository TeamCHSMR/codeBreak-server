'use strict';

const preferenceModel = (sequelize, DataTypes) =>
  sequelize.define('Preferences', {
    user: { type: DataTypes.STRING, allowNull: false },
    zip: { type: DataTypes.INTEGER, allowNull: false },
    theme: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    // preferenceId: { type: DataTypes.INTEGER, allowNull: false },
  });

module.exports = preferenceModel;
