const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Author, Book } = require('../models');

// GET /api/books
router.get('/', async (req, res) => {
  try {
    const { year, author } = req.query;
    const filter = {};

    if (year) filter.year = Number(year);

    let authorFilter = {};
    if (author) authorFilter = { name: { [Op.like]: `%${author}%` } };

    let authorIds = [];
    if (author) {
      const authors = await Author.findAll({ where: authorFilter });
      authorIds = authors.map(a => a.id);
      filter.authorId = { [Op.in]: authorIds };
    }

    const books = await Book.findAll({
      where: filter,
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
    const { title, year, isbn, authorId } = req.body;

    // Check if required fields are present
    if (!title || !isbn) {
      return res.status(400).json({ error: 'Title and ISBN are required' });
    }

    // Verify author exists
    const author = await Author.findByPk(authorId);
    if (!author) return res.status(400).json({ error: 'Invalid authorId' });

    // Create new book
    const book = await Book.create({ title, year, isbn, authorId });
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

