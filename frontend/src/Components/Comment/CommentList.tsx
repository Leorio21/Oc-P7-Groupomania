import { FormEvent, useContext, useReducer, useState } from 'react'
import { IFormValues, OnePostComment } from '../../interface/Index'
import axios from 'axios'

import classNames from 'classnames'
import cn from './CommentList.module.scss'

import Comment from './Comment'
import Modal from '../Modal/Modal'
import TextArea from '../Form/TextArea/TextArea'
import { AuthContext } from '../../Context/AuthContext'
import FormComment from '../Form/FormComment'


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
interface CommentListProps {
    arrayComment: OnePostComment[],
    postId: number,
    changeCountComm: Function
}

const CommentList = ({arrayComment, postId, changeCountComm}: CommentListProps) => {

    const authContext = useContext(AuthContext)

    const [comments, setComments] = useState(arrayComment);
    const [textError, dispatchModal] = useReducer(reducerModal, initilTextError);

    const onModifyCommentHandler = (commentToModify: number, newContent: string) => {
        setComments((prevState) => {
            const newCommentsArray = [...prevState]
            const indexOfCommentToModify = newCommentsArray.findIndex((comment) => comment.id == commentToModify)
            newCommentsArray[indexOfCommentToModify].content = newContent
            return newCommentsArray
        })
    }

    const onDeleteCommentHandler = (commentToDelete: number) => {
        setComments((prevState) => {
            const newCommentsArray = prevState.filter((comment) => comment.id != commentToDelete)
            changeCountComm(newCommentsArray.length)
            return newCommentsArray
        })
    }

    const onCommentSubmit = async (data: IFormValues) => {
        try {
            const option = {
                headers: {
                    Authorization: `Bearer ${authContext!.token}`
                }
            }
            const bddComment = await axios.post(`http://127.0.0.1:3000/api/post/${postId}/comment`, data, option)
            const newComment: OnePostComment = { ...bddComment.data.comment }
            setComments((prevState) => {
                const newCommentsArray = [...prevState]
                newCommentsArray.push(newComment)
                changeCountComm(newCommentsArray.length)
                return newCommentsArray

            })
        } catch (error: any) {
            if(error.response.data.message){
                dispatchModal({type: 'display', payload: `Une erreur est survenue :\n${error.response.data.message}`})
            } else if (error.response.data) {
                dispatchModal({type: 'display', payload: `Une erreur est survenue :\n${error.response.data}`})
            }
        }
    }

    return (
        <>
            <div className={classNames(cn['commentList-container'])}>
                {comments.map((comment) => {
                    return <Comment comment={comment} key={comment.id} postId={postId} onModifyComment={onModifyCommentHandler} onDeleteComment={onDeleteCommentHandler} />
                })}
                <FormComment classes={classNames(cn.form_comment)} tabIndex={0} id={`comm${postId}`} name='content' placeHolder='Ecrivez un commentaire ...' onSubmitComment={onCommentSubmit} />
            </div>
            {textError != '' && <Modal text={textError} onCloseModal={() => {dispatchModal({type: 'hide'})}} />}
        </>
    )
}

export default CommentList;