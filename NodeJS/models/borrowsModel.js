const mysql = require('mysql2');
const path = require('path');
const pool = require("../LibraryDB");

async function getborrows(userId) {
  try {
    const [rows] = await pool.query(
      `
            SELECT books.*, borrows.id as borrowId, borrows.*
            FROM borrows
            JOIN copyBook ON borrows.copyBookId = copyBook.id
            JOIN books ON copyBook.bookId = books.id
            WHERE borrows.userId = ?
            AND borrows.returnDate IS NULL
        `,
      [userId]
    );
    return rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
async function getBorrow(id) {
  try {
      const [rows] = await pool.query('SELECT * FROM Borrows where id=?', [id])
      return rows[0]
  } catch (err) {
      console.log(err)
  }
}
async function updateBorrow(borrowId, copyBookId, userId, borrowDate, returnDate, status, isReturned, isIntact) {
  try {
    const [rows] = await pool.query(
      `UPDATE borrows
      SET copyBookId = ?, userId = ?, borrowDate = ?, returnDate = ?, status = ?, isReturned = ?, isIntact = ? WHERE id = ? `,
      [copyBookId, userId, borrowDate, returnDate, status, isReturned, isIntact, borrowId]
    );
    return rows;
  } catch (err) {
    console.error('Error updating borrow record:', err);
    throw err;
  }
}


module.exports = { getborrows,getBorrow,updateBorrow };
