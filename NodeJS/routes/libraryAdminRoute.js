const express = require('express');
const libraryAdminRouter = express.Router();
libraryAdminRouter.use(express.json());
const { getUnFixBorrows, getTerriableUser } = require('../controllers/borrowsController');

libraryAdminRouter.get('/', async (req, res) => {
    const { libraryId, userId} = req.query;
    if (libraryId) {
        // מחיקת השאלה לפי borrowId
        try {
            const books = await getUnFixBorrows(req.query.libraryId);
            res.status(200).send(books);
        } catch (error) {
            res.status(500).send({ error: 'Failed to fetch books' });
        }
    } else if (userId) {
      
        try {
            const borrows=await getTerriableUser(userId);
            res.status(200).send(borrows);
        } catch (error) {
            res.status(500).send({ error: 'Failed to delete borrows by return date' });
        }
    } else {
        res.status(400).send({ error: 'Either borrowId or both userId and returnDate must be provided' });
    }
});

module.exports = libraryAdminRouter;
