import { Comment } from '../../../backend/node_modules/@prisma/client';

export type OneComment = 
    Comment & {
        author: {
            firstName: string,
            lastName: string,
        },
    }