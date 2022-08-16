import { OnePost } from "../../../../backend/interface/Post";
import classNames from 'classnames'
import cn from './Post.module.scss'

interface PostProps {
    post: OnePost
}

const Post = ({post}: PostProps) => {

    const date = new Date(post.createdAt)
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hour = date.getHours();
    const minutes = date.getMinutes();

    let modifyAuthor = ' - (modifié'

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
            <div className={classNames(cn.title)}>{post.title}</div>
            <div className={classNames(cn.content)}>
                {post.image && <img src={post.image} alt={'image \'illustration'} />}
                <div className={classNames(cn.text)}>
                    {post.content}
                </div>
            </div>
            <div className={classNames(cn.footer)}>
                <div className={classNames(cn.author)}>{post.author.firstName + ' ' + post.author.lastName}{post.updatedBy && modifyAuthor}</div>
                <div className={classNames(cn.createdDate)}>{hour}:{minutes<10 && 0}{minutes} - {day}/{month<10 && 0}{month}/{year}</div>
            </div>
        </article>
    )
}

export default Post;