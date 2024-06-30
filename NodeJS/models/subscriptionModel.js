const pool = require('../LibraryDB')

async function getsubscriptionType() {
    try {
        const [rows] = await pool.query(
            `SELECT * 
            FROM subscriptionTypes` 
            );
        return rows;
    } catch (err) {
        throw err;
    }
}
module.exports={getsubscriptionType}