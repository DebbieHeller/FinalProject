// routes/login.js
const express = require('express');
const loginRouter = express.Router();
const { authenticateLogin } = require('../controllers/usersController');
//const cookiesEncryption = require('../middlewares/cookiesEncryption');


loginRouter.post('/',async (req, res) => {
    try {
        const user = await authenticateLogin(req.body.username, req.body.password);

        if (!user) {
            res.status(401).send({}); // Unauthorized for non-existing user
        } else if (user === 1) {
            res.status(401).send({}); // Unauthorized for specific condition (user === 1)
        } else {
            // Assuming userId and roleId are properties of user object
            res.status(201).send({
                user,
                userId: user.userId,
                roleId: user.roleId
            });
        }
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch book' });
    }
});

module.exports = loginRouter;
