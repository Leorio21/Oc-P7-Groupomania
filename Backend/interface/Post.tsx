import { Post, PostLike, PrismaClient, Role } from '@prisma/client';

export type PostsList = (
    Post & {
    author: {
        id: number,
        firstName: string,
        lastName: string,
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
})[]

export type OnePost = 
    Post & {
    author: {
        id: number,
        firstName: string,
        lastName: string,
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