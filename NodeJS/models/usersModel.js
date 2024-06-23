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

async function createUser(username, phone, email, address, subscriptionTypeId, roleId, libraryId, hashedPassword) {
    try {
        const [password] = await pool.query(
            "INSERT INTO passwords(password) VALUES(?)", [hashedPassword]
        )
        const [user] = await pool.query(
            "INSERT INTO users(username, phone, email, address, subscriptionTypeId, roleId, libraryId, passwordId) VALUES(?, ?, ?, ?, ?, ?, ?, ?)", [username, phone, email, address, subscriptionTypeId, roleId, libraryId, password.insertId]
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

module.exports = { getUser, getByUsername, createUser, validateUsername }