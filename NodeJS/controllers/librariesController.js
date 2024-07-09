const model = require('../models/librariesModel')

async function getAll() {
    try {
        return await model.getLibraries()
    } catch (err) {
        throw err
    }
}

async function create(libraryName, address, phone) {
    try {
        // const libraries = await model.getLibraries();
        // const userIsManager = libraries.some(library => library.userId == userId);
        // if (userIsManager) {
        //     return null
        // }
        return await model.createLibrary(libraryName, address, phone)
    } catch (err) {
        throw err
    }
}

module.exports = { getAll, create }