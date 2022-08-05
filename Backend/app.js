const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');

const db = require('./db/connection')

require('dotenv').config();

const userRoutes = require('./routes/user');

const app = express();

db.sequelize.authenticate()
    .then (() => {
        console.log('Connection BDD établie')
        db.sequelize.sync({force: true}) //{force: true}
    })
    .catch ((error) => console.error(`Connection BDD impossible : ${error}`)) 


app.use(cors());
app.use(helmet());


app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
    next();
});

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRoutes);

module.exports = app;

