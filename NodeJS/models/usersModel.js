const pool = require('../LibraryDB')
const bcrypt = require('bcrypt')

async function getAllUsers() {
    try {
        const [rows] = await pool.query(`SELECT * FROM users`)
        return rows

    } catch (err) {
        console.error('Error geting users:', err)
        throw err
    }
}

async function getUser(id) {
    try {
        const [rows] = await pool.query(`SELECT * FROM users where id=?`, [id])
        console.log("rows "+ rows, "id" +id)
        return rows[0]

    } catch (err) {
        console.error('Error geting user:', err)
        throw err
    }
}

async function getByroleId(id) {
    try {
        const sql = `SELECT *
        FROM users
        where roleId = ?`
        const [rows] = await pool.query(sql, [id])
        return rows

    } catch (err) {
        console.error('Error geting user:', err)
        throw err
    }
}

async function getByUsername(username) {
    try {
        const sql = `
            SELECT u.*, 
                   COUNT(m.id) AS unreadMessagesCount
            FROM users u
            LEFT JOIN messages m ON u.id = m.userId AND m.status = 'לא נקראה'
            WHERE u.username = ?
            GROUP BY u.id
        `;

        const [rows] = await pool.query(sql, [username]);
        return rows[0];
    } catch (err) {
        console.error('Error getting user:', err);
        throw err;
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
async function warningUser(userId) {
    try {
        const [rows] = await pool.query(
          "UPDATE users SET isWarned = TRUE WHERE id = ?",
          [userId]
        );
        return rows;
      } catch (err) {
        console.error('Error updating warning status:', err);
        throw err;
      }
}

async function freeUser(userId) {
    try {
        const [rows] = await pool.query(
          "UPDATE users SET isWarned = FALSE WHERE id = ?",
          [userId]
        );
        return rows;
      } catch (err) {
        console.error('Error updating warning status:', err);
        throw err;
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

module.exports = { getAllUsers, getUser, getByUsername, createUser, validateUsername, getByroleId, warningUser , freeUser}
