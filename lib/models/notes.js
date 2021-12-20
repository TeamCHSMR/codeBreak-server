'use strict';

const notesModel = (sequelize, DataTypes) => sequelize.define('Notes', {
	user: { type: DataTypes.STRING, allowNull: false },
  notes: {type: DataTypes.STRING, allowNull: false, defaultValue: 'Enter your thoughts!' },
  
});

module.exports = notesModel;