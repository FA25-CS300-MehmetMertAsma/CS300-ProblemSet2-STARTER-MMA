const { sequelize } = require('../config/database');
const Author = require('./Author');
const Book = require('./Book');

// Define relationships with cascading delete
Author.hasMany(Book, { 
  foreignKey: 'authorId', 
  as: 'books', 
  onDelete: 'CASCADE',  // deletes books when author is deleted
  hooks: true           // ensures Sequelize enforces cascade
});
Book.belongsTo(Author, { foreignKey: 'authorId', as: 'author' });

// Sync database (use force: true in development to recreate tables with updated constraints)
const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: true }); // drops and recreates tables
    console.log('Database synced successfully with cascading deletes.');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
};

// Export models and sync function
module.exports = { sequelize, Author, Book, syncDatabase };
