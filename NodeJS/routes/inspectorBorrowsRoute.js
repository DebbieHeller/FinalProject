const express = require('express');
const inspectorBorrowsRouter = express.Router();
inspectorBorrowsRouter.use(express.json());
const { getInspectorBorrows, updateBorrowByInspector } = require('../controllers/borrowsController');

inspectorBorrowsRouter.get('/', async (req, res) => {
    try {
        const borrows = await getInspectorBorrows(req.query.libraryId, req.query.date);
        res.status(200).send(borrows);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch books' });
    }
});


inspectorBorrowsRouter.put('/:borrowId', async (req, res) => {
    try {
         await updateBorrowByInspector(
            req.params.borrowId,
            req.body.copyBookId,
            req.body.isReturned,
            req.body.isIntact,
            req.body.statusBorrow,
            req.body.userId,
            req.body.status
        );
        res.sendStatus(200)
    } catch (error) {
        res.sendStatus(500)
    }
});


module.exports = inspectorBorrowsRouter;