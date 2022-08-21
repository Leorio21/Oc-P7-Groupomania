import { ThumbUpIcon } from '@heroicons/react/outline'
import { ThumbUpIcon as ThumbUpIconSolid } from '@heroicons/react/solid'
import classNames from 'classnames'

import cn from './Like.module.scss'

interface LikeProps {
    nbLike: number,
    userLike: boolean,
    postId: number
}

const Like = ({nbLike, userLike, postId}: LikeProps) => {

    return (
        <div>
        <span className={classNames(cn.nbLike)}>{nbLike}</span>{userLike ? <ThumbUpIconSolid className={classNames(cn.icon)} tabIndex={0} /> :  <ThumbUpIcon className={classNames(cn.icon)}  tabIndex={0} />}
        </div>
    )
}

export default Like;