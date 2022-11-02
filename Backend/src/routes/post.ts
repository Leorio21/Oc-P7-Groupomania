import express from "express";
import rateLimit from "express-rate-limit";
import auth from "../middleware/auth";
import multer from "multer";
import {
    fileStorage,
    fileLimits,
    multerFileFilter,
} from "../middleware/multer-config";

import * as postCtrl from "../controllers/post";
import * as commentCtrl from "../controllers/comment";
import * as likeCtrl from "../controllers/like";

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 10 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const limiterPost = rateLimit({
    windowMs: 30 * 60 * 1000, // 30 minutes
    max: 15, // Limit each IP to 15 requests per `window` (here, per 30 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const router = express.Router();

router.use(auth);

router.get("/", limiter, postCtrl.getAllPost);

router.post(
    "/",
    limiterPost,
    multer({
        storage: fileStorage,
        limits: fileLimits,
        fileFilter: multerFileFilter,
    }).fields([{ name: "photo", maxCount: 1 }]),
    postCtrl.createPost
);

router.put(
    "/:id",
    limiter,
    multer({
        storage: fileStorage,
        limits: fileLimits,
        fileFilter: multerFileFilter,
    }).fields([{ name: "photo", maxCount: 1 }]),
    postCtrl.modifyPost
);

router.delete("/:id", limiter, postCtrl.deletePost);

router.post("/:id/like", limiter, likeCtrl.likePost);

router.post("/:id/comment", limiterPost, commentCtrl.createComment);

router.put("/:id/comment/:comId", limiter, commentCtrl.modifyComment);

router.delete("/:id/comment/:comId", limiter, commentCtrl.deleteComment);

export default router;
