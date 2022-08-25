import { OnePostComment, UserDataLs } from '../../interface/Index';

import classNames from 'classnames';
import cn from './Comment.module.scss'
import { UserCircleIcon } from '@heroicons/react/solid';
import AdminMenu from '../AdminMenu/AdminMenu';
interface CommentProps {
    comment: OnePostComment,
    postId: number,
    onDeleteComment: Function
}

const Comment = ({comment, postId, onDeleteComment}: CommentProps) => {

    const userData: UserDataLs = JSON.parse(localStorage.getItem('userData')!)

    return (
        <div className={classNames(cn.container)}>
            <div className={classNames(cn.avatar)}>{comment.author.avatar ? <img src={`${comment.author.avatar}`} alt={'Image de l\'utilisateur'} /> : <UserCircleIcon className={classNames(cn.icone)} />}</div>
            <div className={classNames(cn['comment-container'])}>
                <div className={classNames(cn.title)}>
                    <div className={classNames(cn.author)}>
                        {comment.author.firstName} {comment.author.lastName}
                    </div>
                    <div className={classNames(cn.menu)}>
                        {(userData.userId == comment.authorId || userData.role == 'ADMIN' || userData.role == 'MODERATOR') && <AdminMenu commentId={comment.id} postId={postId} onDeleteComment={onDeleteComment}/>}
                    </div>
                </div>
                <div className={classNames(cn.content)}>{comment.content}</div>
            </div>
        </div>
            
    )
}

export default Comment;