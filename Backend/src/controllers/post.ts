import fs from 'fs/promises';
import { Request, Response, NextFunction } from 'express'

import { PrismaClient, Post, User } from '@prisma/client';
import sharp from 'sharp';
const prisma = new PrismaClient()

export const getAllPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.body.userId != req.auth.userId) {
        return res.status(403).json({ message: 'Action non autorisée' })
        }
        const posts = await prisma.post.findMany({
            orderBy: {
                createdAt: "desc"
            }
        })
        return res.status(200).json(posts)
    } catch (error) {
        return res.status(400).json({ error })
    }
}

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
    let imageName = null;
    let newImage = false;
    try {
        if (req.body.userId != req.auth.userId) {
            return res.status(403).json({ message: 'Action non autorisée' })
        }
        if (req.file) {
            imageName = (req.file.filename).split('.')[0] + '.webp'
            try {
                await sharp(`./images/${req.file.filename}`).toFile(`images/${imageName}`)
                newImage = true;
            } catch {
                throw ('Erreur traiement image')
            }
        }
        await prisma.post.create({
            data: {
                authorId: req.auth.userId,
                title: req.body.title,
                content: req.body.content,
                image: imageName
            },
        })
        return res.status(201).json({message: 'Post enregistré'})

    } catch (error) {
        if(req.file && newImage) {
            fs.unlink(`images/${imageName}`)
        }
        return res.status(400).json({ error })
    } finally {
        if (req.file) {
            await fs.unlink(`images/${req.file.filename}`);
        }
    }
}

export const modifyPost = (req: Request, res: Response, next: NextFunction) => {

}

export const deletePost = (req: Request, res: Response, next: NextFunction) => {

}

export const getAllLikePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if(!req.auth.userId || !req.params.id) {
            throw 'Action non autorisée'
        }
        const likePost = await prisma.postLike.findMany({
            where: {
                postId: +req.params.id
            }
        })
        const userLikePost: ({id: number, name: string} | null)[] = await Promise.all(likePost.map(async (like):Promise<{id: number, name: string} | null> => {
            const user: User | null = await prisma.user.findUnique({
                where: {
                    id: like.userId
                }
            })
            if(user) {
                return {
                    id: user.id,
                    name: user.firstName + ' ' + user.lastName
                }
            } else {
                return null
            }
        }))
        return res.status(200).json({ userLikePost })
    } catch (error) {
        return res.status(400).json({ error })
    }
}

export const likePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.body.userId != req.auth.userId) {
            return res.status(403).json({ message: `Action non autorisée` })
        }
        const post = await prisma.post.findUnique({
            where: {
                id: +req.params.id
            }})
            if (!post) {
                return res.status(400).json({ message: 'Post introuvable' }) 
            }
            const like = await prisma.postLike.findMany({
            where: {
                postId: +req.params.id,
                userId: +req.auth.userId
            }
        })
        if (like[0]) {
            await prisma.postLike.deleteMany({
                where: {
                    postId: +req.params.id,
                    userId: +req.auth.userId
                }
            })
            return res.status(201).json({message: 'Like supprimé'})
        }
        await prisma.postLike.create({
            data: {
                postId: +req.params.id,
                userId: +req.auth.userId
            }
        })
        return res.status(201).json({message: 'Like enregistré'})
    } catch (error) {
        return res.status(400).json({ error })
    }

}

export const getAllCommentPost = (req: Request, res: Response, next: NextFunction) => {

}

export const createComment = (req: Request, res: Response, next: NextFunction) => {

}

export const modifyComment = (req: Request, res: Response, next: NextFunction) => {
    console.log(req.params.comId)
    return res.status(200).json({message: 'bingo'})
}

export const deleteComment = (req: Request, res: Response, next: NextFunction) => {

}

