import React, { useContext, useEffect, useMemo, useState } from "react";
import { UserCircleIcon } from "@heroicons/react/solid";
import { OnePostComment } from "../../interface/Index";
import { Role } from "../../../../backend/node_modules/@prisma/client";

import classNames from "classnames";
import cn from "./Comment.module.scss";

import AdminMenu from "../AdminMenu/AdminMenu";
import { AuthContext } from "../../Context/AuthContext";
import FormComment from "../Form/FormComment";
import { Link } from "react-router-dom";
import { useAxios } from "../../Hooks/Axios";
import Loader from "../Loader/Loader";
interface CommentProps {
    comment: OnePostComment,
    postId: number,
    onModifyComment: (commentToModify: number, modifyBy: Role | null, newContent: string) => void,
    onDeleteComment: (commentToDelete: number) => void
}

const Comment = ({comment, postId, onModifyComment, onDeleteComment}: CommentProps) => {

    const authContext = useContext(AuthContext);
    const [updatedBy, setUpdatedBy] = useState(comment.updatedBy);
    const [editMode, setEditMode] = useState(false);
    const { response, isLoading, axiosFunction } = useAxios({
        url : `/post/${postId}/comment/${comment.id}`,
        method: "DELETE"
    });

    const onModifyHandler = (): void => {
        setEditMode(!editMode);
    };

    const onModifyCommentHandler = (commentId: number, updatedBy: Role | null, content: string): void => {
        setUpdatedBy(updatedBy);
        onModifyComment(commentId, updatedBy, content);
        setEditMode(!editMode);
    };

    const onDeleteHandler = (): void => {
        axiosFunction();
    };

    const modifyAuthor: string = useMemo(() => {
        switch (updatedBy) {
        case "ADMIN":
            return "\n(modifié par Admin)";
        case "MODERATOR":
            return "\n(modifié par Modérateur)";
        }
        return "\n(modifié)";
    }, [updatedBy]);

    useEffect(() => {
        if (response) {
            onDeleteComment(comment.id);
        }
    }, [response]);
    
    return (
        <div className={classNames(cn.container)}>
            {isLoading && <div className={classNames(cn.loader)}><Loader color={"#FFFFFF"} isLoading size={50} /></div>}
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
    );
};

export default Comment;