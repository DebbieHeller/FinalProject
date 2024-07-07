const mysql = require('mysql2');
const path = require('path');
const pool = require('../LibraryDB');  


async function getBooksForAdmin() {
    try {
        console.log("******")
        const [rows] = await pool.query(`SELECT * FROM books`);
        return rows;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function getBooks(libraryId) {
    try {
        const [rows] = await pool.query(
            `SELECT b.*, bil.isNew
             FROM booksInLibrary bil
             JOIN books b ON bil.bookId = b.id         
             WHERE bil.libraryId = ?`, [libraryId]);
        return rows;
    } catch (err) {
        console.log(err);//????
        throw err;
    }
}

async function getBooksForUser(libraryId) {
    try {
        const [rows] = await pool.query(
            `SELECT b.*, bil.isNew, cb.id as copyBookId, cb.isAvailable
             FROM booksInLibrary bil
             JOIN books b ON bil.bookId = b.id   
             JOIN copyBook cb ON cb.bookInLibraryId = bil.id      
             WHERE bil.libraryId = ?`, [libraryId]);
        return rows;
    } catch (err) {
        console.log(err);//????
        throw err;
    }
}

async function getAvailableBooks(libraryId) {
    try {
        const [rows] = await pool.query(//?
            `SELECT b.*, bil.isNew, cb.id as copyBookId, 1 as numAvailableCopyBooks
            FROM booksInLibrary bil
            JOIN books b ON bil.bookId = b.id
            JOIN copyBook cb ON bil.id = cb.bookInLibraryId
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
        console.log(err);//???
        throw err;
    }
}

async function getNewBooks(libraryId) {
    try {
        const [rows] = await pool.query(//1 as num...?
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

async function getfilteredBooks(query, libraryId) {
    try {
        const sql = `
            SELECT b.*
            FROM books b
            JOIN booksInLibrary bil ON b.id = bil.bookId
            WHERE bil.libraryId = ?
              AND (b.author LIKE ? OR b.nameBook LIKE ? OR b.category LIKE ?)
        `;
        const wildcardQuery = `%${query}%`;
        const [rows] = await pool.query(sql, [libraryId, wildcardQuery, wildcardQuery, wildcardQuery]);
        console.log(rows)
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

async function getSingleByUserName(namebook) {
    try {
        const [rows] = await pool.query('SELECT * FROM Books WHERE bookName=?', [namebook]);
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
        `SELECT b.*, bil.isNew, cb.id as copyBookId, cb.isAvailable, 1 as numAvailableCopyBooks
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



async function createBook(nameBook, author, numOfPages, publishingYear, summary, image, category) {
    try {
        const [result] = await pool.query(
            "INSERT INTO Books (nameBook, author, numOfPages, publishingYear, summary, image, category) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [nameBook, author, numOfPages, publishingYear, summary, image, category]
        );
        return result.insertId;
    } catch (err) {
        console.error('Error creating Book:', err);
        throw err;
    }
}

async function insertBookToLibrary(libraryId, bookId, unitsInStock) {
    try {
        const [result] = await pool.query(
            "INSERT INTO Books (nameBook, author, numOfPages, publishingYear, summary, image, category) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [nameBook, author, numOfPages, publishingYear, summary, image, category]
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


module.exports = { getBooks, getBooksForUser, getNewBooks, getAvailableBooks, getBook, createBook, updateBook, deleteBook,getRecommendedCategory, getRecommendedBooksForYou, getSingleByUserName,getfilteredBooks, getBooksForAdmin};

