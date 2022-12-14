import fs from "fs/promises";
import { Request, Response } from "express";

import { PrismaClient, Role } from "@prisma/client";
import sharp from "sharp";
const prisma = new PrismaClient();

export const getAllPost = async (
    _req: Request,
    res: Response
) => {
    try {
        const posts = await prisma.post.findMany({
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
                                avatar: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return res.status(200).json(posts);
    } catch (error) {
        return res.status(400).json({ error });
    }
};

export const createPost = async (
    req: Request,
    res: Response
) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    let imageName: string | null = null;
    let imageExt: string | null = null;
    let newImage = false;
    try {
        if (!files["photo"] && req.body.content === "") {
            throw "Impossible de publier un post vide";
        }
        if (files["photo"]) {
            imageExt = files["photo"][0].filename.split(".")[1];
            imageName = files["photo"][0].filename;
            if (imageExt !== "gif" && imageExt !== "webp") {
                imageName = files["photo"][0].filename.split(".")[0] + ".webp";
                try {
                    await sharp(`./images/${files["photo"][0].filename}`).toFile(
                        `images/${imageName}`
                    );
                } catch {
                    throw "Erreur traiement image";
                }
            }
            newImage = true;
        }
        const newPost = await prisma.post.create({
            data: {
                authorId: req.auth.userId,
                content: req.body.content,
                image:
                    imageName &&
                    `${req.protocol}://${req.get("host")}/images/${imageName}`,
            },
        });
        return res.status(201).json({
            post: newPost,
            message: "Post enregistr??",
        });
    } catch (error) {
        if (files["photo"] && newImage) {
            fs.unlink(`images/${imageName}`);
        }
        return res.status(400).json({ error });
    } finally {
        if (files["photo"] && imageExt !== "gif" && imageExt !== "webp") {
            await fs.unlink(`images/${files["photo"][0].filename}`);
        }
    }
};

export const modifyPost = async (
    req: Request,
    res: Response
) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    let imageName: string = req.body.image;
    let imageExt: string | null = null;
    let oldImage: string | null = "";
    let newImage = false;
    try {
        if (!files["photo"] && req.body.content === "") {
            throw "Impossible de publier un post vide";
        }
        let authorUpdate: Role = "USER";
        const post = await prisma.post.findUnique({
            where: {
                id: +req.params.id,
            },
        });
        if (!post) {
            throw "Post";
        }
        if (
            post.authorId == req.auth.userId ||
            req.auth.role == "ADMIN" ||
            req.auth.role == "MODERATOR"
        ) {
            if (post.authorId != req.auth.userId) {
                authorUpdate = req.auth.role;
            }
            oldImage = post.image;
            if (files["photo"]) {
                imageExt = files["photo"][0].filename.split(".")[1];
                imageName = files["photo"][0].filename;
                if (imageExt !== "gif" && imageExt !== "webp") {
                    imageName = files["photo"][0].filename.split(".")[0] + ".webp";
                    try {
                        await sharp(
                            `./images/${files["photo"][0].filename}`
                        ).toFile(`images/${imageName}`);
                    } catch {
                        throw "Erreur traiement image";
                    }
                }
                newImage = true;
            }
            if (
                (newImage && oldImage) ||
                (imageName == "" && oldImage != "" && oldImage != null)
            ) {
                const oldImageName = oldImage!.split("/images/")[1];
                await fs.unlink(`images/${oldImageName}`);
                post.image = "";
            }
            await prisma.post.updateMany({
                where: {
                    id: +req.params.id,
                },
                data: {
                    content: req.body.content,
                    image: newImage
                        ? `${req.protocol}://${req.get(
                            "host"
                        )}/images/${imageName}`
                        : post.image,
                    updatedBy: authorUpdate,
                },
            });
            return res.status(200).json({
                post: {
                    content: req.body.content,
                    image: newImage
                        ? `${req.protocol}://${req.get(
                            "host"
                        )}/images/${imageName}`
                        : post.image,
                    updatedBy: authorUpdate,
                },
                message: "Commentaire modifi??",
            });
        }
        return res.status(403).json({ error: "action non autoris??e" });
    } catch (error) {
        if (files["photo"] && newImage) {
            fs.unlink(`images/${imageName}`);
        }
        return res.status(400).json({ error });
    } finally {
        if (files["photo"] && imageExt !== "gif" && imageExt !== "webp") {
            await fs.unlink(`images/${files["photo"][0].filename}`);
        }
    }
};

export const deletePost = async (
    req: Request,
    res: Response
) => {
    try {
        const post = await prisma.post.findUnique({
            where: {
                id: +req.params.id,
            },
        });
        if (!post) {
            throw "Post introuvable";
        }
        if (
            post.authorId == req.auth.userId ||
            req.auth.role == "ADMIN" ||
            req.auth.role == "MODERATOR"
        ) {
            await prisma.post.delete({
                where: {
                    id: +req.params.id,
                },
            });
            if (post.image) {
                const imageName = post.image.split("/images/")[1];
                await fs.unlink(`images/${imageName}`);
            }
            return res.status(200).json({ message: "Post supprim??" });
        }
        return res.status(403).json({ error: "action non autoris??e" });
    } catch (error) {
        return res.status(403).json({ error });
    }
};
