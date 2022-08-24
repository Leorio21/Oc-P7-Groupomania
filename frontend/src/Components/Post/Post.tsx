import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import relativeTime from 'dayjs/plugin/relativeTime';

import { useMemo, useState } from 'react';

import { OnePost } from '../../interface/Index';
import { UserCircleIcon } from '@heroicons/react/solid';

import classNames from 'classnames'
import cn from './Post.module.scss'

import Like from '../Like/Like'
import CommentList from '../Comment/CommentList'
import axios from 'axios';

interface PostProps {
    post: OnePost,
    userId: number
}

const likeDislike = async (postId: number) => {
    const userData = JSON.parse(localStorage.getItem('userData')!)
    const option = {
        headers: {
            Authorization: `Bearer ${userData.token}`
        }
    }
    try {
        await axios.post(`http://127.0.0.1:3000/api/post/${postId}/like`, {}, option)
    } catch (error) {
        console.log(error)
    }
}

const Post = ({post, userId}: PostProps) => {

    const [postData, setPostData] = useState(post)
    const [postLike, setPostLike] = useState(postData.like)
    const [userLikePost, setUserLikePost] = useState(postLike.find((like) => like.userId == userId) ? true : false)
    const [postComment, setPostComment] = useState(post.comment)

    const onCommentHandler = () => {

    }

    const onClickLikeHandler = () => {
        if (userLikePost) {
            const likeIndexToRemove = postLike.findIndex((like) => like.userId == userId)
            const newLikeArray = [...postLike]
            newLikeArray.splice(likeIndexToRemove, 1)
            setPostLike(newLikeArray)
        } else {
            const newLike = {
                id: 1,
                userId: userId,
                postId: postData.id,
                user: {
                    firstName: postData.author.firstName,
                    lastName: postData.author.lastName
                }
            }
            const newLikeArray = [...postLike]
            newLikeArray.push(newLike)
            setPostLike(newLikeArray)
        }
        likeDislike(postData.id)
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
    }, [postData.updatedBy])

    return (
        <>
            <article className={classNames(cn.post)}>
                <div className={classNames(cn.header)}>
                    <span className={classNames(cn.title)}>{postData.title}</span>
                    <span>{post.author.firstName + ' ' + postData.author.lastName}</span>
                    <div className={classNames(cn.avatar)}>{postData.author.avatar ? <img src={`${postData.author.avatar}`} alt={'Image de l\'utilisateur'} /> : <UserCircleIcon className={classNames(cn.icone)} />}</div>
                    <span>{dayjs(post.createdAt).fromNow(true)}</span>
                </div>
                <div className={classNames(cn.content)}>
                    {post.image && <img src={postData.image!} alt={'image d\'illustration'} />}
                    <div className={classNames(cn.text)}>
                        {postData.content}
                    </div>
                    {postData.updatedBy && modifyAuthor}
                </div>
                <div className={classNames(cn.footer)}>
                    <div className={classNames(cn.likeComment)}>
                        <Like nbLike={postLike.length} userLikePost={userLikePost} onClickLike={onClickLikeHandler}/>
                        <div className={classNames(cn.nbComm)}>{postComment.length} Commentaire{postComment.length > 1 && 's'}</div>
                    </div>
                    <CommentList arrayComment={post.comment} />
                    <form onSubmit={onCommentHandler} id='formComment'>

                    </form>
                </div>
            </article>
        </>
    )
}

export default Post;