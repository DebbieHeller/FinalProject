const express = require('express')
const usersRouter = express.Router()
usersRouter.use(express.json())
const { getSingle, create } = require('../controllers/usersController')
const { getByUsername } = require('../models/usersModel')

usersRouter.get('/', async (req, res) => {
    const user = await getByUsername(req.query.username)
    console.log(user)
    if(user){
        res.status(409).send(user);

    } else{
        res.status(201).send(user)

    }
})

usersRouter.get('/:userId', async (req, res) => {
    res.send(await getSingle(req.params.userId))
})

usersRouter.post('/', async (req, res) => {
    console.log('create')
    const response = await create(req.body.username, req.body.phone, req.body.email, req.body.address, req.body.subscriptionTypeId, req.body.roleId, libraryId, req.body.creditCardNumber, req.body.expirationDate, req.body.cvv, req.body.password)
    console.log(response)
    if (response){
        res.sendStatus(201)
    }
    else{
        res.status(501).send(response)
    }
})


module.exports = usersRouter