// middlewares/cookiesEncryption.js
const jwt = require('jsonwebtoken');
const cookie = require('cookie-parser');
require('dotenv').config();

const cookiesEncryption = (req, res, next) => {
    const { username } = req.body; // Assuming user data is attached to request

    if (!username) {
        return res.status(400).send({ error: 'Username is required' });
    }

    const tokenPayload = {
        username: username,
    };

    const token = jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1h'
    });

    res.cookie('accessToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
    console.log('Access token and test cookie set');
    next();
};

module.exports = cookiesEncryption;
