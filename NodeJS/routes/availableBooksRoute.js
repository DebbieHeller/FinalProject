const express = require('express');
const availableBooksRouter = express.Router();
availableBooksRouter.use(express.json());
const { getAvailableBooks } = require('../controllers/booksController');

availableBooksRouter.get('/', async (req, res) => {
    try {
        const books = await getAvailableBooks(req.query.libraryId);
        res.status(200).send(books);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch books' });
    }
});



module.exports = availableBooksRouter;
