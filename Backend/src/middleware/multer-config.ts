import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import MIME_TYPES from "../Utils/mimeType";

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

export const fileStorage = multer.diskStorage({
    destination: (
        req: Request,
        file: Express.Multer.File,
        callback: DestinationCallback
    ): void => {
        callback(null, "images");
    },
    filename: (
        req: Request,
        file: Express.Multer.File,
        callback: FileNameCallback
    ): void => {
        const name = file.originalname.split(".")[0].split(" ").join("_");
        const extension = MIME_TYPES.get(file.mimetype);
        callback(null, name + Date.now() + "." + extension);
    },
});

export const fileLimits = {
    fileSize: 10 * 1024 * 1024,
};

export const multerFileFilter = (
    req: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback
): void => {
    if (MIME_TYPES.get(file.mimetype)) {
        callback(null, true);
    } else {
        callback(new Error("Format d'image incorrect"));
    }
};
