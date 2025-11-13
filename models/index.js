const { sequelize } = require('../config/database');
const Author = require('./Author');
const Book = require('./Book');

// Relationships
Author.hasMany(Book, { foreignKey: 'authorId', as: 'books', onDelete: 'CASCADE' });
Book.belongsTo(Author, { foreignKey: 'authorId', as: 'author' });

// Sync database
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully.');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
};

// Export models and sync function
module.exports = { sequelize, Author, Book, syncDatabase };
