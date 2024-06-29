// הלוגין:

const express = require("express");
const router = express.Router();
const controller = require('../controllers/loginController.js');

router.post("/", async (req, res) => {
    try {
        console.log('req', req.body);
        const result = await controller.postLogin(req.body);
        console.log('result', result);
        if (result.success) {
            req.session.jwt = result.token;
            req.session.user = result.user;
            req.session.save((err) => {
                if (err) {
                    console.error('Session save error:', err);
                    res.status(500).send({ message: 'Internal server error' });
                } else {
                    console.log('Session after login:', req.session);
                    res.cookie('token', result.token, req.session.cookie);
                    res.status(200).send({ message: 'Logged in', user: result.user });
                }
            });
        } else {
            res.status(401).send({ message: 'Invalid credentials' });
        }
    } catch (err) {
        console.log('Login error:', err);
        res.status(500).send({ message: err.message, ok:false });
    }
});

router.get("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const result = await controller.getSalt(id);
        res.send(result);
    } catch (err) {
        res.status(404).send({ ok: false, error: err.message });
    }
});

module.exports = router;


//authenticateSession מידלוואר

const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateSession = (req, res, next) => {
    const token = req.cookies.token;
    console.log('JWT in session:', token);
    if (token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                console.error('JWT verification error:', err);
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

module.exports = authenticateSession;


//authorizeAdmin מידלוואר


const authenticateSession = require('./authenticateSession'); 

const authorizeAdmin = (req, res, next) => {
    console.log('Admin aothruzation שגיאת כתיב לא אכפת לי');
    authenticateSession(req, res, () => {
        const user = req.user; 
        console.log('admin user', user)
        if (user && user.role_id === 1) {
            next(); 
        } else {
            console.log('user try to delete')
            res.status(403).send({ ok: false , massage: 'A trainee tried to delete a new trainer'}); 
        }
    });
};

module.exports = authorizeAdmin;


//במקום שרוצים להגביל את הבקשה להרשאה אחת

// const express = require("express");
// const router = express.Router();
// const controller = require('../controllers/newTrainersController')
// const authorizeAdmin = require('../middleware/authorizeAdmin');
// router.use(express.json());
// router.use(express.urlencoded({ extended: true }));


// router.get("/", async (req, res) => {
//     console.log(req.session)
//     try {
//         res.send(await controller.getAllNewTrainers());
//     } catch (err) {
//         res.status(500).send({ ok: false });
//     }
// });

// router.delete("/:id", authorizeAdmin, async (req, res) => {
//     const id = req.params.id;
//     const sendMail = req.body.sendMail;
//     console.log('delete trainer router');
//     try {
//         res.send(await controller.deleteTrainer(id, sendMail));
//     } catch (err) {
//         res.status(500).send({ ok: false });
//     }
// });

// module.exports = router