const model = require("../models/subscriptionModel");

async function getsubscriptionType(userId) {
  try {
    return await model.getsubscriptionType(userId);
  } catch (err) {
    throw err;
  }
}

module.exports = {getsubscriptionType};
