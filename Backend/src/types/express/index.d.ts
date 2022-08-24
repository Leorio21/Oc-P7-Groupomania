import { Role, User } from "@prisma/client";

import {Request, Response, NextFunction } from 'express'

declare global{
    namespace Express {
        interface Request {
            auth: {
                userId: User['id'],
                role: User['role'],
                firstName: User['firstName'],
                lastName: User['lastName'],
                avatar: User['avatar']
            }
        }
    }
}
