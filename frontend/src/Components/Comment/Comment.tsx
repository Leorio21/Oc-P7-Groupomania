import { OnePostComment } from '../../interface/Index';

import classNames from 'classnames';
import cn from './Comment.module.scss'
import { UserCircleIcon } from '@heroicons/react/solid';
interface CommentProps {
    comment: OnePostComment
}

const Comment = ({comment}: CommentProps) => {

    return (
        <div className={classNames(cn.container)}>
            <div className={classNames(cn.avatar)}>{comment.author.avatar ? <img src={`${comment.author.avatar}`} alt={'Image de l\'utilisateur'} /> : <UserCircleIcon className={classNames(cn.icone)} />}</div>
            <div className={classNames(cn['comment-container'])}>
                <div className={classNames(cn.title)}>{comment.author.firstName} {comment.author.lastName}</div>
                <div className={classNames(cn.content)}>{comment.content}</div>
            </div>
        </div>
    )
}

export default Comment;