const pool = require('../LibraryDB')

async function getMessages(userId) {
    try {
        const [rows] = await pool.query(
            `SELECT * 
            FROM messages 
            WHERE messages.userId = ?`,
            [userId]
        );
        return rows;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function updateMessage(id, status, readDate) {
    try {
        const [rows] = await pool.query(
            "UPDATE messages SET status = ?, readDate = ? where id = ?",
            [status, readDate, id]
        );
        return rows;
    } catch (err) {
        console.error('Error updating message:', err);
        throw err;
    }
}

module.exports = { getMessages, updateMessage }
