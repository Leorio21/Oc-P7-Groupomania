import express  from "express";
import rateLimit from 'express-rate-limit';
import auth from '../middleware/auth';
import multer from 'multer';
import { fileStorage, fileLimits, multerFileFilter} from '../middleware/multer-config';

import * as postCtrl from '../controllers/post'


const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 60 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

const limiterPost = rateLimit({
	windowMs: 60 * 60 * 1000, // 60 minutes
	max: 15, // Limit each IP to 15 requests per `window` (here, per 60 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

const router = express.Router();

router.get('/', auth, limiter, postCtrl.getAllPost);

router.post('/', auth, limiterPost, multer({storage: fileStorage, limits: fileLimits, fileFilter: multerFileFilter}).single('photo'), postCtrl.createPost);

router.put('/:id', auth, limiter, multer({storage: fileStorage, limits: fileLimits, fileFilter: multerFileFilter}).single('photo'), postCtrl.modifyPost);

router.delete('/:id', auth, limiter, postCtrl.deletePost);

router.post('/:id/like', auth, limiter, postCtrl.likePost);

router.post(':id/comment', auth, limiter, postCtrl.createComment);

router.put(':id/comment', auth, limiter, postCtrl.modifyComment);

router.delete(':id/comment', auth, limiter, postCtrl.deleteComment);

export default router;