/**
 * Author Model
 *
 * Represents an author in the library system.
 * Each author can have multiple books.
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Author = sequelize.define('Author', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notNull: { msg: 'Name is required' },
      notEmpty: { msg: 'Name cannot be empty' },
      len: { args: [1, 100], msg: 'Name must be under 100 characters' },
    },
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notNull: { msg: 'Email is required' },
      notEmpty: { msg: 'Email cannot be empty' },
      isEmail: { msg: 'Email must be valid' },
    },
  },

  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  birthYear: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: { args: [1900], msg: 'Birth year must be 1900 or later' },
      max: { args: [2024], msg: 'Birth year must be 2024 or earlier' },
    },
  },
}, {
  tableName: 'Authors',
  timestamps: true,
});

module.exports = Author;
