const express = require('express');
const prevBorrowsRouter = express.Router();
prevBorrowsRouter.use(express.json());
const { getPrevBorrows } = require('../controllers/borrowsController');

prevBorrowsRouter.get('/', async (req, res) => {
    try {
        const books = await getPrevBorrows(req.userId);
        res.status(200).send(books);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch books' });
    }
});



module.exports = prevBorrowsRouter;