const model = require('../models/booksModel')

async function getAll(libraryId) {
    try {
        return await model.getBooks(libraryId)
    } catch (err) {
        throw err
    }
}
async function getAvailableBooks(libraryId) {
    try {
        return await model.getAvailableBooks(libraryId)
    } catch (err) {
        throw err
    }
}

async function getRecommendedForYou(libraryId, userId) {
    try {
        const mostUsedUserCategory = await model.getRecommendedCategory(userId)
        console.log("555555555")

        console.log(mostUsedUserCategory)
        if(mostUsedUserCategory){
            return await model.getRecommendedBooksForYou(libraryId, mostUsedUserCategory)
        }
        else{
            return await model.getNewBooks(libraryId)
        }
       
    } catch (err) {
        throw err
    }
}

async function getSingle(id) {
    try {
        return await model.getBook(id)
    } catch (err) {
        throw err
    }
}

async function create(nameBook, author, numOfPages,publishingYear,likes,summary,image,unitsInStock,category,libraryId,isNew) {
    try {
        return await model.createBook(nameBook, author, numOfPages,publishingYear,likes,summary,image,unitsInStock,category,libraryId,isNew)
    } catch (err) {
        throw err
    }
}

async function update(bookId,nameBook, author, numOfPages,publishingYear,likes,summary,image,unitsInStock,category,libraryId,isNew) {
    try {
        return await model.updateBook(bookId,nameBook, author, numOfPages,publishingYear,likes,summary,image,unitsInStock,category,libraryId,isNew)
    } catch (err) {
        throw err
    }
}

async function deleteB(id) {
    try {
        await model.deleteBook(id)
    } catch (err) {
        throw err
    }
}

module.exports = { getAll, getSingle, create, update, deleteB, getAvailableBooks, getRecommendedForYou }