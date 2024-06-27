const express = require('express');
const likesRouter = express.Router();
likesRouter.use(express.json());
const { updateLikes, getAll } = require('../controllers/likesController');

likesRouter.get('/', async (req, res) => {
    try {
        const likes = await getAll(req.query.libraryId);
        res.status(200).send(likes);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch likes' });
    }
});

likesRouter.put('/', async (req, res) => {
    try {
        const updatedLikes = await updateLikes(req.query.bookId);
        res.status(200).send(updatedLikes.toString()); 
    } catch (error) {
        res.status(500).send({ error: 'Failed to update likes' });
    }
});

module.exports = likesRouter;