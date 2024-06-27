const express = require('express')
const cors = require('cors')//
const loginRouter = express.Router()
loginRouter.use(express.json())
loginRouter.use(express.urlencoded({ extended: true }))
loginRouter.use(cors())//
const { authenticateLogin } = require('../controllers/usersController')

loginRouter.post('/', async (req, res) => {
    try {
        const user = await authenticateLogin(req.body.username, req.body.password)

        if (!user) {
            res.status(404).send({})
        } else if (user == 1) {//?
            res.status(401).send({})
        } else {
            res.status(201).send(user)
        }
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch book' });
    }
})

module.exports = loginRouter