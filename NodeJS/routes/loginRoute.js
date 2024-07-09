const express = require('express');
const loginRouter = express.Router();
const jwt = require('jsonwebtoken');
const { authenticateLogin } = require('../controllers/usersController');
require('dotenv').config();

loginRouter.post('/', async (req, res) => {
    try {
        const user = await authenticateLogin(req.body.username, req.body.password);

        if (!user) {
            res.status(401).send({});
        } else if (user === 1) {
            res.status(401).send({});
        } else {
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
            
            res.status(201).send(user);
        }
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch user' });
    }
});

module.exports = loginRouter;
