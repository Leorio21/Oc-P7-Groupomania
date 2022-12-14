import express from "express";
import helmet from "helmet";
import cors from "cors";
import path from "path";
import { Request, Response, NextFunction } from "express";
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";

import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

import userRoutes from "./routes/user";
import postRoutes from "./routes/post";

const imagesDir = path.join(__dirname, "images");

if (!existsSync(imagesDir)) {
    try {
        mkdir(imagesDir);
    } catch {
        console.log("Erreur lors de la création du dossier images");
    }
}

const app = express();

app.use("/images", express.static(imagesDir));

app.use(cors());
app.use(helmet());

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader("Cross-Origin-Resource-Policy", "*");
    next();
});

app.use("/api/auth", userRoutes);

app.use("/api/post", postRoutes);

export default app;
