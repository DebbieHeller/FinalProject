const express = require('express')
const cors = require('cors')//
const loginRouter = express.Router()
loginRouter.use(express.json())
loginRouter.use(express.urlencoded({ extended: true }))
loginRouter.use(cors())//
const { getByUsername } = require('../controllers/usersController')
const { confirmPassword } = require('../controllers/passwordsController')

loginRouter.post('/', async (req, res) => {
    const user = await getByUsername(req.body.username)
    
    if(!user){
        res.status(404).send({})
    } else {
        const confirm = await confirmPassword(user.passwordId, req.body.password)
        if (confirm) {
            res.status(201).send(user)
        } else {
            res.status(401).send({})
        }
    }
})

module.exports = loginRouter