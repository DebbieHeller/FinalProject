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
async function getInspectorBorrows(libraryId) {
  try {
    return await model.getInspectorBorrows(libraryId);
  } catch (err) {
    throw err;
  }
}

async function getLateBorrows(libraryId,date) {
  try {
    return await model.getLateBorrows(libraryId,date);
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


module.exports = { getAll ,update, getSingle, create, getPrevBorrows,getInspectorBorrows,updateBorrowByInspector,getUnFixBorrows,getTerriableUser,getLateBorrows};
