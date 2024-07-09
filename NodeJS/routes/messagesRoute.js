const express = require('express');
const messagesRouter = express.Router();
messagesRouter.use(express.json());
const { getUserMessages, update, create } = require('../controllers/messagesController');
const roleAuthorization = require("../middlewares/roleAuthorization");

messagesRouter.get('/', roleAuthorization([4]),  async (req, res) => {
    try {
        const messages = await getUserMessages(req.userId, req.query.count);
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


messagesRouter.post('/', async (req, res) => {
    try {
        
        res.status(200).send(await create( req.body.userId, req.body.title,req.body.body,req.body.status,req.body.createdDate,)); 
    } catch (error) {
        res.status(500).send({ error: 'Failed to update message' });
    }
});

module.exports = messagesRouter;