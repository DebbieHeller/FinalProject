const express = require('express');
const librariesRouter = express.Router();
librariesRouter.use(express.json());
const { getAll} = require('../controllers/librariesController');

librariesRouter.get('/', async (req, res) => {
    try {
        console.log('libraries')
        const libraries = await getAll();
        res.status(200).send(libraries);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch libraries' });
    }
});

module.exports = librariesRouter;


