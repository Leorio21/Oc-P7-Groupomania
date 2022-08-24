import { Post, PostLike, Comment } from '../../../backend/node_modules/@prisma/client';

export type OnePost = 
    Post & {
        author: {
            id: number,
            firstName: string,
            lastName: string,
            avatar: string | null,
        },
        like: (PostLike & {
            user: {
                firstName: string,
                lastName: string,
            };
        })[],
        comment: (Comment & {
            author: {
                firstName: string,
                lastName: string,
            },
        })[]
    }

    export type OnePostLike = (PostLike & {
        user: {
            firstName: string,
            lastName: string,
        };
    })