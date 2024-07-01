const express = require('express');
const booksRouter = express.Router();
booksRouter.use(express.json());
const { getSingle, create, update, deleteB } = require('../controllers/booksController');
const roleAuthorization = require('../middlewares/roleAuthorization');

booksRouter.get('/:bookId',roleAuthorization(1), async (req, res) => {
    try {
        const book = await getSingle(req.params.bookId);
        if (!book) {
            res.status(404).send({ error: 'Book not found' });
            return;
        }
        res.status(200).send(book);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch book' });
    }
});

booksRouter.post('/', async (req, res) => {
    try {
        const response = await create(
            req.body.nameBook,
            req.body.author,
            req.body.numOfPages,
            req.body.publishingYear,
            req.body.summary,
            req.body.image,
            req.body.category
        );
        res.status(201).send(await getSingle(response));
    } catch (error) {
        res.status(500).send({ error: 'Failed to create book' });
    }
});

booksRouter.put('/:bookId', async (req, res) => {
    try {
        await update(
            req.params.bookId,
            req.body.nameBook,
            req.body.author,
            req.body.numOfPages,
            req.body.publishingYear,
            req.body.likes,
            req.body.summary,
            req.body.image,
            req.body.unitsInStock,
            req.body.category,
            req.body.libraryId,
            req.body.isNew
        );
        res.status(200).send(await getSingle(req.params.bookId));
    } catch (error) {
        res.status(500).send({ error: 'Failed to update book' });
    }
});

booksRouter.delete('/:bookId', async (req, res) => {
    try {
        await deleteB(req.params.bookId);
        res.sendStatus(204);
    } catch (error) {
        res.status(500).send({ error: 'Failed to delete book' });
    }
});

module.exports = booksRouter;
