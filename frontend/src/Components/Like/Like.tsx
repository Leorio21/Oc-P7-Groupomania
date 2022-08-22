import { ThumbUpIcon } from '@heroicons/react/outline'
import { ThumbUpIcon as ThumbUpIconSolid } from '@heroicons/react/solid'
import classNames from 'classnames'
import { MouseEventHandler } from 'react'

import cn from './Like.module.scss'

interface LikeProps {
    nbLike: number,
    userLikePost: boolean,
    onClickFunction: MouseEventHandler
}

const Like = ({nbLike, userLikePost, onClickFunction}: LikeProps) => {

    return (
        <div>
        <span className={classNames(cn.nbLike)}>{nbLike}</span>{userLikePost ? <ThumbUpIconSolid onClick={onClickFunction} className={classNames(cn.icon)} tabIndex={0} /> :  <ThumbUpIcon onClick={onClickFunction} className={classNames(cn.icon)}  tabIndex={0} />}
        </div>
    )
}

export default Like;