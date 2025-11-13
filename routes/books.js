const express = require('express');
const router = express.Router();
const { Author, Book } = require('../models');

// GET /api/books
router.get('/', async (req, res) => {
  try {
    const books = await Book.findAll({
      include: [{ model: Author, as: 'author' }]
    });

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/books/:id
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id, {
      include: [{ model: Author, as: 'author' }]
    });

    if (!book) return res.status(404).json({ error: 'Book not found' });

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/books
router.post('/', async (req, res) => {
  try {
    const { title, isbn, publishedYear, authorId } = req.body;

    // Required fields
    if (!title || !isbn || !authorId) {
      return res
        .status(400)
        .json({ error: 'Title, ISBN, and authorId are required' });
    }

    // Validate author
    const author = await Author.findByPk(authorId);
    if (!author) {
      return res.status(400).json({ error: 'Invalid authorId' });
    }

    // Create book
    const newBook = await Book.create({
      title,
      isbn,
      publishedYear,
      authorId
    });

    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
