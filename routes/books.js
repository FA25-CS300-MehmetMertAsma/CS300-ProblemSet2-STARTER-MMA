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
    if (author) authorFilter = { name: new RegExp(author, 'i') };

    let authorIds = [];
    if (author) {
      const authors = await Author.find(authorFilter);
      authorIds = authors.map(a => a._id);
      filter.authorId = { $in: authorIds };
    }

    const books = await Book.find(filter).populate('authorId');
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/books/:id
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('authorId');
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/books
router.post('/', async (req, res) => {
  try {
    const { title, year, authorId } = req.body;
    const author = await Author.findById(authorId);
    if (!author) return res.status(400).json({ error: 'Invalid authorId' });

    const book = new Book({ title, year, authorId });
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

