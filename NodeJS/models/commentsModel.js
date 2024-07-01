const pool = require('../LibraryDB')

async function getComments(bookId) {
    try {
        const [rows] = await pool.query('SELECT * FROM Comments where bookId=?', [bookId]);
        return rows;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function getComment(id) {
    try {
        const [rows] = await pool.query('SELECT * FROM Comments where id=?', [id])
        return rows[0]
    } catch (err) {
        console.log(err)
    }
}

async function createComment(title, body, userId, bookId) {
    try {
        const [result] = await pool.query(
            "INSERT INTO Comments (title, body, userId, bookId) VALUES (?, ?, ?, ?)",
            [title, body, userId, bookId]
        );
        return result.insertId;
    } catch (err) {
        console.error('Error creating Comment:', err);
        throw err;
    }
}


async function updateComment(id, title, body, userId, bookId) {
    try {
        const [rows] = await pool.query(
            "UPDATE Comments SET title = ?, body = ?, userId = ?, bookId = ? where id = ?",
            [title, body, userId, bookId, id]
        );
        return rows;
    } catch (err) {
        console.error('Error updating Comment:', err);
        throw err;
    }
}


async function deleteComment(id) {
    try {
        await pool.query(
            "DELETE FROM Comments WHERE id = ?", [id]
        )
    } catch (err) {
        console.error('Error deleting Comment:', err)
        throw err
    }
}

module.exports = { getComments, getComment, createComment, updateComment, deleteComment }

