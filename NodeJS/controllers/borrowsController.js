const model = require("../models/borrowsModel");

async function getAll(userId) {
  try {
    return await model.getborrows(userId);
  } catch (err) {
    throw err;
  }
}

async function getPrevBorrows(userId) {
  try {
    return await model.prevBorrows(userId);
  } catch (err) {
    throw err;
  }
}

async function getInspectorBorrows() {
  try {
    return await model.getInspectorBorrows();
  } catch (err) {
    throw err;
  }
}

async function getSingle(id) {
  try {
      return await model.getBorrow(id)
  } catch (err) {
      throw err
  }
}
async function updateBorrowByInspector(borrowId, copyBookId, userId, borrowDate, returnDate,status,isReturned,isIntact) {
  try {
      return await model.updateBorrowByInspector(borrowId, copyBookId, userId, borrowDate, returnDate,status,isReturned,isIntact)
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
async function create( copyBookId, userId, borrowDate, returnDate,status,isReturned,isIntact) {
  try {
      return await model.createBorrow(copyBookId, userId, borrowDate, returnDate,status,isReturned,isIntact)
  } catch (err) {
      throw err
  }
}


module.exports = { getAll ,update, getSingle, create, getPrevBorrows,getInspectorBorrows,updateBorrowByInspector};
