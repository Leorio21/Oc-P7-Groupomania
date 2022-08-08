import fs from 'fs/promises';
import { Request, Response, NextFunction } from 'express'

import { PrismaClient, Post } from '@prisma/client';
import sharp from 'sharp';
const prisma = new PrismaClient()

export const getAllPost = (req: Request, res: Response, next: NextFunction) => {

}

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
    let imageUrl = null;
    let newImage = false;
    try {
        if (req.body.userId != req.auth.userId) {
            return res.status(403).json({ message: 'Action non autorisée' })
        }
        if (req.files) {
            imageUrl = (req.files.filename).split('.')[0]
            try {
                await sharp(`./images/${req.files.filename}`).toFile(`images/${imageUrl}.webp`)
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
                image: imageUrl
            },
        })
        return res.status(201).json({message: 'Post enregistré'})

    } catch (error) {
        if(req.file && imageUrl != null) {
            fs.unlink(`images/${imageUrl}.webp`)
        }
        res.status(400).json({ error })
    } finally {
        if (req.files) {
            await fs.unlink(`images/${req.files.filename}`);
        }
    }
}

export const modifyPost = (req: Request, res: Response, next: NextFunction) => {

}

export const deletePost = (req: Request, res: Response, next: NextFunction) => {

}

export const likePost = (req: Request, res: Response, next: NextFunction) => {

}

export const createComment = (req: Request, res: Response, next: NextFunction) => {

}

export const modifyComment = (req: Request, res: Response, next: NextFunction) => {

}

export const deleteComment = (req: Request, res: Response, next: NextFunction) => {

}

