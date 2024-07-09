const model = require("../models/messagesModel");

async function getUserMessages(userId, count) {
    try {
        const response = count? await model.getCountMessages(userId)
        :await model.getMessages(userId)
        return response;
    } catch (err) {
        throw err
    }
}

async function create(userId,title,body,status,createdDate) {
    try {
        return await model.createMessage(userId,title,body,status,createdDate)
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

module.exports = { getUserMessages, update ,create};
