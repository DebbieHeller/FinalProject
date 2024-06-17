const model = require('../models/usersModel')
const bcrypt = require('bcrypt')
const saltRounds = 10

async function getSingle(id) {
    try {
        return await model.getUser(id)
    } catch (err) {
        throw err
    }
}

async function getByUsername(username) {
    try {
        return await model.getByUsername(username)
    } catch (err) {
        throw err
    }
}

async function create(username,phone, email, address, subscriptionTypeId, roleId, libraryId, creditCardNumber, expirationDate, cvv, password) {
    try {
     const validate = await model.validateUsername(username)
     if (validate){
        return null
    } else {
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        return await model.createUser(username,phone, email, address, subscriptionTypeId, roleId, libraryId, creditCardNumber, expirationDate, cvv, hashedPassword)
    }
    } catch (err) {
        throw err
    }
}



module.exports = { getSingle, getByUsername ,create }