const jwt = require('jsonwebtoken');
require('dotenv').config();
const cookie = require('cookie');

const cookiesEncryption = (res, userId,roleId)=> {
    const tokenPayload = {
        userId: userId,
        roleId: roleId,
    };

    // יצירת הטוקן
    const token = jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1h' // זמן תוקף של הטוקן
    });


    
    // השמירה של הטוקן ב- cookie
    res.cookie('accessToken', token, {
        httpOnly: true, // ניתן לגישה רק דרך השרת
        secure: process.env.NODE_ENV === 'production', // ניתן לגישה רק על חיבורים מאובטחים בייצור
        sameSite: 'strict' // ניתור עוגייה רק עם בקשות מאותו המקור
    });

    console.log('Access token set in cookie');
};

module.exports = cookiesEncryption;




