import jwt from 'jsonwebtoken';
import {Request, Response, NextFunction } from 'express'


import { PrismaClient, User } from '@prisma/client';
const prisma = new PrismaClient()

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization!.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.RANDOM_KEY_TOKEN) as jwt.JwtPayload;
        const userId = decodedToken.userId;
        const role = decodedToken.role;
        req.auth = {userId, role};
        if (req.body.userId && req.body.userId != userId) {
            throw `Requête non authentifiée ${req.body.userId} - ${userId}`;
        } else {
            const user = await prisma.user.findUnique({
                where: {
                    id: userId
                }
            })
            if(!user) {
                throw 'Utilisateur inconnu'
            }
            next();
        }
    } catch (error) {
        return res.status(401).json({ error });
    }
}