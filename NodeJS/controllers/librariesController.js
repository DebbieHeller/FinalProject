const model = require('../models/librariesModel')

async function getAll() {
    try {
        return await model.getLibraries()
    } catch (err) {
        throw err
    }
}

module.exports = { getAll }