const { DataTypes } = require('sequelize')
const db = require('../db/connection')

const User = db.sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        avatar: {
            type: DataTypes.STRING
        },
        background: {
            type: DataTypes.STRING
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 1
        }
    }, {
        timestamps: true
    })

module.exports = db.sequelize.model('User', User);