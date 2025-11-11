const express = require('express');
const router = express.Router();
const { Author, Book } = require('../models');



// GET /api/authors/:id
// Get single author with their books
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const author = await Author.findByPk(id, {
      include: Book,
    });

    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }

    res.status(200).json(author);
  } catch (error) {
    console.error('Error fetching author:', error);
    res.status(500).json({ error: 'Failed to fetch author' });
  }
});

// POST /api/authors
// Create new author (check email is unique)
router.post('/', async (req, res) => {
  try {
    const { name, email, bio, birthYear } = req.body;

    // basic required fields
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const newAuthor = await Author.create({
      name,
      email,
      bio,
      birthYear,
    });

    res.status(201).json(newAuthor);
  } catch (error) {
    console.error('Error creating author:', error);

    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(e => e.message);
      return res.status(400).json({ error: messages.join(', ') });
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Email already exists' });
    }

    res.status(500).json({ error: 'Failed to create author' });
  }
});


// PUT /api/authors/:id
// Update author
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email, bio, birthYear } = req.body;

    // find the author
    const author = await Author.findByPk(id);

    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }

    // update fields for if they are provided
    author.name = name ?? author.name;
    author.email = email ?? author.email;
    author.bio = bio ?? author.bio;
    author.birthYear = birthYear ?? author.birthYear;

    await author.save();

    res.status(200).json(author);
  } catch (error) {
    console.error('Error updating author:', error);

    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(e => e.message);
      return res.status(400).json({ error: messages.join(', ') });
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Email already exists' });
    }

    res.status(500).json({ error: 'Failed to update author' });
  }
});


// DELETE /api/authors/:id

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const author = await Author.findByPk(id);

    if (!author) return res.status(404).json({ error: 'Author not found' });

    await author.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// GET /api/authors/:authorId/books
router.get('/:authorId/books', async (req, res) => {
  try {
    const { authorId } = req.params;
    const author = await Author.findByPk(authorId, {
      include: [{ model: Book }],
    });

    if (!author) return res.status(404).json({ error: 'Author not found' });

    res.json(author.Books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// POST /api/authors/:authorId/books
router.post('/:authorId/books', async (req, res) => {
  try {
    const { authorId } = req.params;
    const { title, genre, publishedYear } = req.body;

    const author = await Author.findByPk(authorId);
    if (!author) return res.status(404).json({ error: 'Author not found' });

    const book = await Book.create({ title, genre, publishedYear, authorId });
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;