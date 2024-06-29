const model = require("../models/messagesModel");

async function getUserMessages(userId) {
    try {
        return await model.getMessages(userId)
    } catch (err) {
        throw err
    }
}

async function update(id, status, readDate) {
    try {
        return await model.updateMessage(id, status, readDate)
    } catch (err) {
        throw err
    }
}

module.exports = { getUserMessages, update };
