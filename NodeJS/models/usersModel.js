const pool = require('../LibraryDB')
const bcrypt = require('bcrypt')

async function getUser(id) {
    try {
        const sql = `SELECT *
        FROM users
        where id = ?`

        const [rows] = await pool.query(sql, [id])
        return rows[0]

    } catch (err) {
        console.error('Error geting user:', err)
        throw err
    }
}

async function getByUsername(username) {
    try {
        const sql = `SELECT *
        FROM users
        where username=?`

        const [rows] = await pool.query(sql, [username])
        return rows[0]
    } catch (err) {
        console.error('Error geting user:', err)
        throw err
    }
}

async function createUser(username, phone, email, address, subscriptionTypeId, roleId, libraryId, creditCardNumber, expirationDate, cvv, hashedPassword) {
    try {
        const [password] = await pool.query(
            "INSERT INTO passwords(password) VALUES(?)", [hashedPassword]
        )
        const [payment] = await pool.query(
            "INSERT INTO payments(creditCardNumber, expirationDate, cvv) VALUES(?, ?, ?)", [creditCardNumber, expirationDate, cvv]
        )
        const [user] = await pool.query(
            "INSERT INTO users(username, phone, email, address, subscriptionTypeId, roleId, libraryId, paymentId, passwordId) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)", [username, phone, email, address, subscriptionTypeId, roleId, libraryId, payment.insertId, password.insertId]
        )
        return user.insertId
    } catch (err) {
        console.error('Error creating user:', err)
        throw err
    }
}

async function validateUsername(username) {
    try {
        const [existUser] = await pool.query(`SELECT username FROM users where username=?`, [username])
        console.log('existUser[0]: ' + existUser[0])
        return existUser[0]
    } catch (err) {
        console.error('Error validate user:', err)
        throw err
    }
}

async function confirmPassword(id, password) {//////////////////////!!!!!!!!!!!!!!!!!!
    try {
        const [userPassword] = await pool.query(`SELECT password FROM passwords where id=?`, [])
        const hashedPassword = userPassword[0].password;
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    } catch (err) {
        console.error('Error confirm password:', err)
        throw err
    }
}

module.exports = { getUser, getByUsername, createUser, validateUsername, confirmPassword }