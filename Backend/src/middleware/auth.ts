import jwt from 'jsonwebtoken';
import {Request, Response, NextFunction } from 'express'

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization!.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.RANDOM_KEY_TOKEN) as jwt.JwtPayload;
        const userId = decodedToken.userId;
        const role = decodedToken.role;
        req.auth = {userId, role};
        if (req.body.userId && req.body.userId !== userId) {
            throw 'UserId non valable';
        } else {
            next();
        }
    } catch {
        return res.status(401).json({ message: 'Requête non authentifiée'});
    }
}