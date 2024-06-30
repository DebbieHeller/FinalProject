const express = require('express');
const subscriptionTypeRouter = express.Router();
subscriptionTypeRouter.use(express.json());
const { getsubscriptionType } = require('../controllers/subscriptionTypeController');

subscriptionTypeRouter.get('/', async (req, res) => {
    try {
        const books = await getsubscriptionType();
        res.status(200).send(books);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch books' });
    }
});



module.exports = subscriptionTypeRouter;