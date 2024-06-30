const express = require('express');
const homeBooksRouter = express.Router();
homeBooksRouter.use(express.json());


const { getAll} = require('../controllers/booksController');
homeBooksRouter.get('/', async (req, res) => {
    try {
        const books = await getAll(req.query.libraryId);
        res.status(200).send(books);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch books' });
    }
});

module.exports = homeBooksRouter;


