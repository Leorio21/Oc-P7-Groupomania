import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import relativeTime from 'dayjs/plugin/relativeTime';
import { useContext, useMemo, useState } from 'react';
import { UserCircleIcon } from '@heroicons/react/solid';

import { OnePost } from '../../interface/Index';
import classNames from 'classnames'
import cn from './Post.module.scss'

import Like from '../Like/Like'
import CommentList from '../Comment/CommentList'
import { AuthContext } from '../../Context/AuthContext';

interface PostProps {
    post: OnePost
}

const Post = ({post}: PostProps) => {

    const authContext = useContext(AuthContext)

    const [userLikePost, setUserLikePost] = useState(post.like.find((like) => like.userId == authContext!.userId) ? true : false);
    const [countComm, setCountComm] = useState(post.comment.length)

    const changeCountComm = (newCounterComm: number) => {
        setCountComm(newCounterComm)
    }

    const changeLikePost = () => {
        setUserLikePost(!userLikePost)
    }

    dayjs.locale('fr')
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
        <article className={classNames(cn.post)}>
            <div className={classNames(cn.header)}>
                <span>{post.author.firstName + ' ' + post.author.lastName}</span>
                <div className={classNames(cn.avatar)}>{post.author.avatar ? <img src={`${post.author.avatar}`} alt={'Image de l\'utilisateur'} /> : <UserCircleIcon className={classNames(cn.icone)} />}</div>
                <span>{dayjs(post.createdAt).fromNow(true)}</span>
            </div>
            <div className={classNames(cn.content)}>
                {post.image && <img src={post.image!} alt={'image d\'illustration'} />}
                {post.content && 
                    <div className={classNames(cn.text)}>
                        {post.content}
                    </div>
                }
                {post.updatedBy && `\n${modifyAuthor}`}
            </div>
            <div className={classNames(cn.footer)}>
                <div className={classNames(cn.likeComment)}>
                    <Like likeData={post.like} postId={post.id} userLikePost={userLikePost} onClickLike={changeLikePost}/>
                    <div className={classNames(cn.nbComm)}>{countComm} Commentaire{countComm > 1 && 's'}</div>
                </div>
                <CommentList arrayComment={post.comment} postId={post.id} changeCountComm={changeCountComm} />
            </div>
        </article>
    )
}

export default Post;