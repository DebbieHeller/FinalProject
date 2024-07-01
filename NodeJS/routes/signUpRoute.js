const express = require('express');
const signUpRouter = express.Router();
const jwt = require('jsonwebtoken')
signUpRouter.use(express.json());
const { create } = require('../controllers/usersController');
require('dotenv').config()

signUpRouter.post('/', async (req, res) => {
    try {
        const user = await create(req.body.username, req.body.phone, req.body.email, req.body.address, req.body.subscriptionTypeId, req.body.roleId, req.body.libraryId, req.body.password)
        if (user) {
            const accessToken = jwt.sign(
                {
                    userId: user.id,
                    roleId: user.roleId,
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "5m" }
            );
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                sameSite: "None",
                secure: true,
            });
            res.status(201).json(user)
        } else {
            res.sendStatus(501)
        }
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch book' });
    }
})


module.exports = signUpRouter


