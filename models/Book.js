/**
 * Book Model
 *
 * Represents a book in the library system.
 * Each book belongs to one author.
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Book = sequelize.define('Book', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notNull: { msg: 'Title is required' },
      notEmpty: { msg: 'Title cannot be empty' },
      len: { args: [1, 200], msg: 'Title must be under 200 characters' },
    },
  },

  isbn: {
    type: DataTypes.STRING(13),
    allowNull: false,
    unique: true,
    validate: {
      notNull: { msg: 'ISBN is required' },
      notEmpty: { msg: 'ISBN cannot be empty' },
      len: { args: [13, 13], msg: 'ISBN must be exactly 13 characters' },
    },
  },

  publishedYear: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  authorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'authors',
      key: 'id',
    },
  },
}, {
  tableName: 'books',
  timestamps: true,
});

module.exports = Book;
