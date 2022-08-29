import { Role } from '../../../backend/node_modules/@prisma/client'

export interface UserDataLs {
    userId: number,
    firstName: string,
    lastName: string,
    avatar: string,
    token: string,
    role: Role
}