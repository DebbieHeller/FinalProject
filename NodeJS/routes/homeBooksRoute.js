const express = require('express');
const homeBooksRouter = express.Router();
homeBooksRouter.use(express.json());


const { getAll,getfilteredBooks} = require('../controllers/booksController');
homeBooksRouter.get('/', async (req, res) => {
    if(!req.query.query && req.query.libraryId)
    try {
        const books = await getAll(req.query.libraryId);
        res.status(200).send(books);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch books' });
    }
    else if (req.query.query && req.query.libraryId) {
        try {
          console.log("query");
          const book = await getfilteredBooks(req.query.query, req.query.libraryId);
          if (!book) {
            res.sendStatus(404)
            return;
          }
          res.status(200).send(book);
        } catch (error) {
          res.sendStatus(500)
        }
      }
});

module.exports = homeBooksRouter;


