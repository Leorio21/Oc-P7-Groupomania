import { ThumbUpIcon } from '@heroicons/react/outline'
import { ThumbUpIcon as ThumbUpIconSolid } from '@heroicons/react/solid'
import { useContext, useReducer, useState } from 'react'

import classNames from 'classnames'
import cn from './Like.module.scss'
import Modal from '../Modal/Modal'
import axios from 'axios'
import { OnePostLike } from '../../interface/Index'
import { AuthContext } from '../../Context/AuthContext'

const initilTextError = ''
const reducerModal = (state: string, action: { type: string; payload?: string; }) => {
    switch(action.type) {
        case 'display':
            state = action.payload!
            return state
        case 'hide':
            state = ''
            return state
    }
    return state;
}
interface LikeProps {
    likeData: OnePostLike[],
    userLikePost: boolean,
    postId: number,
    onClickLike: Function
}

const Like = ({likeData, userLikePost, postId, onClickLike}: LikeProps) => {

    const authContext = useContext(AuthContext)

    const [postLike, setPostLike] = useState(likeData);
    const [textError, dispatchModal] = useReducer(reducerModal, initilTextError);
    
    const onKeyDownHandler = (event: any) => {
        if (event.keyCode == 13) {
            onClickLikeHandler()
        }
    }

    const onClickLikeHandler = async () => {
        try {
            const option = {
                headers: {
                    Authorization: `Bearer ${authContext!.token}`
                }
            }
            const bddLike = await axios.post(`http://127.0.0.1:3000/api/post/${postId}/like`, {}, option)
            if (userLikePost) {
                const newLikeArray = postLike.filter((like) => like.userId != authContext!.userId)
                setPostLike(newLikeArray)
            } else {
                const newLike: OnePostLike = { ...bddLike.data.like }
                const newLikeArray = [...postLike]
                newLikeArray.push(newLike)
                setPostLike(newLikeArray)
            }
            onClickLike()
        } catch (error) {
            dispatchModal({type: 'display', payload: `Une erreur est survenue :\n${error}`})
        }
    }

    return (
        <>
            <div>
                <span className={classNames(cn.nbLike)}>{postLike.length}</span>{userLikePost ? <ThumbUpIconSolid onClick={onClickLikeHandler} onKeyDown={onKeyDownHandler} className={classNames(cn.icon)} tabIndex={0} /> :  <ThumbUpIcon onClick={onClickLikeHandler} onKeyDown={onKeyDownHandler} className={classNames(cn.icon)}  tabIndex={0} />}
            </div>
            {textError != '' && <Modal text={textError} onCloseModal={() => {dispatchModal({type: 'hide'})}} />}
        </>
    )
}

export default Like;
