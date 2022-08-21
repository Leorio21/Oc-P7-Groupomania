import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime';
import { useMemo } from 'react';

import { OnePost } from '../../interface/Index';
import { UserCircleIcon } from '@heroicons/react/solid';

import classNames from 'classnames'
import cn from './Post.module.scss'

import Like from '../Like/Like'
import CommentList from '../Comment/CommentList'

interface PostProps {
    post: OnePost,
    userId: number
}

const Post = ({post, userId}: PostProps) => {

    dayjs().format();
    dayjs.extend(relativeTime)

    const modifyAuthor: string = useMemo(() => {
        switch (post.updatedBy) {
            case 'ADMIN':
                return '(modifié par Admin)';
            case 'MODERATOR':
                return '(modifié par Modérateur)';
        }
            return '(modifié)';
    }, [post.updatedBy])

    
    
    return (
        <>
            <article className={classNames(cn.post)}>
                <div className={classNames(cn.header)}>
                    <span className={classNames(cn.title)}>{post.title}</span>
                    <span>{post.author.firstName + ' ' + post.author.lastName}</span>
                    <div className={classNames(cn.avatar)}>{post.author.avatar ? <img src={`http://localhost:3000/images/${post.author.avatar}`} alt={'Image de l\'utilisateur'} /> : <UserCircleIcon className={classNames(cn.icone)} />}</div>
                    <span>{dayjs(post.createdAt).fromNow(true)}</span>
                </div>
                <div className={classNames(cn.content)}>
                    {post.image && <img src={post.image} alt={'image d\'illustration'} />}
                    <div className={classNames(cn.text)}>
                        {post.content}
                    </div>
                    {post.updatedBy && modifyAuthor}
                </div>
                <div className={classNames(cn.footer)}>
                    <div className={classNames(cn.likeComment)}>
                        <Like nbLike={post.like.length} userLike={post.like.find(like => like.userId == userId) ? true : false} />
                        <div className={classNames(cn.nbComm)}>{post.comment.length} Commentaire{post.comment.length > 1 && 's'}</div>
                    </div>
                    <CommentList arrayComment={post.comment} />
                </div>
            </article>
        </>
    )
}

export default Post;