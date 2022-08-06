const express = require('express');
const rateLimit = require('express-rate-limit')
const router = express.Router();
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

const userCtrl = require('../controllers/user');
const passwordValidator = require ('../middleware/password')
const emailValidator = require('../middleware/email')

const limiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 60 minutes
	max: 5, // Limit each IP to 5 requests per `window` (here, per 60 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

router.post('/signup', limiter, emailValidator, passwordValidator, userCtrl.signup);

router.post('/login', userCtrl.login);

router.put('/:id', auth, multer.fields([{name: 'avatar'}, {name: 'bgImg'}]), userCtrl.modify)


module.exports = router;