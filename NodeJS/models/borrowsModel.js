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


async function getTerriableUser(userId) {
  try {
    const [rows] = await pool.query(
      `
        SELECT bor.*, bor.id as borrowId, b.*, bil.isNew, cb.id as copyBookId
        FROM booksInLibrary bil
        JOIN books b ON bil.bookId = b.id
        JOIN copyBook cb ON cb.bookInLibraryId = bil.id
        JOIN borrows bor ON bor.copyBookId = cb.id
        WHERE bor.userId = ?
        AND (bor.isIntact = FALSE OR bor.isReturned = FALSE)
        AND bor.returnDate IS NOT NULL
      `,
      [userId]
    );
    return rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getInspectorBorrows(libraryId) {

  try {
    const [rows] = await pool.query(
      `
        SELECT books.*, borrows.*, borrows.id as borrowId 
        FROM borrows
        JOIN copyBook ON borrows.copyBookId = copyBook.id
        JOIN booksInLibrary ON copyBook.bookInLibraryId = booksInLibrary.id
        JOIN books ON booksInLibrary.bookId = books.id
        WHERE booksInLibrary.libraryId=?
        AND borrows.isIntact IS NULL
        AND borrows.isReturned IS NULL
        AND borrows.status IN ('Returned', 'Overdue-Returned');
      `, [libraryId]
    );
    console.log(rows)
    return rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function getLateBorrows(libraryId, date) {

  const deadlineForBorrow = new Date();
  deadlineForBorrow.setDate(deadlineForBorrow.getDate() - 14);

  const formattedDate = deadlineForBorrow.toISOString().slice(0, 19).replace('T', ' ');

  try {
    const [rows] = await pool.query(
      `
        SELECT borrows.id as borrowId, borrows.*, books.nameBook
        FROM borrows
        JOIN copyBook ON borrows.copyBookId = copyBook.id
        JOIN booksInLibrary ON copyBook.bookInLibraryId = booksInLibrary.id
        JOIN books ON booksInLibrary.bookId = books.id
        WHERE booksInLibrary.libraryId = ?
        AND borrows.status='Borrowed'
        AND borrows.borrowDate < ?;
      `, [libraryId, formattedDate]
    );
    return rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function getUnFixBorrows(libraryId) {
  try {
    const [rows] = await pool.query(
      `
          SELECT borrows.id as borrowId, borrows.*, books.*, users.isWarned, users.userName,users.email
          FROM borrows
          JOIN copyBook ON borrows.copyBookId = copyBook.id
          JOIN booksInLibrary ON copyBook.bookInLibraryId = booksInLibrary.id
          JOIN books ON booksInLibrary.bookId = books.id
          JOIN users ON borrows.userId = users.id
          WHERE booksInLibrary.libraryId = ?
          AND borrows.isIntact IS FALSE
          AND borrows.status IN ('Returned', 'Overdue-Returned');
          `,
      [libraryId]
    );
    return rows;
  } catch (err) {
    console.error('Error fetching unfix borrows:', err);
    throw err;
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

async function updateBorrow(borrowId, returnDate, status) {
  try {
    const [rows] = await pool.query(
      `UPDATE borrows
      SET returnDate = ?, status = ?, isReturned=?, isIntact=? WHERE id = ? `,
      [returnDate, status, null, null, borrowId]
    )
    return rows;
  } catch (err) {
    console.error('Error updating borrow record:', err);
    throw err;
  }
}

async function updateBorrowByInspector(borrowId, copyBookId, isReturned, isIntact) {
  try {

    const [rows] = await pool.query(
      `UPDATE borrows
      SET isReturned = ?, isIntact = ? WHERE id = ? `,
      [isReturned, isIntact, borrowId]
    )
    if (isIntact === true) {
      await pool.query(
        `UPDATE copyBook SET isAvailable = ? WHERE id = ? `, [1, copyBookId]
      );
    }


    return rows;
  } catch (err) {
    console.error('Error updating borrow record:', err);
    throw err;
  }
}
async function updateStatusBorrow(borrowId, status) {
  try {
    const [rows] = await pool.query(
      `UPDATE borrows
      SET status = ? WHERE id = ? `,
      [status, borrowId]
    )
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



module.exports = { getborrows, getBorrow, updateBorrow, createBorrow, prevBorrows, getInspectorBorrows, updateBorrowByInspector, getUnFixBorrows, getTerriableUser, getLateBorrows, updateStatusBorrow };
