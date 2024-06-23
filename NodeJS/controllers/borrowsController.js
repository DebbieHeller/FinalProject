const model = require("../models/borrowsModel");

async function getAll(userId) {
  try {
    return await model.getborrows(userId);
  } catch (err) {
    throw err;
  }
}
async function update(commentId, title, body, userId, bookId) {
  try {
      return await model.updateComment(commentId,title, body, userId,bookId)
  } catch (err) {
      throw err
  }
}
async function getSingle(id) {
  try {
      return await model.getBorrow(id)
  } catch (err) {
      throw err
  }
}

async function update(borrowId, copyBookId, userId, borrowDate, returnDate,status,isReturned,isIntact) {
  try {
      return await model.updateBorrow(borrowId, copyBookId, userId, borrowDate, returnDate,status,isReturned,isIntact)
  } catch (err) {
      throw err
  }
}


module.exports = { getAll ,update,getSingle};
