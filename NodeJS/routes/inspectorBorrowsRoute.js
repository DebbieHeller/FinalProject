const express = require('express');
const inspectorBorrowsRouter = express.Router();
inspectorBorrowsRouter.use(express.json());
const { getInspectorBorrows } = require('../controllers/borrowsController');

inspectorBorrowsRouter.get('/', async (req, res) => {
    try {
        const books = await getInspectorBorrows();
        res.status(200).send(books);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch books' });
    }
});



module.exports = inspectorBorrowsRouter;