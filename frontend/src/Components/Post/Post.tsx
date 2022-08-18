import { OnePost } from "../../../../backend/interface/Post";
import classNames from 'classnames'
import cn from './Post.module.scss'

import Like from '../Like/Like'

interface PostProps {
    post: OnePost,
    userId: number
}

const Post = ({post, userId}: PostProps) => {

    const date = new Date(post.createdAt)
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hour = date.getHours();
    const minutes = date.getMinutes();

    let modifyAuthor: string = '(modifié'

    switch (post.updatedBy) {
        case 'ADMIN':
            modifyAuthor += ' par Admin)';
            break;
        case 'MODERATOR':
            modifyAuthor += ' par Modérateur)';
            break;
        default:
            modifyAuthor += ')';
            break;
    }
    
    return (
        <article className={classNames(cn.post)}>
            <div className={classNames(cn.header)}>
                <span className={classNames(cn.title)}>{post.title}</span>
                <span>{post.author.firstName + ' ' + post.author.lastName}</span>
                <span>{hour}:{minutes<10 && 0}{minutes} - {day}/{month<10 && 0}{month}/{year}</span>
            </div>
            <div className={classNames(cn.content)}>
                {post.image && <img src={post.image} alt={'image \'illustration'} />}
                <div className={classNames(cn.text)}>
                    {post.content}
                </div>
                {post.updatedBy && modifyAuthor}
            </div>
            <div className={classNames(cn.footer)}>
                <Like nbLike={post.like.length} userLike={post.like.find(like => like.userId == userId) ? true : false} />
                <div className={classNames(cn.nbComm)}>{post.comment.length} Commentaires</div>
            </div>
        </article>
    )
}

export default Post;