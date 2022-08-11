import { Post, PostLike } from "@prisma/client";

interface UserProfile  {
    lastName: string;
    firstName: string;
    email: string;
    avatar: string | null;
    background: string | null;
    post: (Post & {
        like: (PostLike & {
            user: {
                lastName: string;
                firstName: string;
            };
        })[];
        comment: (Comment & {
            author: {
                lastName: string;
                firstName: string;
            };
        })[];
    })[];
}

export default UserProfile;