const { Sequelize } = require('sequelize');

require('dotenv').config();

const mySQLUser = process.env.MYSQL_USER;
const mySQLPassword = process.env.MYSQL_PASSWORD;
const mySQLDatabase = process.env.MYSQL_DATABASE;


const sequelize = new Sequelize(mySQLDatabase, mySQLUser, mySQLPassword, {
        host: '127.0.0.1',
        dialect: 'mysql'
    });

    module.exports.sequelize = sequelize;