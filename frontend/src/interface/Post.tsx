import { Post, PostLike, PrismaClient, Role, Comment } from '../../../backend/node_modules/@prisma/client';

export type PostsList = (
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
    })[]

export type OnePost = 
    Post & {
        author: {
            id: number,
            firstName: string,
            lastName: string,
            avatar: string,
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

export type OneComment = 
    Comment & {
        author: {
            firstName: string,
            lastName: string,
        },
    }