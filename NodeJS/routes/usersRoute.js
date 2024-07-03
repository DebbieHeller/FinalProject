const express = require('express')
const usersRouter = express.Router()
usersRouter.use(express.json())
const { getSingle, create, getUsers, warningUser } = require('../controllers/usersController')

usersRouter.get('/', async (req, res) => {
    try {
        const users = await getUsers(req.query.roleId)
        if (users) {
            res.status(201).send(users);
        } else {
            res.sendStatus(404)

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


usersRouter.put('/:userId', async (req, res) => {
    try {
        const response = await warningUser(req.params.userId)
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