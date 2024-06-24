const express = require('express');
const recommendedbooksRouter = express.Router();
recommendedbooksRouter.use(express.json());
const {getRecommendedForYou } = require('../controllers/booksController');



recommendedbooksRouter.get('/', async (req, res) => {
    console.log(req.query.userId)
    try {
       
        const book = await getRecommendedForYou(req.query.userId);
        if (!book) {
            res.status(404).send({ error: 'Book not found' });
            return;
        }
        res.status(200).send(book);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch book' });
    }
});
module.exports = recommendedbooksRouter;