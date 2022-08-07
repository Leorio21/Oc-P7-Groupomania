import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sharp from 'sharp';
import fs from 'fs/promises';
import {Request, Response, NextFunction } from 'express'

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()

export const signup = async (req: Request, res: Response, next: NextFunction) => {

    try {
        if (await prisma.user.findUnique({ where: { email: req.body.email } })) {
            throw `Un utilisateur est déjà enregistré avec cette adresse em@il : ${req.body.email}`;
        }
        const userName = req.body.email.split('@')[0]
        const [lastName, firstName] = userName.split('.')
        const hash = await bcrypt.hash(req.body.password, 12);
        await prisma.user.create({
            data: {
                firstName: firstName,
                lastName: lastName,
                email: req.body.email,
                password: hash
            },
        });

        return res.status(201).json({ message: 'User enregistré !' });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await prisma.user.findUnique({ where: { email: req.body.email } });
        if (!user) {
            throw "Nom d'utilisateur / Mot de passe incorrect";
        }
        const valid = await bcrypt.compare(req.body.password, user.password);
        if (!valid) {
            throw "Nom d'utilisateur / Mot de passe incorrect";
        }
        return res.status(200).json({
            userId: user.id,
            token: jwt.sign(
                {
                    userId: user.id,
                    role: user.role
                },
                process.env.RANDOM_KEY_TOKEN,
                { expiresIn: '24h' }
            )
        });
    } catch (error) {
        return res.status(404).json({ message: error });
    }
}

export const modify = async (req: Request, res: Response, next: NextFunction) => {
    try {
        /*if (req.body.id != req.auth.userId || req.params.id != req.auth.userId) {
            throw `Accès refusé ${req.params.id} - ${req.body.id} - ${req.auth.userId}`
        }*/
        let nameAvatar;
        let nameBg;
        if (req.files['avatar'][0]) {
            nameAvatar = (req.files['avatar'][0].filename).split('.')[0]
            try {
                await sharp(`./images/${req.files['avatar'][0].filename}`).toFile(`images/${nameAvatar}.webp`)
            } catch {
                throw ('Erreur traiement image 1')
            }
        }
        if (req.files['bgImg'][0]) {
            nameBg = (req.files['bgImg'][0].filename).split('.')[0]
            try {
                await sharp(`./images/${req.files['bgImg'][0].filename}`).toFile(`images/${nameBg}.webp`)
            } catch {
                throw ('Erreur traiement image 2')
            }
        }
        return res.status(201).json({ message: 'UserId : ' + req.auth.userId + ' - role : ' + req.auth.role + ' - User modifié !' });
    } catch (error) {
        return res.status(403).json({ message: error });
    } finally {
        if (req.files['avatar'][0]) {
            await fs.unlink(`images/${req.files['avatar'][0].filename}`);
        }
        if (req.files['bgImg'][0]) {
            await fs.unlink(`images/${req.files['bgImg'][0].filename}`);
        }
    }
}