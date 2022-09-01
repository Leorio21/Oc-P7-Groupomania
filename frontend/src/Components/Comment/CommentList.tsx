import { useReducer, useState } from 'react'
import { OnePostComment } from '../../interface/Index'

import classNames from 'classnames'
import cn from './CommentList.module.scss'

import Comment from './Comment'
import Modal from '../Modal/Modal'
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

    const onCommentSubmit = (newComment: OnePostComment) => {
        setComments((prevState) => {
            const newCommentsArray = [...prevState]
            newCommentsArray.push(newComment)
            changeCountComm(newCommentsArray.length)
            return newCommentsArray

        })
    }

    return (
        <>
            <div className={classNames(cn['commentList-container'])}>
                {comments.map((comment) => {
                    return (
                        <Comment
                            comment={comment}
                            key={comment.id}
                            postId={postId}
                            onModifyComment={onModifyCommentHandler}
                            onDeleteComment={onDeleteCommentHandler}
                        />
                    )
                })}
                <FormComment
                    classes={classNames(cn.form_comment)}
                    tabIndex={0}
                    id={`comm${postId}`}
                    postId={postId}
                    name='content'
                    placeHolder='Ecrivez un commentaire ...'
                    onSubmitForm={onCommentSubmit}
                />
            </div>
            {textError != '' && <Modal text={textError} onCloseModal={() => {dispatchModal({type: 'hide'})}} />}
        </>
    )
}

export default CommentList;