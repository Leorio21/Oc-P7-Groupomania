import express from "express";
import rateLimit from "express-rate-limit";
import auth from "../middleware/auth";
import multer from "multer";
import {
    fileStorage,
    fileLimits,
    multerFileFilter,
} from "../middleware/multer-config";

import * as userCtrl from "../controllers/user";
import passwordValidator from "../middleware/password";
import emailValidator from "../middleware/email";

const router = express.Router();
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 10, // Limit each IP to 5 requests per `window` (here, per 60 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

router.post(
    "/signup",
    limiter,
    emailValidator,
    passwordValidator,
    userCtrl.signup,
    userCtrl.login
);

router.post("/login", userCtrl.login);

router.put(
    "/user/:id",
    auth,
    multer({
        storage: fileStorage,
        limits: fileLimits,
        fileFilter: multerFileFilter,
    }).fields([
        { name: "avatar", maxCount: 1 },
        { name: "bgPicture", maxCount: 1 },
    ]),
    userCtrl.modify
);

router.delete("/user/:id", auth, userCtrl.deleteUser);

router.get("/user/:id", auth, userCtrl.getUserProfile);

router.get("/connect", auth, userCtrl.getUser);

router.get("/members", auth, userCtrl.getAllUser);

export default router;
