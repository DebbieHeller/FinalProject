const express = require('express');
const borrowsRouter = express.Router();
borrowsRouter.use(express.json());
const { getAll,getSingle ,update} = require('../controllers/borrowsController');

borrowsRouter.get('/', async (req, res) => {
    try {
        const borrows = await getAll(req.query.userId);
        res.status(200).send(borrows);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch borrows' });
    }
});


borrowsRouter.put('/:borrowId', async (req, res) => {
    try {
        await update(
            req.params.borrowId,
            req.body.copyBookId,
            req.body.userId,
            req.body.borrowDate,
            req.body.returnDate,
            req.body.status,
            req.body.isReturned,
            req.body.isIntact
        );
        res.status(200).send(await getSingle(req.params.borrowId));
    } catch (error) {
        res.status(500).send({ error: 'Failed to update borrow' });
    }
});

module.exports = borrowsRouter;