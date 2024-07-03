const express = require('express')
const usersRouter = express.Router()
usersRouter.use(express.json())
const { getSingle, create } = require('../controllers/usersController')
const { getByroleId } = require('../models/usersModel')

usersRouter.get('/', async (req, res) => {
    try {
        const user = await getByroleId(req.query.roleId)
        if (user) {
            res.status(201).send(user);

        } else {
            res.status(404).send(user)

        }
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch book' });
    }
})

usersRouter.post('/', async (req, res) => {
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


module.exports = usersRouter