const model = require('../models/usersModel')
const bcrypt = require('bcrypt')
const { confirmPassword } = require('./passwordsController')
const saltRounds = 10

async function getUsers(roleId, userId) {
    try {
        if(roleId)
            return await model.getByroleId(roleId)
        else if(userId)
            return await model.getSingle(userId)
        return await model.getAllUsers()
    } catch (err) {
        throw err
    }
}

async function getSingle(id) {
    try {
        return await model.getUser(id)
    } catch (err) {
        throw err
    }
}
async function warningUser(userId) {
    try {
        return await model.warningUser(userId)
    } catch (err) {
        throw err
    }
}

async function authenticateLogin(username, password) {
    try {
        const user = await getByUsername(username)

        if (!user) {
            return null
        } else {
            const confirm = await confirmPassword(user.passwordId, password)
            if (confirm) {
                return user
            } else {
                return 1//?
            }
        }
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch book' });
    }
}

async function getByUsername(username) {
    try {
        return await model.getByUsername(username)
    } catch (err) {
        throw err
    }
}

async function create(username, phone, email, address, subscriptionTypeId, roleId, libraryId, password) {
    try {
     const validate = await model.validateUsername(username)
     if (validate){
        return null
    } else {
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        return await model.createUser(username, phone, email, address, subscriptionTypeId, roleId, libraryId, hashedPassword)
    }
    } catch (err) {
        throw err
    }
}

module.exports = { getUsers, getSingle, getByUsername ,create, authenticateLogin, warningUser}
