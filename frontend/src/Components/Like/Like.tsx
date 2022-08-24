import { ThumbUpIcon } from '@heroicons/react/outline'
import { ThumbUpIcon as ThumbUpIconSolid } from '@heroicons/react/solid'
import classNames from 'classnames'
import { MouseEventHandler } from 'react'

import cn from './Like.module.scss'

interface LikeProps {
    nbLike: number,
    userLikePost: boolean,
    onClickLike: MouseEventHandler
}

const Like = ({nbLike, userLikePost, onClickLike}: LikeProps) => {

    return (
        <div>
            <span className={classNames(cn.nbLike)}>{nbLike}</span>{userLikePost ? <ThumbUpIconSolid onClick={onClickLike} className={classNames(cn.icon)} tabIndex={0} /> :  <ThumbUpIcon onClick={onClickLike} className={classNames(cn.icon)}  tabIndex={0} />}
        </div>
    )
}

export default Like;