const model = require('../models/commentsModel')

async function getAll(bookId) {
    try {
        return await model.getComments(bookId)
    } catch (err) {
        throw err
    }
}

async function getSingle(id) {
    try {
        return await model.getComment(id)
    } catch (err) {
        throw err
    }
}

async function create(title, body, userId, bookId) {
    try {
        return await model.createComment(title, body, userId, bookId)
    } catch (err) {
        throw err
    }
}

async function update(commentId, title, body, userId, bookId) {
    try {
        return await model.updateComment(commentId,title, body, userId,bookId)
    } catch (err) {
        throw err
    }
}

async function deleteC(id) {
    try {
        await model.deleteComment(id)
    } catch (err) {
        throw err
    }
}

module.exports = { getAll, getSingle, create, update, deleteC }