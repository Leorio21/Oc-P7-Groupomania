import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sharp from "sharp";
import fs from "fs/promises";
import { Request, Response, NextFunction } from "express";
import { passwordSchema } from "../middleware/password";

import { PrismaClient, User } from "@prisma/client";
const prisma = new PrismaClient();

export const signup = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!passwordSchema.validate(req.body.password)) {
        return res
            .status(400)
            .json({ error: "Le mot de passe n'est pas assez sécurisé" });
    }
    if (req.body.password !== req.body.confirmPassword) {
        throw "Les mots de passe ne correspondent pas";
    }
    try {
        if (
            await prisma.user.findUnique({
                where: {
                    email: req.body.email,
                },
            })
        ) {
            throw `Un utilisateur est déjà enregistré avec cette adresse em@il : ${req.body.email}`;
        }
        const [lastName, firstName]: string[] = req.body.email
            .split("@")[0]
            .split(".");
        const hash: string = await bcrypt.hash(req.body.password, 12);
        await prisma.user.create({
            data: {
                firstName: firstName,
                lastName: lastName,
                email: req.body.email,
                password: hash,
            },
        });
        return next();
    } catch (error) {
        return res.status(400).json({ error });
    }
};

export const login = async (
    req: Request,
    res: Response
) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: req.body.email,
            },
        });
        if (!user) {
            throw "Nom d'utilisateur / Mot de passe incorrect";
        }
        const valid: boolean = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!valid) {
            throw "Nom d'utilisateur / Mot de passe incorrect";
        }
        return res.status(200).json({
            token: jwt.sign(
                {
                    userId: user.id,
                },
                process.env.RANDOM_KEY_TOKEN!,
                { expiresIn: "48h" }
            ),
        });
    } catch (error) {
        return res.status(404).json({ error });
    }
};

export const getAllUser = async (
    req: Request,
    res: Response
) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
            },
        });
        return res.status(200).json({ users });
    } catch (error) {
        return res.status(404).json({ error });
    }
};

export const getUser = async (
    req: Request,
    res: Response
) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.auth.userId,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                avatar: true,
                background: true,
                role: true,
            }
        });
        if (!user) {
            throw "Utilisateur introuvable";
        }
        return res.status(200).json({
            token: jwt.sign(
                {
                    userId: user.id,
                },
                process.env.RANDOM_KEY_TOKEN!,
                { expiresIn: "48h" }
            ),
            user: user
        });
    } catch (error) {
        return res.status(404).json({ error });
    }
};

export const modify = async (
    req: Request,
    res: Response
) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    let bgImageName: string = req.body.userBg;
    let bgImageExt: string | null = null;
    let oldBgImage: string | null = "";
    let newBgImage = false;
    let avatarImageName: string = req.body.userAvatar;
    let avatarImageExt: string | null = null;
    let oldAvatarImage: string | null = "";
    let newAvatarImage = false;
    try {
        if (req.body.newPassword) {
            if (!passwordSchema.validate(req.body.newPassword)) {
                throw "Le mot de passe n'est pas assez sécurisé";
            }
            if (req.body.newPassword !== req.body.confirmNewPassword) {
                throw "Les mots de passe ne correspondent pas";
            }
        }
        let adminUser: User | null;
        let validAdmin = false;
        const user = await prisma.user.findUnique({
            where: {
                id: +req.params.id,
            },
        });
        if (!user) {
            throw "Utilisateur introuvable";
        }
        if (req.auth.role === "ADMIN") {
            adminUser = await prisma.user.findUnique({
                where: {
                    id: +req.auth.userId,
                },
            });
            if (!adminUser) {
                throw "Modifications non autorisées";
            }
            validAdmin = await bcrypt.compare(
                req.body.password,
                adminUser.password
            );
        }
        const validUser: boolean = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (validUser || validAdmin) {
            if (req.body.newPassword) {
                user.password = await bcrypt.hash(req.body.newPassword, 12);
            }
            oldAvatarImage = user.avatar;
            if (files["avatar"]) {
                avatarImageExt = files["avatar"][0].filename.split(".")[1];
                avatarImageName = files["avatar"][0].filename;
                if (avatarImageExt !== "gif" && avatarImageExt !== "webp") {
                    avatarImageName = files["avatar"][0].filename.split(".")[0] + ".webp";
                    try {
                        await sharp(
                            `./images/${files["avatar"][0].filename}`
                        ).toFile(`images/${avatarImageName}`);
                    } catch {
                        throw "Erreur traitement image avatar";
                    }
                }
                newAvatarImage = true;
            }
            if (
                (newAvatarImage && oldAvatarImage) ||
                (avatarImageName === "" &&
                    oldAvatarImage !== "" &&
                    oldAvatarImage !== null)
            ) {
                const oldAvatarName = oldAvatarImage!.split("/images/")[1];
                await fs.unlink(`images/${oldAvatarName}`);
                user.avatar = "";
            }
            oldBgImage = user.background;
            if (files["bgPicture"]) {
                bgImageExt = files["bgPicture"][0].filename.split(".")[1];
                bgImageName = files["bgPicture"][0].filename;
                if (bgImageExt !== "gif" && bgImageExt !== "webp") {
                    bgImageName = files["bgPicture"][0].filename.split(".")[0] + ".webp";
                    try {
                        await sharp(
                            `./images/${files["bgPicture"][0].filename}`
                        ).toFile(`images/${bgImageName}`);
                    } catch {
                        throw "Erreur traitement image de fond";
                    }
                }
                newBgImage = true;
            }
            if (
                (newBgImage && oldBgImage) ||
                (bgImageName === "" && oldBgImage !== "" && oldBgImage !== null)
            ) {
                const oldBgName = oldBgImage!.split("/images/")[1];
                await fs.unlink(`images/${oldBgName}`);
                user.background = "";
            }
            if (validAdmin) {
                user.firstName = req.body.firstName;
                user.lastName = req.body.lastName;
                user.email = req.body.email;
                if (+req.params.id !== req.auth.userId) {
                    user.role = req.body.role;
                }
            }
            await prisma.user.update({
                where: {
                    id: +req.params.id,
                },
                data: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    password: user.password,
                    avatar: newAvatarImage ? `${req.protocol}://${req.get(
                        "host"
                    )}/images/${avatarImageName}` : user.avatar,
                    background: newBgImage ? `${req.protocol}://${req.get(
                        "host"
                    )}/images/${bgImageName}` : user.background,
                    role: user.role,
                },
            });
            const updatedUser = await prisma.user.findUnique({
                where: {
                    id: +req.params.id,
                },
                select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                    avatar: true,
                    background: true,
                    role: true,
                }
            });
            return res.status(201).json({
                user: updatedUser,
                message: "Utilisateur modifié !"
            });
        }
        return res.status(403).json({ error: "action non autorisée" });
    } catch (error) {
        return res.status(403).json({ error });
    } finally {
        if (files["avatar"] && avatarImageExt !== "gif" && bgImageExt !== "webp") {
            await fs.unlink(`images/${files["avatar"][0].filename}`);
        }
        if (files["bgPicture"] && bgImageExt !== "gif" && bgImageExt !== "webp") {
            await fs.unlink(`images/${files["bgPicture"][0].filename}`);
        }
    }
};

export const deleteUser = async (
    req: Request,
    res: Response
) => {
    try {
        let adminUser: User | null;
        let validAdmin = false;
        const user = await prisma.user.findUnique({
            where: {
                id: +req.params.id,
            },
        });
        if (!user) {
            throw "Utilisateur introuvable";
        }
        if (req.auth.role === "ADMIN") {
            adminUser = await prisma.user.findUnique({
                where: {
                    id: +req.auth.userId,
                },
            });
            if (!adminUser || adminUser.role != "ADMIN") {
                throw "Utilisateur introuvable";
            }
            validAdmin = await bcrypt.compare(
                req.body.password,
                adminUser.password
            );
        }
        const validUser: boolean = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (validUser || validAdmin) {
            if (user.background) {
                await fs.unlink(`images/${user.background.split("images/")[1]}`);
            }
            if (user.avatar) {
                await fs.unlink(`images/${user.avatar.split("images/")[1]}`);
            }
            await prisma.user.delete({
                where: {
                    id: +req.params.id,
                },
            });
            return res.status(200).json({ message: "Utilisateur supprimé" });
        }
        return res.status(403).json({ error: "action non autorisée" });
    } catch (error) {
        return res.status(403).json({ error });
    }
};

export const getUserProfile = async (
    req: Request,
    res: Response
) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: +req.params.id,
            },
            select: {
                firstName: true,
                lastName: true,
                email: true,
                avatar: true,
                background: true,
                role: true,
                post: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                avatar: true,
                            },
                        },
                        like: {
                            include: {
                                user: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                    },
                                },
                            },
                        },
                        comment: {
                            include: {
                                author: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                    },
                                },
                            },
                        },
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                },
            },
        });
        if (!user) {
            return res.status(404).json({ error: "Utilisateur introuvable" });
        }
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(400).json({ error });
    }
};
