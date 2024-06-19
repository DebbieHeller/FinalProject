const mysql = require('mysql2');
const path = require('path');
const pool = require("../LibraryDB");

async function getborrows(userId) {
  try {
    const [rows] = await pool.query(
      `
            SELECT books.*
            FROM barrows
            JOIN copyBook ON barrows.copyBookId = copyBook.id
            JOIN books ON copyBook.bookId = books.id
            WHERE barrows.userId = ?
              AND barrows.returnDate IS NULL
        `,
      [userId]
    );
    return rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

module.exports = { getborrows };
