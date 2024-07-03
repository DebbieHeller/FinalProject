const pool = require('../LibraryDB')

async function getLibraries() {
    try {
        const [rows] = await pool.query(
            `SELECT libraries.*, users.*
            FROM libraries 
            JOIN users ON libraries.id = users.libraryId 
            WHERE users.roleId = 2
            `)
        return rows;
    } catch (err) {
        throw err;
    }
}



module.exports = { getLibraries }
