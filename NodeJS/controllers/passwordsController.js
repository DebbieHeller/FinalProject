const model = require("../models/passwordsModel");
const bcrypt = require("bcrypt");

async function confirmPassword(passwordId, password) {
  try {
    const originalPassword = await model.getPassword(passwordId);
    const isMatch = await bcrypt.compare(password, String(originalPassword));
    return isMatch;
  } catch (err) {
    throw err;
  }
}

module.exports = { confirmPassword };
