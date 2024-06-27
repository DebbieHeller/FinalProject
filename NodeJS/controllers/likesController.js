const model = require("../models/likesModel");

async function getAll(libraryId) {
    try {
        return await model.getlikes(libraryId)
    } catch (err) {
        throw err
    }
}

async function updateLikes(bookId) {
    try {
        return await model.updateLikes(bookId)
    } catch (err) {
        throw err
    }
}

module.exports = { getAll, updateLikes};
