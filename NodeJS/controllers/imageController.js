const pool = require('../LibraryDB');
const fs = require('fs');
const path = require('path');
const { update } = require('../controllers/booksController');

// קריאת קבצי התמונה מהתיקייה
fs.readdir('./images', async (err, files) => {
    if (err) {
        console.error('Unable to scan directory: ' + err);
        return;
    }

    for (const file of files) {
        const imagePath = path.join('./images', file);

        // ערכים לדוגמה - יש להחליף בערכים המתאימים לכל ספר
        const bookId = 1;  // יש להחליף בערך המתאים לכל ספר
        const nameBook = 'Book Name';
        const author = 'Author Name';
        const numOfPages = 300;
        const publishingYear = 2020;
        const likes = 100;
        const summary = 'This is a summary.';
        const unitsInStock = 10;
        const category = 'Fiction';
        const libraryId = 1;
        const isNew = false;

        try {
            await update(bookId, nameBook, author, numOfPages, publishingYear, likes, summary, imagePath, unitsInStock, category, libraryId, isNew);
            console.log('Book updated successfully');
        } catch (err) {
            console.error('Error updating book in database: ' + err);
        }
    }
});
