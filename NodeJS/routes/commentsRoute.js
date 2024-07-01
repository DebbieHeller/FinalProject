const express = require('express');
const commentsRouter = express.Router();
commentsRouter.use(express.json());
const jwtAuthentication = require('../middlewares/jwtAuthentication')
const { getAll, getSingle, create, update, deleteC } = require('../controllers/commentsController');

commentsRouter.get('/', async (req, res) => {
    try {
        const comments = await getAll(req.query.bookId);
        res.status(200).send(comments);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch comments' });
    }
});

commentsRouter.post('/', jwtAuthentication, async (req, res) => {
    try {
        const response = await create(
            req.body.title,
            req.body.body,
            req.body.userId,
            req.body.bookId
        );
        res.status(201).send(await getSingle(response));
    } catch (error) {
        res.status(500).send({ error: 'Failed to create comment' });
    }
});

commentsRouter.put('/:commentId', jwtAuthentication, async (req, res) => {
    try { 
        await update(
            req.params.commentId,
            req.body.title,
            req.body.body,
            req.body.userId,
            req.body.bookId
        );
        res.status(200).send(await getSingle(req.params.commentId));
    } catch (error) {
        res.status(500).send({ error: 'Failed to update comment' });
    }
});

commentsRouter.delete('/:commentId', jwtAuthentication, async (req, res) => {
    try {
        await deleteC(req.params.commentId);
        res.sendStatus(204);
    } catch (error) {
        res.status(500).send({ error: 'Failed to delete comment' });
    }
});

module.exports = commentsRouter;
