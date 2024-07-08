const pool = require('../LibraryDB')

async function getAlllikes() {
    try {
        const [rows] = await pool.query(
            `SELECT books.id AS bookId, COALESCE(COUNT(likes.id), 0) AS numLikes
            FROM books
            LEFT JOIN likes ON likes.bookId = books.id
            GROUP BY books.id;
            `);
        return rows;
    } catch (err) {
        throw err;
    }
}

async function getlikes(libraryId) {
    try {
        const [rows] = await pool.query(
            `SELECT booksInLibrary.bookId, COUNT(likes.id) AS numLikes
            FROM booksInLibrary
            LEFT JOIN likes ON likes.bookId = booksInLibrary.bookId
            WHERE booksInLibrary.libraryId = ?
            GROUP BY booksInLibrary.bookId;`
            , [libraryId]);
        return rows;
    } catch (err) {
        throw err;
    }
}

async function checkLike(bookId, userId) {
    try {
        const [rows] = await pool.query(
            `SELECT id FROM likes WHERE bookId = ? AND userId = ?`,
            [bookId, userId]
        );
        return rows;
    } catch (err) {
        throw err;
    }
}

async function createLike(bookId, userId) {
    try {
        const [result] = await pool.query(
            "INSERT INTO likes (bookId, userId) VALUES (?, ?)",
            [bookId, userId]
        );
        return result.insertId;
    } catch (err) {
        console.error('Error creating like:', err);
        throw err;
    }
}

async function deleteLike(id) {
    try {
        await pool.query(
            "DELETE FROM likes WHERE id = ?", [id]
        )
        return 0;
    } catch (err) {
        console.error('Error deleting like:', err)
        throw err
    }
}

module.exports = { getAlllikes, getlikes, checkLike, createLike, deleteLike }
