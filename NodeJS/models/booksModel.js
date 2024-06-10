const mysql = require('mysql2');
const path = require('path');
const pool = require('../LibraryDB');  // הקובץ שמגדיר את החיבור לבסיס הנתונים

async function getBooks(libraryId) {
    try {
        const [rows] = await pool.query('SELECT * FROM Books WHERE libraryId=?', [libraryId]);
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

module.exports = { getBooks, getBook, createBook, updateBook, deleteBook };