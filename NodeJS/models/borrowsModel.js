const mysql = require('mysql2');
const path = require('path');
const pool = require("../LibraryDB");

async function getborrows(userId) {
  try {
    const [rows] = await pool.query(
      `
        SELECT bor.*, bor.id as borrowId, b.*, bil.isNew, cb.id as copyBookId
        FROM booksInLibrary bil
        JOIN books b ON bil.bookId = b.id
        JOIN copyBook cb ON cb.bookInLibraryId = bil.id
        JOIN borrows bor ON bor.copyBookId = cb.id
        WHERE bor.userId = ?
        AND bor.returnDate IS NULL;
      `,
      [userId]
    );
    return rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
}



async function prevBorrows(userId) {
  try {
    const [rows] = await pool.query(
      `
        SELECT borrows.id as borrowId, borrows.*, books.*
        FROM borrows
        JOIN copyBook ON borrows.copyBookId = copyBook.id
        JOIN booksInLibrary ON copyBook.bookInLibraryId = booksInLibrary.id
        JOIN books ON booksInLibrary.bookId = books.id
        WHERE borrows.userId = ?
        AND borrows.returnDate IS NOT NULL;
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
    )
    // await pool.query(
    //   `UPDATE copyBook SET isAvailable = ? WHERE id = ? `, [1, copyBookId]
    // );
    return rows;
  } catch (err) {
    console.error('Error updating borrow record:', err);
    throw err;
  }
}

async function createBorrow(copyBookId, userId, borrowDate, returnDate, status, isReturned, isIntact) {
  try {
    const [rows] = await pool.query(
      `INSERT INTO borrows (copyBookId, userId, borrowDate, returnDate, status, isReturned, isIntact) VALUES  (?, ?, ?, ?, ?, ?, ?) `,
      [copyBookId, userId, borrowDate, returnDate, status, isReturned, isIntact]
    )
    await pool.query(
      `UPDATE copyBook SET isAvailable = ? WHERE id = ? `, [0, copyBookId]
    )
    return rows;
  } catch (err) {
    console.error('Error updating borrow record:', err);
    throw err;
  }
}



module.exports = { getborrows, getBorrow, updateBorrow, createBorrow ,prevBorrows};
