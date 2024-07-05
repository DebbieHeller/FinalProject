const express = require('express');
const homeBooksRouter = express.Router();
homeBooksRouter.use(express.json());
const { getAll } = require('../controllers/booksController');


homeBooksRouter.get('/', async (req, res) => {
  console.log("req.query.libraryId   "+req.query.libraryId)
    try {
      const books = await getAll(req.query.libraryId, req.query.query);
      if (!books)
        res.sendStatus(404)
      res.status(200).send(books);
    } catch (error) {
      res.status(500).send({ error: 'Failed to fetch books' });
    }
});

module.exports = homeBooksRouter;


