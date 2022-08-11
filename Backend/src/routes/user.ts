import express from 'express';
import rateLimit from 'express-rate-limit';
import auth from '../middleware/auth';
import multer from 'multer';
import { fileStorage, fileLimits, multerFileFilter} from '../middleware/multer-config';

import * as userCtrl from '../controllers/user';
import passwordValidator from '../middleware/password';
import emailValidator from '../middleware/email';

const router = express.Router();
const limiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 60 minutes
	max: 5, // Limit each IP to 5 requests per `window` (here, per 60 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

router.post('/signup', limiter, emailValidator, passwordValidator, userCtrl.signup);

router.post('/login', userCtrl.login);

router.put('/:id', auth, multer({storage: fileStorage, limits: fileLimits, fileFilter: multerFileFilter}).fields([{name: 'avatar', maxCount: 1}, {name: 'bgImg', maxCount: 1}]), userCtrl.modify)

router.delete('/:id', auth, userCtrl.deleteUser)

router.get('/:id', auth, userCtrl.getUserProfile);

export default router;