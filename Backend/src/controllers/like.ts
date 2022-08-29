import { Request, Response, NextFunction } from 'express'

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()

export const likePost = async (req: Request, res: Response, _next: NextFunction) => {
    try {
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
                    userId: req.auth.userId
                }
            })
        if (like[0]) {
            await prisma.postLike.deleteMany({
                where: {
                    postId: +req.params.id,
                    userId: req.auth.userId
                }
            })
            return res.status(201).json({message: 'Like supprimé'})
        }
        const newLike = await prisma.postLike.create({
            data: {
                postId: +req.params.id,
                userId: req.auth.userId
            }
        })
        return res.status(201).json({
            like: newLike,
            message: 'Like enregistré'
        })
    } catch (error) {
        return res.status(400).json({ error })
    }

}