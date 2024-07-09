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

async function getCountMessages(userId) {
    try {
        const [rows] = await pool.query(
            'SELECT COUNT(*) AS unreadCount FROM messages WHERE userId = ? AND readDate is NULL', [userId]
        );
        return rows[0];
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

async function createMessage(userId, title, body, status, createdDate) {
    try {

        const [rows] = await pool.query(
            "INSERT INTO messages (userId, title, body, status, createdDate) VALUES (?, ?, ?, ?, ?)",
            [userId, title, body, status, createdDate]
        );
        return rows;
    } catch (err) {
        console.error('Error inserting message:', err);
        throw err;
    }
}



module.exports = { getMessages, getCountMessages, updateMessage ,createMessage}
