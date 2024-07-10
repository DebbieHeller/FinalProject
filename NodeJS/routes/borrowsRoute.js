const express = require('express');
const borrowsRouter = express.Router();
borrowsRouter.use(express.json());
const { getAll, getSingle, update, create } = require('../controllers/borrowsController');
//const authorizeAdmin = require('../middlewares/authorizeAdmin');
const roleAuthorization = require('../middlewares/roleAuthorization');

borrowsRouter.get('/', async (req, res) => {
    try {
        const borrows = await getAll(req.query.userId);
        res.status(200).send(borrows);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch borrows' });
    }
});

borrowsRouter.post('/', async (req, res) => {
    try {
        const response = await create(
            req.body.copyBookId,
            req.body.userId,
            req.body.borrowDate,
            req.body.returnDate,
            req.body.status,
            req.body.isReturned,
            req.body.isIntact
        );
        res.status(201).send(await getSingle(response));
    } catch (error) {
        res.status(500).send({ error: 'Failed to create book' });
    }
});

borrowsRouter.put('/:borrowId', roleAuthorization([4]), async (req, res) => {
    try {
        console.log(req.body)
        await update(
            req.params.borrowId,
            req.body.returnDate,
            req.body.status,           
        );
        res.status(200).send(await getSingle(req.params.borrowId));
    } catch (error) {
        res.status(500).send({ error: 'Failed to update borrow' });
    }
});

module.exports = borrowsRouter;