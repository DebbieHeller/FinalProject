const express = require('express');
const borrowsRouter = express.Router();
borrowsRouter.use(express.json());
const { getAll } = require('../controllers/borrowsController');

borrowsRouter.get('/', async (req, res) => {
    try {
        const borrows = await getAll(req.query.userId);
        res.status(200).send(borrows);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch borrows' });
    }
});

module.exports = borrowsRouter;