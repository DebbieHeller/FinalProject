const mysql = require('mysql2');
const path = require('path');
const pool = require('../LibraryDB');  

async function getBooks(libraryId, limit = 12, offset = 0) {
    try {
        const [rows] = await pool.query(
            `SELECT b.*, bil.isNew
             FROM booksInLibrary bil
             JOIN books b ON bil.bookId = b.id         
             WHERE bil.libraryId = ?
             LIMIT ? OFFSET ?`, [libraryId, limit, offset]);
        return rows;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function getBooksForAdmin(limit = 12, offset = 0) {
    try {
        const [rows] = await pool.query(
            `SELECT * FROM books
             LIMIT ? OFFSET ?`, [limit, offset]);
        return rows;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function getBooksForUser(libraryId, limit = 12, offset = 0) {
    try {
        const [rows] = await pool.query(
            `SELECT b.id, b.nameBook, b.author, b.numOfPages, b.publishingYear, b.summary, b.category, b.image, bil.isNew, COALESCE(SUM(cb.isAvailable = TRUE), 0) as availableCopies, COALESCE(MIN(CASE WHEN cb.isAvailable = TRUE THEN cb.id END), MIN(cb.id)) as copyBookId 
            FROM booksInLibrary bil 
            JOIN books b ON bil.bookId = b.id 
            LEFT JOIN copyBook cb ON cb.bookInLibraryId = bil.id 
            WHERE bil.libraryId = ? 
            GROUP BY b.id, b.nameBook, b.author, b.numOfPages, b.publishingYear, b.summary, b.category, b.image, bil.isNew 
            LIMIT ? OFFSET ?`, 
            [libraryId, limit, offset]
        );
        return rows;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function getfilteredBooks(query, libraryId, limit = 12, offset = 0) {
    try {
        const sql = 
            `SELECT b.*
            FROM books b
            JOIN booksInLibrary bil ON b.id = bil.bookId
            WHERE bil.libraryId = ?
            AND (b.author LIKE ? OR b.nameBook LIKE ? OR b.category LIKE ?)
            LIMIT ? OFFSET ?
        `;
        const wildcardQuery = `%${query}%`;
        const [rows] = await pool.query(sql, [libraryId, wildcardQuery, wildcardQuery, wildcardQuery, limit, offset]);
        return rows;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function getfilteredBooksForAdmin(query, limit = 12, offset = 0) {
    try {
        const sql = `
            SELECT * FROM books b
            WHERE (b.author LIKE ? OR b.nameBook LIKE ? OR b.category LIKE ?)
            LIMIT ? OFFSET ?
        `;
        const wildcardQuery = `%${query}%`;
        const [rows] = await pool.query(sql, [wildcardQuery, wildcardQuery, wildcardQuery, limit, offset]);
        return rows;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function getfilteredBooksForUser(query, libraryId, limit = 12, offset = 0) {
    try {
        const sql = `SELECT b.id, b.nameBook, b.author, b.numOfPages, b.publishingYear, b.summary, b.category, b.image, bil.isNew, COALESCE(SUM(cb.isAvailable = TRUE), 0) as availableCopies, COALESCE(MIN(CASE WHEN cb.isAvailable = TRUE THEN cb.id END), MIN(cb.id)) as copyBookId 
        FROM booksInLibrary bil 
        JOIN books b ON bil.bookId = b.id 
        LEFT JOIN copyBook cb ON cb.bookInLibraryId = bil.id 
        WHERE bil.libraryId = ? 
        AND (b.author LIKE ? OR b.nameBook LIKE ? OR b.category LIKE ?)
        GROUP BY b.id, b.nameBook, b.author, b.numOfPages, b.publishingYear, b.summary, b.category, b.image, bil.isNew
        LIMIT ? OFFSET ?
        `;
        const wildcardQuery = `%${query}%`;
        const [rows] = await pool.query(sql, [libraryId, wildcardQuery, wildcardQuery, wildcardQuery, limit, offset]);
        return rows;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function getNewBooks(libraryId) {
    try {
        const [rows] = await pool.query(
            `SELECT b.id, b.nameBook, b.author, b.numOfPages, b.publishingYear, b.summary, b.category, b.image, bil.isNew, COALESCE(SUM(cb.isAvailable = TRUE), 0) as availableCopies, COALESCE(MIN(CASE WHEN cb.isAvailable = TRUE THEN cb.id END), MIN(cb.id)) as copyBookId 
            FROM booksInLibrary bil 
            JOIN books b ON bil.bookId = b.id 
            LEFT JOIN copyBook cb ON cb.bookInLibraryId = bil.id 
            WHERE bil.libraryId = ? AND bil.isNew = TRUE 
            GROUP BY b.id, b.nameBook, b.author, b.numOfPages, b.publishingYear, b.summary, b.category, b.image, bil.isNew 
            LIMIT 8`, 
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
            `SELECT b.id, b.nameBook, b.author, b.numOfPages, b.publishingYear, b.summary, b.category, b.image, bil.isNew, 
            COALESCE(SUM(cb.isAvailable = TRUE), 0) as availableCopies, 
            COALESCE(MIN(CASE WHEN cb.isAvailable = TRUE THEN cb.id END), MIN(cb.id)) as copyBookId, 1 as recommended 
            FROM booksInLibrary bil 
            JOIN books b ON bil.bookId = b.id 
            LEFT JOIN copyBook cb ON cb.bookInLibraryId = bil.id 
            WHERE bil.libraryId = ? AND b.category = ? 
            GROUP BY b.id, b.nameBook, b.author, b.numOfPages, b.publishingYear, b.summary, b.category, b.image, bil.isNew 
            LIMIT 8`, 
            [libraryId, category]
        );
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

async function updateBook(id,nameBook, author, numOfPages,publishingYear,summary,image,category) {
    try {
        const [rows] = await pool.query(
            "UPDATE Books SET nameBook = ?, author = ?, numOfPages = ?, publishingYear = ?, summary = ?, image = ?, category = ? WHERE id = ?",
            [nameBook, author, numOfPages, publishingYear, summary, image, category, id]
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

module.exports = { getBooks, getBooksForAdmin, getBooksForUser, getfilteredBooks, getfilteredBooksForAdmin, getfilteredBooksForUser, getNewBooks, getBook, createBook, updateBook, deleteBook, getRecommendedCategory, getRecommendedBooksForYou, getSingleByUserName};

