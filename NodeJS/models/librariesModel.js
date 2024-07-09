const pool = require('../LibraryDB')

async function getLibraries() {
    try {
        const [rows] = await pool.query(
            `SELECT libraries.*, users.id as userId, users.username, users.roleId
            FROM libraries
            LEFT JOIN users ON libraries.id = users.libraryId AND users.roleId = 2`
        );
        return rows;
    } catch (err) {
        throw err;
    }
}


async function createLibrary(libraryName, address, phone) {

    try {
        const [library] = await pool.query(
            "INSERT INTO libraries (libraryName, address, phone) VALUES (?, ?, ?)",
            [libraryName, address, phone]
        );

        // await pool.query(
        //     "UPDATE users SET libraryId = ?, roleId = ? where id = ?",
        //     [library.insertId, 3, userId]
        // );

        
        return library.insertId;
    } catch (err) {
        console.error('Error creating library:', err);
        throw err;
    }
}


module.exports = { getLibraries, createLibrary }
