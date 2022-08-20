
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PRISMA_DB: string;
            RANDOM_KEY_TOKEN: string;
        }
    }
}

export { };