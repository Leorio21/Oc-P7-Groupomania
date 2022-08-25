import { useMemo, useState } from 'react';
import { UserCircleIcon } from '@heroicons/react/solid';
import { OnePostComment, UserDataLs } from '../../interface/Index';

import classNames from 'classnames';
import cn from './Comment.module.scss'

import AdminMenu from '../AdminMenu/AdminMenu';
import TextArea from '../Form/TextArea/TextArea';
import Modal from '../Modal/Modal';
import axios from 'axios';
interface CommentProps {
    comment: OnePostComment,
    postId: number,
    onModifyComment: Function,
    onDeleteComment: Function
}

const Comment = ({comment, postId, onModifyComment, onDeleteComment}: CommentProps) => {

    const [updatedBy, setUpdatedBy] = useState(comment.updatedBy)
    const [editMode, setEditMode] = useState(false)
    const [content, setContent] = useState(comment.content)
    const [modalToggle, setModalToggle] = useState(false);
    const [errorText, setErrorText] = useState('');

    const changeVisibilityModal = () => {
        setModalToggle(!modalToggle);
    }
    
    const userData: UserDataLs = JSON.parse(localStorage.getItem('userData')!)

    const onModifyHandler = () => {
        setEditMode(!editMode)
    }

    const onChangeContent = (newContent: string) => {
        setContent(newContent)
    }

    const onModifySubmit = async (event: any) => {
        try {
            const option = {
                headers: {
                    Authorization: `Bearer ${userData.token}`
                }
            }
            const newComment = await axios.put(`http://127.0.0.1:3000/api/post/${postId}/comment/${comment.id}`, {content}, option)
            setUpdatedBy(newComment.data.updatedBy)
            onModifyComment(comment.id, content)
            setEditMode(!editMode)
        } catch (error: any) {
            if(error.response.data.message){
                setErrorText(`Une erreur est survenue :\n${error.response.data.message}`)
            } else if (error.response.data) {
                setErrorText(`Une erreur est survenue :\n${error.response.data}`)
            }
            changeVisibilityModal()
        }
    }

    const modifyAuthor: string = useMemo(() => {
        switch (updatedBy) {
            case 'ADMIN':
                return '\n(modifié par Admin)';
            case 'MODERATOR':
                return '\n(modifié par Modérateur)';
        }
            return '\n(modifié)';
    }, [updatedBy])
    
    return (
        <>
            <div className={classNames(cn.container)}>
                <div className={classNames(cn.avatar)}>{comment.author.avatar ? <img src={`${comment.author.avatar}`} alt={'Image de l\'utilisateur'} /> : <UserCircleIcon className={classNames(cn.icone)} />}</div>
                <div className={classNames(cn['comment-container'])}>
                    <div className={classNames(cn.title)}>
                        <div className={classNames(cn.author)}>
                            {comment.author.firstName} {comment.author.lastName}
                        </div>
                        <div className={classNames(cn.menu)}>
                            {(userData.userId == comment.authorId || userData.role == 'ADMIN' || userData.role == 'MODERATOR') && <AdminMenu commentId={comment.id} postId={postId} onClickModify={onModifyHandler} onDeleteComment={onDeleteComment}/>}
                        </div>
                    </div>
                    {editMode ?
                        <TextArea tabIndex={0} id={'editCom' + postId} name={'commentArea'} placeHolder={''} value={content} onSubnmitComment={onModifySubmit} onChangeHandler={onChangeContent} editMode />
                        :
                        <div className={classNames(cn.content)}>{comment.content}{updatedBy && ('\n' + modifyAuthor)}</div>}
                </div>
            </div>
            {modalToggle && <Modal text={errorText} onCloseModal={changeVisibilityModal} />}
        </>
    )
}

export default Comment;