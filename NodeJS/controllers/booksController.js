const model = require('../models/booksModel')

async function getAll(libraryId, query, userId, limit, offset) {
    try {
        //books
        if(libraryId && !query && !userId)
            return await model.getBooks(libraryId, limit, offset);
        if(!libraryId && !query && !userId)
            return await model.getBooksForAdmin(limit, offset);
        if(libraryId && !query && userId)
            return await model.getBooksForUser(libraryId, limit, offset);
        
        //filtered books
        if(libraryId && query && !userId)
            return await model.getfilteredBooks(query, libraryId, limit, offset);
        if(!libraryId && query && !userId)
            return await model.getfilteredBooksForAdmin(query, limit, offset);
        if(libraryId && query && userId)
            return await model.getfilteredBooksForUser(query, libraryId, limit, offset);
        
    } catch (err) {
        throw err
    }
}

async function getRecommendedForYou(libraryId, userId) {
    try {
        const mostUsedUserCategory = await model.getRecommendedCategory(userId)
       
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

async function getSingleByUserName(namebook) {
    try {
        return await model.getSingleByUserName(namebook)
    } catch (err) {
        throw err
    }
}

async function create(nameBook, author, numOfPages, publishingYear, summary, image, category) {
    try {
        return await model.createBook(nameBook, author, numOfPages, publishingYear, summary, image, category)
    } catch (err) {
        throw err
    }
}

async function update(bookId,nameBook, author, numOfPages,publishingYear,summary,image,category) {
    try {
        return await model.updateBook(bookId,nameBook, author, numOfPages,publishingYear,summary,image,category)
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

module.exports = { getAll, getSingle, create, update, deleteB, getRecommendedForYou, getSingleByUserName }