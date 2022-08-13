import {Request, Response, NextFunction } from 'express'

export default (req: Request, res: Response, next: NextFunction) => {
    const mail = req.body.email
    if (mail.match(/^([a-z0-9-]+\.[a-z0-9-]+)(@groupomania.fr)$/i)) {
        return next();
    }
    return res.status(400).json({error: `Veuillez vous inscrire avec votre adresse professionnelle : nom.prenom@groupomania.fr`})
}