import jwt from 'jsonwebtoken';
import {Request, Response, NextFunction } from 'express'


import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()

export default async (req: Request , res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization!.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.RANDOM_KEY_TOKEN!) as jwt.JwtPayload;
        const userId: number = decodedToken.userId;
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })
        if(!user) {
            throw `Requête non authentifiée`;
        }
        req.auth = {userId: user.id, role: user.role};
        return next();
    } catch (error) {
        return res.status(401).json({ error });
    }
}