const pool = require('../LibraryDB')

async function getPassword(passwordId) {
    try {
        const [originalPassword] = await pool.query(`SELECT password FROM passwords where id=?`, [passwordId])
        return originalPassword[0].password;
    } catch (err) {
        console.error('Error confirm password:', err)
        throw err
    }
}

module.exports = { getPassword }