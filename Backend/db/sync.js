const db = require('./connection')

const UserModel = require('../models/user')

const sync = () => {
    UserModel.User.sync({force: true})
}

module.exports = sync;