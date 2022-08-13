import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sharp from 'sharp';
import fs from 'fs/promises';
import {Request, Response, NextFunction } from 'express'

import { PrismaClient, User,} from '@prisma/client';
const prisma = new PrismaClient()

export const signup = async (req: Request, res: Response, next: NextFunction) => {

    try {
        if (await prisma.user.findUnique({
            where: {
                email: req.body.email
            }
        })) {
            throw `Un utilisateur est déjà enregistré avec cette adresse em@il : ${req.body.email}`;
        }
        if (req.body.password != req.body.confirmPassword) {
            throw `Les mots de passe ne correspondent pas`
        }
        const [lastName, firstName]: string[] = req.body.email.split('@')[0].split('.')
        const hash: string = await bcrypt.hash(req.body.password, 12);
        await prisma.user.create({
            data: {
                firstName: firstName,
                lastName: lastName,
                email: req.body.email,
                password: hash
            },
        });
        return next();
    } catch (error) {
        return res.status(400).json({ message: error });
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: req.body.email 
            },
        });
        if (!user) {
            throw "Nom d'utilisateur / Mot de passe incorrect";
        }
        const valid: boolean = await bcrypt.compare(req.body.password, user.password);
        if (!valid) {
            throw "Nom d'utilisateur / Mot de passe incorrect";
        }
        return res.status(200).json({
            token: jwt.sign(
                {
                    userId: user.id
                },
                process.env.RANDOM_KEY_TOKEN,
                { expiresIn: '48h' }
            )
        });
    } catch (error) {
        return res.status(404).json({ message: error });
    }
}

export const modify = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let adminUser: User | null;
        let validAdmin: boolean = false;
        const user = await prisma.user.findUnique({
            where: {
                id: +req.params.id 
            },
        });
        if (!user) {
            throw 'Utilisateur introuvable'
        }
        if (+req.params.id != req.auth.userId && req.auth.role == 'ADMIN') {
            adminUser = await prisma.user.findUnique({
                where: {
                    id: +req.auth.userId 
                },
            });
            if (!adminUser) {
                throw 'Utilisateur introuvable'
            }
            validAdmin = await bcrypt.compare(req.body.password, adminUser.password);
        }
        const validUser: boolean = await bcrypt.compare(req.body.password, user.password);
        if(validUser || validAdmin) {
            let nameAvatar:string;
            let nameBg: string;
            if(req.body.newPassword) {
                user.password = await bcrypt.hash(req.body.newPassword, 12);
            }
            if (req.files['avatar']) {
                nameAvatar = (req.files['avatar'][0].filename).split('.')[0]
                try {
                    await sharp(`./images/${req.files['avatar'][0].filename}`).toFile(`images/${nameAvatar}.webp`)
                    if(user.avatar != null) {
                        await fs.unlink(`images/${user.avatar}`);
                    }
                    user.avatar = `${nameAvatar}.webp`
                } catch {
                    throw ('Erreur traitement image avatar')
                }
            }
            if (req.files['bgImg']) {
                nameBg = (req.files['bgImg'][0].filename).split('.')[0]
                try {
                    await sharp(`./images/${req.files['bgImg'][0].filename}`).toFile(`images/${nameBg}.webp`)
                    if(user.background != null) {
                        await fs.unlink(`images/${user.background}`);
                    }
                    user.background = `${nameBg}.webp`
                } catch {
                    throw ('Erreur traitement image de fond')
                }
            }
            if(validAdmin) {
                user.firstName = req.body.firstName;
                user.lastName = req.body.lastName;
                user.email = req.body.email
            }
            await prisma.user.update({
                where: {
                    id: +req.params.id 
                },
                data: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    password: user.password,
                    avatar: user.avatar,
                    background: user.background,
                    role: user.role
                }
            });
            return res.status(201).json({ message: 'Utilisateur modifié !' });
        }
        return res.status(403).json({message: 'action non autorisée'})
    } catch (error) {
        return res.status(403).json({ message: error });
    } finally {
        if (req.files['avatar']) {
            await fs.unlink(`images/${req.files['avatar'][0].filename}`);
        }
        if (req.files['bgImg']) {
            await fs.unlink(`images/${req.files['bgImg'][0].filename}`);
        }
    }
}

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let adminUser: User | null;
        let validAdmin: boolean = false;
        const user = await prisma.user.findUnique({
            where: {
                id: +req.params.id 
            },
        });
        if (!user) {
            throw 'Utilisateur introuvable'
        }
        if (req.auth.role == 'ADMIN') {
            adminUser = await prisma.user.findUnique({
                where: {
                    id: +req.auth.userId 
                },
            });
            if (!adminUser || adminUser.role != 'ADMIN') {
                throw 'Utilisateur introuvable'
            }
            validAdmin = await bcrypt.compare(req.body.password, adminUser.password);
        }
        const validUser: boolean = await bcrypt.compare(req.body.password, user.password);
        if(validUser || validAdmin) {
            await prisma.user.delete({
                where: {
                    id: +req.params.id
                },
            })
            return res.status(200).json({ message: 'Utilisateur supprimé' })
        }
        return res.status(403).json({message: 'action non autorisée'})
    } catch (error) {
        return res.status(403).json({ message: error });
    }
}

export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: +req.params.id
            },
            select: {
                firstName: true,
                lastName: true,
                email: true,
                avatar: true,
                background: true,
                post : {
                    include: {
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
                }
            }
        })
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur introuvable'})
        }
        return res.status(200).json({ user })
    } catch (error) {
        return res.status(400).json({ error })
    }
}