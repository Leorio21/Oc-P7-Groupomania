"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerFileFilter = exports.fileLimits = exports.fileStorage = void 0;
const multer_1 = __importDefault(require("multer"));
const mimeType_1 = __importDefault(require("../Utils/mimeType"));
exports.fileStorage = multer_1.default.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const finalName = name.split('.')[0];
        const extension = mimeType_1.default.get(file.mimetype);
        console.log(finalName);
        callback(null, finalName + Date.now() + '.' + extension);
    }
});
exports.fileLimits = {
    fileSize: 10 * 1024 * 1024
};
const multerFileFilter = (req, file, callback) => {
    if (mimeType_1.default.get(file.mimetype)) {
        callback(null, true);
    }
    else {
        callback(null, false);
    }
};
exports.multerFileFilter = multerFileFilter;
