const express = require('express');
const likesRouter = express.Router();
likesRouter.use(express.json());
const { updateLikes } = require('../controllers/booksController');

likesRouter.put('/', async (req, res) => {
    try {
        const updatedLikes = await updateLikes(req.query.bookId);
        res.status(200).send(updatedLikes.toString()); 
    } catch (error) {
        res.status(500).send({ error: 'Failed to update likes' });
    }
});

module.exports = likesRouter;