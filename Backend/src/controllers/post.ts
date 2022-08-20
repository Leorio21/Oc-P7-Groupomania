import fs from 'fs/promises';
import { Request, Response, NextFunction } from 'express'

import { Post, PostLike, PrismaClient, Role } from '@prisma/client';
import sharp from 'sharp';
const prisma = new PrismaClient()

export const getAllPost = async (_req: Request, res: Response, _next: NextFunction) => {
    try {
        const posts = await prisma.post.findMany({
            include:{
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true
                    }
                },
                like: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true
                            }
                        }
                    }
                },
                comment: {
                    include: {
                        author: {
                            select: {
                                firstName: true,
                                lastName: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        })
        return res.status(200).json(posts)
    } catch (error) {
        return res.status(400).json({ error })
    }
}

export const createPost = async (req: Request, res: Response, _next: NextFunction) => {
    let imageName: string | null = null;
    let newImage: boolean = false;
    try {
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

export const modifyPost = async (req: Request, res: Response, _next: NextFunction) => {
    let imageName: string | null = null;
    if(req.body.image != 'null') {
        console.log('null')
        imageName = req.body.image
    }
    let oldImage: string | null = null
    let newImage: boolean = false;
    try {
        let authorUpdate: Role = 'USER';
        const post = await prisma.post.findUnique({
            where: {
                id: +req.params.id 
            },
        });
        if (!post) {
            throw 'Post/Commentaire introuvable'
        }
        if(post.authorId == req.auth.userId || req.auth.role == 'ADMIN' || req.auth.role == 'MODERATOR') {
            if (post.authorId != req.auth.userId) {
                authorUpdate = req.auth.role
            }
            oldImage = post.image
            if (req.file) {
                imageName = (req.file.filename).split('.')[0] + '.webp'
                try {
                    await sharp(`./images/${req.file.filename}`).toFile(`images/${imageName}`)
                    newImage = true;
                } catch {
                    throw ('Erreur traiement image')
                }
            }
            if((newImage && oldImage) || (imageName == null && oldImage)) {
                await fs.unlink(`images/${oldImage}`);
            }
            await prisma.post.updateMany({
                where: {
                    id: +req.params.id
                },
                data: {
                    title: req.body.title,
                    content: req.body.content,
                    image: imageName,
                    updatedBy: authorUpdate
                }
            })
            return res.status(200).json({ message: 'Commentaire modifié' })
        }
        return res.status(403).json({message: 'action non autorisée'})
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

export const deletePost = async (req: Request, res: Response, _next: NextFunction) => {
    try {
        const post = await prisma.post.findUnique({
            where: {
                id: +req.params.id 
            },
        });
        if (!post) {
            throw 'Post introuvable'
        }
        if (post.authorId == req.auth.userId || req.auth.role == 'ADMIN' || req.auth.role == 'MODERATOR') {
            await prisma.post.delete({
                where: {
                    id: +req.params.id
                }
            })
            if(post.image) {
                await fs.unlink(`images/${post.image}`);
            }
            return res.status(200).json({ message: 'Post supprimé' })
        }
        return res.status(403).json({message: 'action non autorisée'})
    } catch (error) {
        return res.status(403).json({ message: error });
    }
}

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

export const createComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const post = await prisma.post.findUnique({
            where: {
                id: +req.params.id
            }
        })
        if(!post) {
            throw 'post non trouvé'
        }
        await prisma.comment.create({
            data: {
                postId: +req.params.id,
                authorId: req.auth.userId,
                content: req.body.content,
            },
        })
        return res.status(201).json({message: 'Commentaire enregistré'})

    } catch (error) {
        return res.status(400).json({ error })
    }
}

export const modifyComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
            let authorUpdate: Role = 'USER';
            const post = await prisma.post.findUnique({
                where: {
                    id: +req.params.id 
                },
            });
            const comment = await prisma.comment.findUnique({
                where: {
                    id: +req.params.comId
                }
            })
            if (!post || !comment) {
                throw 'Post/Commentaire introuvable'
            }
            if(comment.authorId == req.auth.userId || req.auth.role == 'ADMIN' || req.auth.role == 'MODERATOR') {
                if (comment.authorId != req.auth.userId) {
                    authorUpdate = req.auth.role
                }
                await prisma.comment.updateMany({
                    where: {
                        id: +req.params.comId
                    },
                    data: {
                        content: req.body.content,
                        updatedBy: authorUpdate
                    }
                })
                return res.status(200).json({ message: 'Commentaire modifié' })
            }
            return res.status(403).json({message: 'action non autorisée'})
    } catch (error) {
        return res.status(403).json({ message: error });
    }
}

export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const post = await prisma.post.findUnique({
            where: {
                id: +req.params.id 
            },
        });
        const comment = await prisma.comment.findUnique({
            where: {
                id: +req.params.comId
            }
        })
        if (!post || !comment) {
            throw 'Post/Commentaire introuvable'
        }
        if(comment.authorId == req.auth.userId || req.auth.role == 'ADMIN' || req.auth.role == 'MODERATOR') {
            await prisma.comment.delete({
                where: {
                    id: +req.params.comId
                }
            })
            return res.status(200).json({ message: 'Commentaire supprimé' })
        }
        return res.status(403).json({message: 'action non autorisée'})
    } catch (error) {
        return res.status(403).json({ message: error });
    }
}

