import fs from 'fs/promises';
import { Request, Response, NextFunction } from 'express'

import { PrismaClient, Post, Comment, User, Role, PostLike } from '@prisma/client';
import sharp from 'sharp';
const prisma = new PrismaClient()

export const getAllPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.body.userId != req.auth.userId) {
        return res.status(403).json({ message: 'Action non autorisée' })
        }
        const posts: Post[] = await prisma.post.findMany({
            include:{
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true
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

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
    let imageName: string | null = null;
    let newImage: boolean = false;
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

export const modifyPost = async (req: Request, res: Response, next: NextFunction) => {
    let imageName: string | null = null;
    if(req.body.image != 'null') {
        console.log('null')
        imageName = req.body.image
    }
    let oldImage: string | null = null
    let newImage: boolean = false;
    try {
        if (req.body.userId == req.auth.userId || req.auth.role == 'ADMIN' || req.auth.role == 'MODERATOR') {
            let adminUser: User | null;
            let validAdmin: boolean = false;
            let authorUpdate: Role = 'USER';
            const post: Post | null = await prisma.post.findUnique({
                where: {
                    id: +req.params.id 
                },
            });
            if (!post) {
                throw 'Post/Commentaire introuvable'
            }
            oldImage = post.image
            if (post.authorId != req.auth.userId && (req.auth.role == 'ADMIN' || req.auth.role == 'MODERATOR')) {
                adminUser = await prisma.user.findUnique({
                    where: {
                        id: +req.auth.userId
                    },
                });
                if (!adminUser || (adminUser.role != 'ADMIN' && adminUser.role != 'MODERATOR')) {
                    throw 'Vous n\'êtes pas  modérateur ou administrateur'
                }
                validAdmin = true
                authorUpdate = adminUser.role
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
            if((newImage && oldImage) || (imageName == null && oldImage)) {
                await fs.unlink(`images/${oldImage}`);
            }
            if(post.authorId == req.auth.userId || validAdmin) {
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
        } else {
            throw `Accès refusé`
        }
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

export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.body.userId == req.auth.userId || req.auth.role == 'ADMIN' || req.auth.role == 'MODERATOR') {
            let adminUser: User | null;
            let validAdmin: boolean = false;
            const post: Post | null = await prisma.post.findUnique({
                where: {
                    id: +req.params.id 
                },
            });
            if (!post) {
                throw 'Post introuvable'
            }
            if (req.auth.role == 'ADMIN' || req.auth.role == 'MODERATOR') {
                adminUser = await prisma.user.findUnique({
                    where: {
                        id: +req.auth.userId
                    },
                });
                if (!adminUser || (adminUser.role != 'ADMIN' && adminUser.role != 'MODERATOR')) {
                    throw 'Vous n\'êtes pas  modérateur ou administrateur'
                }
                validAdmin = true
            }
            if(post.authorId == req.auth.userId || validAdmin) {
                await prisma.post.delete({
                    where: {
                        id: +req.params.id
                    }
                })
                return res.status(200).json({ message: 'Post supprimé' })
            }
            return res.status(403).json({message: 'action non autorisée'})
        } else {
            throw `Accès refusé ${req.params.id} - ${req.body.userId} - ${req.auth.userId}`  // *********************** log ctrl
        }
    } catch (error) {
        return res.status(403).json({ message: error });
    }
}

export const likePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.body.userId != req.auth.userId) {
            return res.status(403).json({ message: `Action non autorisée` })
        }
        const post: Post | null = await prisma.post.findUnique({
            where: {
                id: +req.params.id
            }})
            if (!post) {
                return res.status(400).json({ message: 'Post introuvable' }) 
            }
            const like: PostLike[] = await prisma.postLike.findMany({
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
        if (req.body.userId != req.auth.userId || !req.params.id) {
            return res.status(403).json({ message: `Action non autorisée ${req.auth.userId} - ${req.body.userId}` })  //  ********** clg controle **********
        }
        const post: Post | null = await prisma.post.findUnique({
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
        if (req.body.userId == req.auth.userId || req.auth.role == 'ADMIN' || req.auth.role == 'MODERATOR') {
            let adminUser: User | null;
            let validAdmin: boolean = false;
            let authorUpdate: Role = 'USER';
            const post: Post | null = await prisma.post.findUnique({
                where: {
                    id: +req.params.id 
                },
            });
            const comment: Comment | null = await prisma.comment.findUnique({
                where: {
                    id: +req.params.comId
                }
            })
            if (!post || !comment) {
                throw 'Post/Commentaire introuvable'
            }
            if (comment.authorId != req.auth.userId && (req.auth.role == 'ADMIN' || req.auth.role == 'MODERATOR')) {
                adminUser = await prisma.user.findUnique({
                    where: {
                        id: +req.auth.userId
                    },
                });
                if (!adminUser || (adminUser.role != 'ADMIN' && adminUser.role != 'MODERATOR')) {
                    throw 'Vous n\'êtes pas  modérateur ou administrateur'
                }
                validAdmin = true
                authorUpdate = adminUser.role
            }
            if(comment.authorId == req.auth.userId || validAdmin) {
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
        } else {
            throw `Accès refusé`
        }
    } catch (error) {
        return res.status(403).json({ message: error });
    }
}

export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.body.userId == req.auth.userId || req.auth.role == 'ADMIN' || req.auth.role == 'MODERATOR') {
            let adminUser: User | null;
            let validAdmin: boolean = false;
            const post: Post | null = await prisma.post.findUnique({
                where: {
                    id: +req.params.id 
                },
            });
            const comment: Comment | null = await prisma.comment.findUnique({
                where: {
                    id: +req.params.comId
                }
            })
            if (!post || !comment) {
                throw 'Post/Commentaire introuvable'
            }
            if (req.auth.role == 'ADMIN' || req.auth.role == 'MODERATOR') {
                adminUser = await prisma.user.findUnique({
                    where: {
                        id: +req.auth.userId
                    },
                });
                if (!adminUser || (adminUser.role != 'ADMIN' && adminUser.role != 'MODERATOR')) {
                    throw 'Vous n\'êtes pas  modérateur ou administrateur'
                }
                validAdmin = true
            }
            if(comment.authorId == req.auth.userId || validAdmin) {
                await prisma.comment.delete({
                    where: {
                        id: +req.params.comId
                    }
                })
                return res.status(200).json({ message: 'Commentaire supprimé' })
            }
            return res.status(403).json({message: 'action non autorisée'})
        } else {
            throw `Accès refusé`
        }
    } catch (error) {
        return res.status(403).json({ message: error });
    }
}

