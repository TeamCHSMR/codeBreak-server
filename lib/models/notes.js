'use strict';

const notesModel = (sequelize, DataTypes) =>
  sequelize.define('Notes', {
    user: { type: DataTypes.STRING, allowNull: false },
    notes: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Enter your thoughts!',
    },
    userId: { type: DataTypes.INTEGER, allowNull: false },
  });

module.exports = notesModel;
