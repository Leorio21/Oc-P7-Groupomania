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
                userId: string,
                role: string
            },
            files: {
                [name: string]
            }
        }
    }
}

export { };
