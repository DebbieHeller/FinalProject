const mysql = require('mysql2');
const path = require('path');
const pool = require('../LibraryDB');  // הקובץ שמגדיר את החיבור לבסיס הנתונים

async function getBooks(libraryId) {
    try {
        const [rows] = await pool.query(
            `SELECT b.*, bil.isNew, IFNULL(l.numLikes, 0) as likes
             FROM booksInLibrary bil
             JOIN books b ON bil.bookId = b.id
             LEFT JOIN likes l ON b.id = l.bookId
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
            `SELECT b.*, bil.isNew, cb.id as copyBookId, 1 as numAvailableCopyBooks,IFNULL(l.numLikes, 0) as likes
            FROM booksInLibrary bil
            JOIN books b ON bil.bookId = b.id
            JOIN copyBook cb ON bil.id = cb.bookInLibraryId
            LEFT JOIN likes l ON b.id = l.bookId
            WHERE cb.id = (
            SELECT cb2.id
            FROM copyBook cb2
            WHERE cb2.bookInLibraryId = cb.bookInLibraryId AND cb2.isAvailable = TRUE
            LIMIT 1
            ) AND bil.libraryId = ? AND cb.isAvailable = TRUE
            `,
            [libraryId]
        );
        return rows;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function getNewBooks(libraryId) {
    try {
        const [rows] = await pool.query(
            `SELECT b.*, bil.isNew, cb.id as copyBookId, 1 as numAvailableCopyBooks
            FROM booksInLibrary bil
            JOIN books b ON bil.bookId = b.id
            JOIN copyBook cb ON bil.id = cb.bookInLibraryId
            WHERE cb.id = (
            SELECT cb2.id
            FROM copyBook cb2
            WHERE cb2.bookInLibraryId = cb.bookInLibraryId AND cb2.isAvailable = TRUE
            LIMIT 1
            ) AND bil.libraryId = ? AND cb.isAvailable = TRUE AND bil.isNew = TRUE
            `,
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

async function getRecommendedCategory(userId) {
    try {
        const [categoryRows] = await pool.query(
            `SELECT IFNULL(
                (SELECT b.category
                FROM borrows bor
                JOIN copyBook cb ON bor.copyBookId = cb.id
                JOIN booksInLibrary bil ON cb.bookInLibraryId = bil.id
                JOIN books b ON bil.bookId = b.id
                WHERE bor.userId = ?
                GROUP BY b.category
                ORDER BY COUNT(*) DESC
                LIMIT 1), NULL) AS category;`
            , [userId]);
        return categoryRows[0].category;

    } catch (err) {
        console.error('Error executing SQL query:', err);
        throw err;
    }
}

async function getRecommendedBooksForYou(libraryId, category) {
    try {
        const [booksRows] = await pool.query(
        `SELECT b.*, bil.isNew, cb.id as copyBookId, 1 as numAvailableCopyBooks
        FROM booksInLibrary bil
        JOIN books b ON bil.bookId = b.id
        JOIN copyBook cb ON bil.id = cb.bookInLibraryId
        WHERE cb.id = (
        SELECT cb2.id
        FROM copyBook cb2
        WHERE cb2.bookInLibraryId = cb.bookInLibraryId AND cb2.isAvailable = TRUE
        LIMIT 1
        ) AND bil.libraryId = ? AND b.category = ? AND cb.isAvailable = TRUE`
        , [libraryId, category]);
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

async function updateLikes(bookId) {
    try {
        const [rows] = await pool.query(
            `UPDATE likes
            SET numLikes = numLikes + 1
            WHERE bookId = ?`,
            [bookId]
        );
        const [updatedRows] = await pool.query(
            `SELECT * FROM likes WHERE bookId = ?`,
            [bookId]
        );

        const updatedLikes = updatedRows[0]
        return updatedLikes.numLikes;
    } catch (err) {
        console.error('Error updating likes:', err);
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


module.exports = { getBooks, getNewBooks, getAvailableBooks, getBook, createBook, updateBook, deleteBook,getRecommendedCategory, getRecommendedBooksForYou ,updateLikes};

