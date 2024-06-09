const pool = require('../LibraryDB');
const fs = require('fs');
const path = require('path');

// קריאת קבצי התמונה מהתיקייה
fs.readdir('./images', (err, files) => {
    if (err) {
        console.error('Unable to scan directory: ' + err);
        return;
    }

    files.forEach(file => {
        const imagePath = path.join('./images', file);
        
        // הכנסת הנתיב לתמונה לבסיס הנתונים
        pool.query('INSERT INTO books (nameBook, author, numOfPages, publishingYear, likes, summary, image, unitsInStock, category, libraryId, isNew) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            ['Book Name', 'Author Name', 300, 2020, 100, 'This is a summary.', imagePath, 10, 'Fiction', 1, false],
            (err, result) => {
                if (err) {
                    console.error('Error inserting image path into database: ' + err);
                    return;
                }

                console.log('Image path inserted successfully');
            });
    });
});
