const express = require('express');
const homeBooksRouter = express.Router();
homeBooksRouter.use(express.json());
const { getAll } = require('../controllers/booksController');

homeBooksRouter.get('/', async (req, res) => {
  const limit = parseInt(req.query.limit) || 12;
  const offset = parseInt(req.query.offset) || 0;
  try {
    const books = await getAll(req.query.libraryId, req.query.query, req.query.userId, limit, offset);
    if (!books)
      res.sendStatus(404);
    res.status(200).send(books);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch books' });
  }
});


module.exports = homeBooksRouter;


