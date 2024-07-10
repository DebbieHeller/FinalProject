const model = require("../models/borrowsModel");
const userModel=require("../models/usersModel")

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
async function getUnFixBorrows(libraryId) {
  try {
    return await model.getUnFixBorrows(libraryId);
  } catch (err) {
    throw err;
  }
}

async function getTerriableUser(userId) {
  try {
    return await model.getTerriableUser(userId);
  } catch (err) {
    throw err;
  }
}
async function getInspectorBorrows(libraryId, date) {
  try {
    const borrows = date? await model.getLateBorrows(libraryId, date)
    : await model.getInspectorBorrows(libraryId)
    return borrows
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
async function updateBorrowByInspector(borrowId,copyBookId,isReturned,isIntact,statusBorrow, userId, status) {
  try {
    const updated = status? await model.updateStatusBorrow(borrowId,status)
    : await model.updateBorrowByInspector(borrowId,copyBookId,isReturned,isIntact)
    (statusBorrow == 'Overdue-Returned' && isIntact && await userModel.freeUser(userId))
    return updated;
  } catch (err) {
      throw err
  }
}
async function update(borrowId, returnDate,status) {
  try {
      return await model.updateBorrow(borrowId, returnDate,status)
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


module.exports = { getAll ,update, getSingle, create, getPrevBorrows,getInspectorBorrows,updateBorrowByInspector,getUnFixBorrows,getTerriableUser};
