import { Request, Response } from "express";

import { PrismaClient, Role } from "@prisma/client";
const prisma = new PrismaClient();

export const createComment = async (
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
            throw "post non trouvé";
        }
        const comment = await prisma.comment.create({
            data: {
                postId: +req.params.id,
                authorId: req.auth.userId,
                content: req.body.content,
            },
        });
        return res.status(201).json({
            comment: {
                ...comment,
                author: {
                    firstName: req.auth.firstName,
                    lastName: req.auth.lastName,
                    avatar: req.auth.avatar,
                },
            },
            message: "Commentaire enregistré",
        });
    } catch (error) {
        return res.status(400).json({ error });
    }
};

export const modifyComment = async (
    req: Request,
    res: Response
) => {
    try {
        let authorUpdate: Role = "USER";
        const post = await prisma.post.findUnique({
            where: {
                id: +req.params.id,
            },
        });
        const comment = await prisma.comment.findUnique({
            where: {
                id: +req.params.comId,
            },
        });
        if (!post || !comment) {
            throw "Post/Commentaire introuvable";
        }
        if (
            comment.authorId == req.auth.userId ||
            req.auth.role == "ADMIN" ||
            req.auth.role == "MODERATOR"
        ) {
            if (comment.authorId != req.auth.userId) {
                authorUpdate = req.auth.role;
            }
            await prisma.comment.updateMany({
                where: {
                    id: +req.params.comId,
                },
                data: {
                    content: req.body.content,
                    updatedBy: authorUpdate,
                },
            });
            const updateComment = await prisma.comment.findUnique({
                where: {
                    id: +req.params.comId,
                },
            });
            return res.status(200).json({
                comment: {
                    ...updateComment,
                    author: {
                        firstName: req.auth.firstName,
                        lastName: req.auth.lastName,
                        avatar: req.auth.avatar,
                    },
                },
                message: "Commentaire modifié",
            });
        }
        return res.status(403).json({ error: "action non autorisée" });
    } catch (error) {
        return res.status(403).json({ error });
    }
};

export const deleteComment = async (
    req: Request,
    res: Response
) => {
    try {
        const post = await prisma.post.findUnique({
            where: {
                id: +req.params.id,
            },
        });
        const comment = await prisma.comment.findUnique({
            where: {
                id: +req.params.comId,
            },
        });
        if (!post || !comment) {
            throw "Post/Commentaire introuvable";
        }
        if (
            comment.authorId == req.auth.userId ||
            req.auth.role == "ADMIN" ||
            req.auth.role == "MODERATOR"
        ) {
            await prisma.comment.delete({
                where: {
                    id: +req.params.comId,
                },
            });
            return res.status(200).json({ message: "Commentaire supprimé" });
        }
        return res.status(403).json({ error: "action non autorisée" });
    } catch (error) {
        return res.status(403).json({ error });
    }
};
