const express = require('express');
const logoutRouter = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

logoutRouter.get('/', async (req, res) => {
    try {
        res.clearCookie("accessToken", {
            httpOnly: true,
            sameSite: "None",
            secure: true,
        })
        res.sendStatus(204)
    } catch (error) {
        res.status(500).send({ error: 'Failed to logout' });
    }
});

module.exports = logoutRouter;
