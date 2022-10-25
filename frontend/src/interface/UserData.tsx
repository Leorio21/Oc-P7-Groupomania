import { Role } from "../../../backend/node_modules/@prisma/client";

export interface UserProfil {
    id: number
    firstName: string
    lastName: string
    avatar: string
    backgroung: string
    token: string
    role: Role
}

export interface UserToken {
    token: string
}