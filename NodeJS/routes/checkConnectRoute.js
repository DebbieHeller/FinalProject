const express = require('express');
const checkConnectRoute = express.Router();
checkConnectRoute.use(express.json());
const jwtAuthentication = require('../middlewares/jwtAuthentication');
const { getSingle } = require('../controllers/usersController');

checkConnectRoute.get('/', jwtAuthentication, async (req, res) => {
    console.log("userId")

    try {
        console.log("userId")
       const user= await getSingle(req.userId);
       console.log("user " +user)

        res.status(200).send(user);
    } catch (error) {
        res.sendStatus(500)
    }
});

module.exports = checkConnectRoute;





