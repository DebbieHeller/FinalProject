const pool = require('../LibraryDB')

async function getlikes(libraryId) {
    try {
        const [rows] = await pool.query(
            `SELECT likes.* 
            FROM likes 
            JOIN booksInLibrary ON likes.bookId = booksInLibrary.bookId 
            WHERE booksInLibrary.libraryId = ?`
            , [libraryId]);
        return rows;
    } catch (err) {
        throw err;
    }
}

async function updateLikes(bookId) {
    try {
        const [result] = await pool.query(
            `UPDATE likes
            SET numLikes = numLikes + 1
            WHERE bookId = ?`,
            [bookId]
        );
        return result.insertId;
    } catch (err) {
        console.error('Error updating likes:', err);
        throw err;
    }
}


module.exports = { getlikes, updateLikes }
