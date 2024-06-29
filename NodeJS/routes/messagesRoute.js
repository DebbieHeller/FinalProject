const express = require('express');
const messagesRouter = express.Router();
messagesRouter.use(express.json());
const { getUserMessages, update } = require('../controllers/messagesController');

messagesRouter.get('/', async (req, res) => {
    try {
        const messages = await getUserMessages(req.query.userId);
        res.status(200).send(messages);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch messages' });
    }
});

messagesRouter.put('/:messageId', async (req, res) => {
    try {
        res.status(200).send(await update(req.params.messageId, req.body.status, req.body.readDate,)); 
    } catch (error) {
        res.status(500).send({ error: 'Failed to update message' });
    }
});


module.exports = messagesRouter;