import { User } from "@prisma/client";

declare global {
    namespace Express {
        interface Request {
            auth: {
                userId: User["id"]
                role: User["role"]
                firstName: User["firstName"]
                lastName: User["lastName"]
                avatar: User["avatar"]
            }
        }
    }
}
