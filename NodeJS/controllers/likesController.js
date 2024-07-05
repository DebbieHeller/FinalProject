const model = require("../models/likesModel");

async function getAll(libraryId) {
    try {
        const response = libraryId? await model.getlikes(libraryId)
        :await await model.getAlllikes()
        return response
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
