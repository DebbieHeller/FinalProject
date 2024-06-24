const mysql = require('mysql2');
const path = require('path');
const pool = require('../LibraryDB');  // הקובץ שמגדיר את החיבור לבסיס הנתונים

async function getBooks(libraryId) {
    try {
        const [rows] = await pool.query(
            `SELECT b.*, bil.isNew
        FROM booksInLibrary bil
        JOIN books b ON bil.bookId = b.id
        WHERE bil.libraryId = ?`, [libraryId]);
        return rows;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function getAvailableBooks(libraryId) {
    try {
        const [rows] = await pool.query(
            `SELECT b.*, bil.isNew
            FROM booksInLibrary bil
            JOIN books b ON bil.bookId = b.id
            JOIN copyBook cb ON bil.id = cb.bookInLibraryId
            WHERE bil.libraryId = ? AND cb.isAvailable = TRUE`, 
            [libraryId]
        );
        return rows;
    } catch (err) {
        console.log(err);
        throw err;
    }
}


async function getBook(id) {
    try {
        const [rows] = await pool.query('SELECT * FROM Books WHERE id=?', [id]);
        return rows[0];
    } catch (err) {
        console.log(err);
    }
}



async function getRecommendedBooksForYou(userId) {
    try {
        // Query to find the most used category by the user
        const categoryQuery = `
        SELECT b.category
        FROM borrows bor
        JOIN copyBook cb ON bor.copyBookId = cb.id
        JOIN booksInLibrary bil ON cb.bookInLibraryId = bil.id
        JOIN books b ON bil.bookId = b.id
        WHERE bor.userId = ?
        GROUP BY b.category
        ORDER BY COUNT(*) DESC
        LIMIT 1;
        `;

        const [categoryRows] = await pool.query(categoryQuery, [userId]);

        if (categoryRows.length === 0) {
            throw new Error(`No books borrowed by user with ID ${userId}`);
        }

        const mostUsedCategory = categoryRows[0].category;
    
        // Query to find books in the most used category that are available in the user's library
        const booksQuery = `
        SELECT b.*
        FROM books b
        JOIN booksInLibrary bil ON b.id = bil.bookId
        JOIN copyBook cb ON bil.id = cb.bookInLibraryId
        LEFT JOIN borrows bor ON cb.id = bor.copyBookId AND bor.userId = ?
        WHERE b.category = ?
        `;

        const [booksRows] = await pool.query(booksQuery, [userId, mostUsedCategory]);

        return booksRows;
    } catch (err) {
        console.error('Error executing SQL query:', err);
        throw err;
    }
}





async function createBook(nameBook, author, numOfPages, publishingYear, likes, summary, imagePath, unitsInStock, category, libraryId, isNew) {
    try {
        const [result] = await pool.query(
            "INSERT INTO Books (nameBook, author, numOfPages, publishingYear, likes, summary, imagePath, unitsInStock, category, libraryId, isNew) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [nameBook, author, numOfPages, publishingYear, likes, summary, imagePath, unitsInStock, category, libraryId, isNew]
        );
        return result.insertId;
    } catch (err) {
        console.error('Error creating Book:', err);
        throw err;
    }
}

async function updateBook(id, nameBook, author, numOfPages, publishingYear, likes, summary, imagePath, unitsInStock, category, libraryId, isNew) {
    try {
        const [rows] = await pool.query(
            "UPDATE Books SET nameBook = ?, author = ?, numOfPages = ?, publishingYear = ?, likes = ?, summary = ?, imagePath = ?, unitsInStock = ?, category = ?, libraryId = ?, isNew = ? WHERE id = ?",
            [nameBook, author, numOfPages, publishingYear, likes, summary, imagePath, unitsInStock, category, libraryId, isNew, id]
        );
        return rows;
    } catch (err) {
        console.error('Error updating Book:', err);
        throw err;
    }
}

async function deleteBook(id) {
    try {
        await pool.query("DELETE FROM Books WHERE id = ?", [id]);
    } catch (err) {
        console.error('Error deleting Book:', err);
        throw err;
    }
}

<<<<<<< HEAD
module.exports = { getBooks, getAvailableBooks, getBook, createBook, updateBook, deleteBook };
=======
module.exports = { getBooks, getBook, createBook, updateBook, deleteBook, getRecommendedBooksForYou };
>>>>>>> 39e02153f0d46740f9ab78fa2997aaceb83349d9
