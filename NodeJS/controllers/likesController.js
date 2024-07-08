const model = require("../models/likesModel");

async function getAll(libraryId) {
    try {
        const response = libraryId? await model.getlikes(libraryId)
        : await model.getAlllikes()
        return response
    } catch (err) {
        throw err
    }
}

async function update(bookId, userId) {
    try {
        const likeId = await model.checkLike(bookId, userId)
        if(likeId.length > 0)
            return await model.deleteLike(likeId[0].id)
        else
            return await model.createLike(bookId, userId)
    } catch (err) {
        throw err
    }
}

module.exports = { getAll, update};
