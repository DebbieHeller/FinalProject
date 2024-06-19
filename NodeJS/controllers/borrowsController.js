const model = require("../models/borrowsModel");

async function getAll(userId) {
  try {
    return await model.getborrows(userId);
  } catch (err) {
    throw err;
  }
}
module.exports = { getAll };
