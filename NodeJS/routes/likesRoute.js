const express = require('express');
const likesRouter = express.Router();
likesRouter.use(express.json());
const jwtAuthentication = require('../middlewares/jwtAuthentication')
const roleAuthorization = require("../middlewares/roleAuthorization");
const { getAll, update } = require('../controllers/likesController');

likesRouter.get('/', async (req, res) => {
    try {
        const likes = await getAll(req.query.libraryId);
        res.status(200).send(likes);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch likes' });
    }
});

likesRouter.put('/', jwtAuthentication, roleAuthorization([1,4]), async (req, res) => {
    try {
        const likeID = await update(req.query.bookId, req.userId);
        likeID? res.sendStatus(201)
        :res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500)
    }
});

module.exports = likesRouter;