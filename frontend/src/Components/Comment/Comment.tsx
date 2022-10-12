import React, { useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react"
import { UserCircleIcon } from "@heroicons/react/solid"
import { OnePostComment } from "../../interface/Index"
import { Role } from "../../../../backend/node_modules/@prisma/client"

import classNames from "classnames"
import cn from "./Comment.module.scss"

import AdminMenu from "../AdminMenu/AdminMenu"
import Modal from "../Modal/Modal"
import axios, { AxiosError } from "axios"
import { AuthContext } from "../../Context/AuthContext"
import FormComment from "../Form/FormComment"
import { Link } from "react-router-dom"

const initilTextError = ""
const reducerModal = (state: string, action: { type: string; payload?: string; }) => {
    switch(action.type) {
    case "display":
        state = action.payload ?? "Texte non defini"
        return state
    case "hide":
        state = ""
        return state
    }
    return state
}
interface CommentProps {
    comment: OnePostComment,
    postId: number,
    onModifyComment: (commentToModify: number, modifyBy: string, newContent: string) => void,
    onDeleteComment: (commentToDelete: number) => void
}

const Comment = ({comment, postId, onModifyComment, onDeleteComment}: CommentProps) => {

    const authContext = useContext(AuthContext)

    const [updatedBy, setUpdatedBy] = useState(comment.updatedBy)
    const [editMode, setEditMode] = useState(false)
    const [textError, dispatchModal] = useReducer(reducerModal, initilTextError)
    

    const onModifyHandler = (): void => {
        setEditMode(!editMode)
    }

    const onModifyCommentHandler = (commentId: number, updatedBy: Role, content: string): void => {
        setUpdatedBy(updatedBy)
        onModifyComment(commentId, updatedBy, content)
        setEditMode(!editMode)
    }

    const onDeleteHandler = useCallback(
        async (): Promise<void> => {
            const option = {
                headers: {
                    Authorization: `Bearer ${authContext?.token}`
                }
            }
            try {
                await axios.delete(`${authContext?.apiUrl}/api/post/${postId}/comment/${comment.id}`, option)
                onDeleteComment(comment.id)
            } catch (error: unknown) {
                if (error instanceof AxiosError) {
                    if(error.response?.data.message){
                        dispatchModal({type: "display", payload: `Une erreur est survenue :\n${error.response.data.message}`})
                    } else if (error.response?.data) {
                        dispatchModal({type: "display", payload: `Une erreur est survenue :\n${error.response.data}`})
                    }
                } else {
                    dispatchModal({type: "display", payload: "Une erreur est survenue :\nErreur inconnue"})
                }
            }
        }, []
    )

    const modifyAuthor: string = useMemo(() => {
        switch (updatedBy) {
        case "ADMIN":
            return "\n(modifié par Admin)"
        case "MODERATOR":
            return "\n(modifié par Modérateur)"
        }
        return "\n(modifié)"
    }, [updatedBy])
    
    return (
        <>
            <div className={classNames(cn.container)}>
                <div className={classNames(cn.avatar)}>{comment.author.avatar ? <img src={`${comment.author.avatar}`} alt={"Image de l'utilisateur"} /> : <UserCircleIcon className={classNames(cn.icone)} />}</div>
                <div className={classNames(cn["comment-container"])}>
                    <div className={classNames(cn.title)}>
                        <Link to={`/profile/${comment.authorId}`} className={classNames(cn.nav__link)}>
                            <div className={classNames(cn.author)}>
                                {comment.author.firstName} {comment.author.lastName}
                            </div>
                        </Link>
                        <div className={classNames(cn.menu)}>
                            {(authContext?.userId == comment.authorId || authContext?.role == "ADMIN" || authContext?.role == "MODERATOR") && <AdminMenu onModifyClick={onModifyHandler} onDeleteClick={onDeleteHandler}/>}
                        </div>
                    </div>
                    {editMode ?
                        <FormComment classes={classNames(cn.form_comment)} tabIndex={0} comment={comment} postId={postId} id={`editCom${postId}`} name='content' placeHolder='Ecrivez un commentaire ...' onModifyForm={onModifyCommentHandler} editMode />
                        :
                        <div className={classNames(cn.content)}>{comment.content}{updatedBy && ("\n" + modifyAuthor)}</div>}
                </div>
            </div>
            {textError !== "" && <Modal text={textError} onCloseModal={() => {dispatchModal({type: "hide"})}} />}
        </>
    )
}

export default Comment