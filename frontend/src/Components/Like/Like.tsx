import { ThumbUpIcon } from '@heroicons/react/outline'
import { ThumbUpIcon as ThumbUpIconSolid } from '@heroicons/react/solid'
import { useContext, useState } from 'react'

import classNames from 'classnames'
import cn from './Like.module.scss'
import Modal from '../Modal/Modal'
import axios from 'axios'
import { OnePostLike, UserDataLs } from '../../interface/Index'
import { AuthContext } from '../../Context/AuthContext'

interface LikeProps {
    likeData: OnePostLike[],
    userLikePost: boolean,
    postId: number,
    onClickLike: Function
}

const Like = ({likeData, userLikePost, postId, onClickLike}: LikeProps) => {

    const authContext = useContext(AuthContext)

    const [postLike, setPostLike] = useState(likeData);
    const [modalToggle, setModalToggle] = useState(false);
    const [errorText, setErrorText] = useState('');

    const changeVisibilityModal = () => {
        setModalToggle(!modalToggle);
    }

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
            setErrorText(`Une erreur est survenue :\n${error}`)
            changeVisibilityModal()
        }
    }

    return (
        <>
            <div>
                <span className={classNames(cn.nbLike)}>{postLike.length}</span>{userLikePost ? <ThumbUpIconSolid onClick={onClickLikeHandler} onKeyDown={onKeyDownHandler} className={classNames(cn.icon)} tabIndex={0} /> :  <ThumbUpIcon onClick={onClickLikeHandler} onKeyDown={onKeyDownHandler} className={classNames(cn.icon)}  tabIndex={0} />}
            </div>
            {modalToggle && <Modal text={errorText} onCloseModal={changeVisibilityModal} />}
        </>
    )
}

export default Like;
