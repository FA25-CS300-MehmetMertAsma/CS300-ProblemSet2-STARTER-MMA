const express = require('express');
const router = express.Router();
const { Book, Author } = require('../models');

// GET /api/books — get all books with their authors
router.get('/', async (req, res) => {
  try {
    const books = await Book.findAll({
      include: { model: Author, as: 'author' },
    });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/books/:id — get one book with author
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id, {
      include: { model: Author, as: 'author' },
    });

    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/books — disabled here
// Books must be created using POST /api/authors/:authorId/books
router.post('/', async (req, res) => {
  res.status(400).json({
    error: 'To create a book, use POST /api/authors/:authorId/books'
  });
});

// PUT /api/books/:id — update a book
router.put('/:id', async (req, res) => {
  try {
    const { title, isbn, publishedYear } = req.body;
    const book = await Book.findByPk(req.params.id);

    if (!book) return res.status(404).json({ error: 'Book not found' });

    await book.update({
      title: title ?? book.title,
      isbn: isbn ?? book.isbn,
      publishedYear: publishedYear ?? book.publishedYear
    });

    res.status(200).json(book);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(e => e.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'ISBN must be unique' });
    }
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/books/:id — delete a book
router.delete('/:id', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });

    await book.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
