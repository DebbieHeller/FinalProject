const express = require('express');
const recommendedbooksRouter = express.Router();
recommendedbooksRouter.use(express.json());
const { getRecommendedForYou } = require('../controllers/booksController');

recommendedbooksRouter.get('/', async (req, res) => {
    try {
        const books = await getRecommendedForYou(req.query.libraryId, req.query.userId);
        res.status(200).send(books);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch books' });
    }
});

module.exports = recommendedbooksRouter;