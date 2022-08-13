import { Role } from "@prisma/client";

declare global {
    
    namespace NodeJS {
        interface ProcessEnv {
            PRISMA_DB: string;
            RANDOM_KEY_TOKEN: string;
        }
    }

    namespace Express {
        interface Request extends JwtPayload{
            auth: {
                userId: number,
                role: Role
            },
            files: {
                [name: string]
            }
        }
    }
}

export { };
