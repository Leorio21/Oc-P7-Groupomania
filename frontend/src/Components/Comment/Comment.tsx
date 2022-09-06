import { useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { UserCircleIcon } from '@heroicons/react/solid';
import { OnePostComment } from '../../interface/Index';
import { Role } from '../../../../backend/node_modules/@prisma/client'

import classNames from 'classnames';
import cn from './Comment.module.scss'

import AdminMenu from '../AdminMenu/AdminMenu';
import Modal from '../Modal/Modal';
import axios from 'axios';
import { AuthContext } from '../../Context/AuthContext';
import FormComment from '../Form/FormComment';
import { Link } from 'react-router-dom';

const initilTextError = ''
const reducerModal = (state: string, action: { type: string; payload?: string; }) => {
    switch(action.type) {
        case 'display':
            state = action.payload!
            return state
        case 'hide':
            state = ''
            return state
    }
    return state;
}
interface CommentProps {
    comment: OnePostComment,
    postId: number,
    onModifyComment: Function,
    onDeleteComment: Function
}

const Comment = ({comment, postId, onModifyComment, onDeleteComment}: CommentProps) => {

    const authContext = useContext(AuthContext)

    const [updatedBy, setUpdatedBy] = useState(comment.updatedBy)
    const [editMode, setEditMode] = useState(false)
    const [textError, dispatchModal] = useReducer(reducerModal, initilTextError);
    

    const onModifyHandler = () => {
        setEditMode(!editMode)
    }

    const onModifyCommentHandler = (commentId: number, updatedBy: Role, content: string) => {
        setUpdatedBy(updatedBy)
        onModifyComment(commentId, content)
        setEditMode(!editMode)
    }

    const onDeleteHandler = async (commentId: number) => {
        const option = {
            headers: {
                Authorization: `Bearer ${authContext!.token}`
            }
        }
            try {
                await axios.delete(`http://127.0.0.1:3000/api/post/${postId}/comment/${commentId}`, option)
                onDeleteComment(commentId)
            } catch (error: any) {
                if(error.response.data.message){
                    dispatchModal({type: 'display', payload: `Une erreur est survenue :\n${error.response.data.message}`})
                } else if (error.response.data) {
                    dispatchModal({type: 'display', payload: `Une erreur est survenue :\n${error.response.data}`})
                }
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
    
    useEffect(() => {
        if(editMode) {
            const element = document.getElementById(`editCom${postId}`)!
            element.style.height = "5px";
            element.style.height = (element.scrollHeight) + "px";
        }
    }, [editMode])
    
    return (
        <>
            <div className={classNames(cn.container)}>
                <div className={classNames(cn.avatar)}>{comment.author.avatar ? <img src={`${comment.author.avatar}`} alt={'Image de l\'utilisateur'} /> : <UserCircleIcon className={classNames(cn.icone)} />}</div>
                <div className={classNames(cn['comment-container'])}>
                    <div className={classNames(cn.title)}>
                        <Link to={`/profile/${comment.authorId}`} className={classNames(cn.nav__link)}>
                            <div className={classNames(cn.author)}>
                                {comment.author.firstName} {comment.author.lastName}
                            </div>
                        </Link>
                        <div className={classNames(cn.menu)}>
                            {(authContext!.userId == comment.authorId || authContext!.role == 'ADMIN' || authContext!.role == 'MODERATOR') && <AdminMenu id={comment.id} onModifyClick={onModifyHandler} onDeleteClick={onDeleteHandler}/>}
                        </div>
                    </div>
                    {editMode ?
                        <FormComment classes={classNames(cn.form_comment)} tabIndex={0} comment={comment} postId={postId} id={`editCom${postId}`} name='content' placeHolder='Ecrivez un commentaire ...' onSubmitForm={onModifyCommentHandler} editMode />
                        :
                        <div className={classNames(cn.content)}>{comment.content}{updatedBy && ('\n' + modifyAuthor)}</div>}
                </div>
            </div>
            {textError != '' && <Modal text={textError} onCloseModal={() => {dispatchModal({type: 'hide'})}} />}
        </>
    )
}

export default Comment;