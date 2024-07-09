const express = require('express');
const sendEmailRoute = express.Router();
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

sendEmailRoute.use(bodyParser.json());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ourlibrary234@gmail.com', 
        pass: 'rwcl oqwh bgyx jwxk' 
    },
    tls: {
        rejectUnauthorized: false
    }
});

sendEmailRoute.post('/', async (req, res) => {
    const {  email,message } = req.body;
console.log(req.body)
    const mailOptions = {
        from: 'ourlibrary234@gmail.com', 
        to: email, 
        subject: 'פנייה חדשה מהאתר',
        text: `
        הודעה: ${message}
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('נשלחה הפניה למייל של הספריה');
    } catch (error) {
        console.error('שגיאה בשליחת הפניה למייל של הספריה:', error);
        res.status(500).send('שגיאה בשליחת הפניה למייל של הספריה');
    }
});

module.exports = sendEmailRoute;