const express = require('express');
const signUpRouter = express.Router();
signUpRouter.use(express.json());


const { create} = require('../controllers/usersController');
signUpRouter.post('/', async (req, res) => {
    try {
        const response = await create(req.body.username, req.body.phone, req.body.email, req.body.address, req.body.subscriptionTypeId, req.body.roleId, req.body.libraryId, req.body.password)
        console.log(response)
        if (response) {
            res.status(201).json(response)
        }
        else {
            res.sendStatus(501)
        }
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch book' });
    }
})


module.exports = signUpRouter


