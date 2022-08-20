import { OneComment } from '../../interface/Post';

import classNames from 'classnames';
import cn from './Comment.module.scss'
interface CommentProps {
    comment: OneComment
}

const Comment = ({comment}: CommentProps) => {

    return (
        <div className={classNames(cn['comment-container'])}>
            <div className={classNames(cn.title)}>{comment.author.firstName} {comment.author.lastName}</div>
            <div className={classNames(cn.content)}>{comment.content}</div>
        </div>
    )
}

export default Comment;