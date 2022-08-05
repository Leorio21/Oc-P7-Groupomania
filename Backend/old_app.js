const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit')
const path = require('path');
require('dotenv').config();

const mongoDbUser = process.env.MONGODB_USER;
const mongoDbPassword = process.env.MONGODB_PASSWORD;
const mongoDbCluster = process.env.MONGODB_CLUSTER;

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

const app = express();

const limiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Apply the rate limiting middleware to all requests
app.use(limiter)

app.use(helmet());

try {
    mongoose.connect(`mongodb+srv://${mongoDbUser}:${mongoDbPassword}@${mongoDbCluster}/?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true });
    console.log('Connexion à MongoDB réussi !');
} catch (error) {
    console.log('Connexion à MongoDB échoué !');
}

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(mongoSanitize({
    allowDots: true,
    replaceWith: '_'
}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
    next();
});

app.use('/api/auth', userRoutes);

app.use('/api/sauces', sauceRoutes);

app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;