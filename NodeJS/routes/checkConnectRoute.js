const express = require('express');
const checkConnectRoute = express.Router();
checkConnectRoute.use(express.json());
const jwtAuthentication = require('../middlewares/jwtAuthentication')

const {getSingle } = require('../controllers/usersController');

checkConnectRoute.get('/',jwtAuthentication, async (req, res) => {
   console.log("userId"+req.userId)
   console.log(userId+"userId")
    try {
       const user= await getSingle(req.userId);
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch likes' });
    }
});

module.exports = checkConnectRoute;





