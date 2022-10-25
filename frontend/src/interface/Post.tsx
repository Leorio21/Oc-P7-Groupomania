import { Post, PostLike, Comment, Role } from "../../../backend/node_modules/@prisma/client";

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
                avatar: string | null,
            },
        })[]
    }

export type OnePostLike = (PostLike & {
    user: {
        firstName: string,
        lastName: string,
    };
})

export type OnePostComment = (Comment & {
    author: {
        firstName: string,
        lastName: string,
        avatar: string | null,
    },
})

export type OneUser = {
    email: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
    background: string | null;
    role: Role;
    post: (Post & {
        author: {
            id: number,
            firstName: string,
            lastName: string,
            avatar: string | null,
        },
        like: (PostLike & {
            user: {
                firstName: string;
                lastName: string;
            };
        })[];
        comment: (Comment & {
            author: {
                firstName: string,
                lastName: string,
                avatar: string | null,
            },
        })[]
    })[];
}