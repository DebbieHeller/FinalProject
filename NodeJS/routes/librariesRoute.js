const express = require('express');
const librariesRouter = express.Router();
librariesRouter.use(express.json());
const { getAll, create } = require('../controllers/librariesController');

librariesRouter.get('/', async (req, res) => {
    try {
        const libraries = await getAll();
        res.status(200).send(libraries);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch libraries' });
    }
});

librariesRouter.post('/', async (req, res) => {
    try {
        console.log(req.body)
        const response = await create(
            req.body.libraryName,
            req.body.address,
            req.body.phone,
        )
        if(response) {
            res.status(201).json(response);
        }
        else {
            res.sendStatus(409);
        }
    } catch (error) {
        res.status(500).send({ error: 'Failed to create library' });
    }
});

module.exports = librariesRouter;


