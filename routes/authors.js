const express = require('express');
const router = express.Router();
const { Author, Book } = require('../models');

// GET /api/authors — get all authors with their books
router.get('/', async (req, res) => {
  try {
    const authors = await Author.findAll({
      include: { model: Book, as: 'books' },
    });
    res.status(200).json(authors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/authors/:id — get one author with books
router.get('/:id', async (req, res) => {
  try {
    const author = await Author.findByPk(req.params.id, {
      include: { model: Book, as: 'books' },
    });
    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }
    res.status(200).json(author);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/authors — create a new author (check for unique email)
router.post('/', async (req, res) => {
  try {
    const { name, email, bio, birthYear } = req.body;

    const existing = await Author.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const author = await Author.create({ name, email, bio, birthYear });
    res.status(201).json(author);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/authors/:id — update an author
router.put('/:id', async (req, res) => {
  try {
    const { name, email, bio, birthYear } = req.body;
    const author = await Author.findByPk(req.params.id);

    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }

    await author.update({ name, email, bio, birthYear });
    res.status(200).json(author);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/authors/:id — delete an author (cascade deletes books)
router.delete('/:id', async (req, res) => {
  try {
    const author = await Author.findByPk(req.params.id);
    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }

    await author.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/authors/:authorId/books — get all books for an author
router.get('/:authorId/books', async (req, res) => {
  try {
    const books = await Book.findAll({
      where: { authorId: req.params.authorId },
    });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/authors/:authorId/books — create book for specific author
router.post('/:authorId/books', async (req, res) => {
  try {
    const author = await Author.findByPk(req.params.authorId);
    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }

    const { title, isbn, publishedYear } = req.body;

    if (!title || !isbn) {
      return res.status(400).json({ error: 'Title and ISBN are required' });
    }

    if (typeof isbn !== 'string' || isbn.length !== 13) {
      return res.status(400).json({ error: 'ISBN must be exactly 13 characters' });
    }

    const book = await Book.create({
      title,
      isbn,
      publishedYear: publishedYear ?? null,
      authorId: Number(author.id),
    });

    res.status(201).json(book);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'ISBN must be unique' });
    }
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(e => e.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
