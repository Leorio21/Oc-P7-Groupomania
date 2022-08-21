import { Role } from '../../../backend/node_modules/@prisma/client'

export interface UserDataLs {
    userId: number,
    token: string,
    role: Role
}