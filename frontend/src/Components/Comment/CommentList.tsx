import { OneComment } from '../../interface/Index'
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
                return <Comment comment={comment} key={comment.id} />
            })}
        </div>
    )
}

export default CommentList;