import { FormEvent, useContext, useReducer, useState } from 'react'
import { OnePostComment } from '../../interface/Index'
import axios from 'axios'

import classNames from 'classnames'
import cn from './CommentList.module.scss'

import Comment from './Comment'
import Modal from '../Modal/Modal'
import TextArea from '../Form/TextArea/TextArea'
import { AuthContext } from '../../Context/AuthContext'


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
    const [comment, setComment] = useState('');
    const [textError, dispatchModal] = useReducer(reducerModal, initilTextError);
    
    const onCommentHandler = (comment: string) => {
        setComment(comment)
    }

    const onModifyCommentHandler = (commentToModify: number, newContent: string) => {
        const newCommentsArray = [...comments]
        const indexOfCommentToModify = newCommentsArray.findIndex((comment) => comment.id == commentToModify)
        newCommentsArray[indexOfCommentToModify].content = newContent
        setComments(newCommentsArray)
    }

    const onDeleteCommentHandler = (commentToDelete: number) => {
        const newCommentsArray = comments.filter((comment) => comment.id != commentToDelete)
        setComments(newCommentsArray)
        changeCountComm(newCommentsArray.length)
    }

    const onCommentSubmit = async (event: FormEvent) => {
        event.preventDefault()
        try {
            if (comment == '') {
                throw {response: {data: {message: 'Veuillez saisir du texte'}}}
            }
            const option = {
                headers: {
                    Authorization: `Bearer ${authContext!.token}`
                }
            }
            const content = comment
            const bddComment = await axios.post(`http://127.0.0.1:3000/api/post/${postId}/comment`, {content}, option)
            const newComment: OnePostComment = { ...bddComment.data.comment }
            const newCommentsArray = [...comments]
            newCommentsArray.push(newComment)
            setComment('')
            setComments(newCommentsArray)
            changeCountComm(newCommentsArray.length)
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
                <form onSubmit={onCommentSubmit} id='formComment' className={classNames(cn.form_comment)}>
                    <TextArea
                        tabIndex={0}
                        id={'comment' + postId}
                        name='commentArea'
                        value={comment}
                        onSubnmitComment={onCommentSubmit}
                        onChangeHandler={onCommentHandler}
                        placeHolder='Ecrivez un commentaire ...'
                    />
                </form>
            </div>
            {textError != '' && <Modal text={textError} onCloseModal={() => {dispatchModal({type: 'hide'})}} />}
        </>
    )
}

export default CommentList;