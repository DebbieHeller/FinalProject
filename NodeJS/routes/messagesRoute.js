const express = require('express');
const messagesRouter = express.Router();
messagesRouter.use(express.json());
// const { getUserMessages } = require('../controllers/');

messagesRouter.get('/', async (req, res) => {
    try {
        // const messages = await getUserMessages(req.query.libraryId, req.query.userId);
        res.status(200).send(books);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch messages' });
    }
});
module.exports = messagesRouter;