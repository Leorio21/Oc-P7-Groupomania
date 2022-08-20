import { OneComment } from '../../interface/Post'
import Comment from './Comment'

import classNames from 'classnames'
import cn from './CommentList.module.scss'
interface CommentListProps {
    arrayComment: OneComment[]
}

const CommentList = ({arrayComment}: CommentListProps) => {

    return (
        <div className={classNames(cn['commentList-container'])}>
            {arrayComment.map((comment) => {
                return <Comment comment={comment} />
            })}
        </div>
    )
}

export default CommentList;