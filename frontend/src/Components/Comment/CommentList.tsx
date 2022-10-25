import React, { useState } from "react";
import { OnePostComment } from "../../interface/Index";
import { Role } from "../../../../backend/node_modules/@prisma/client";

import classNames from "classnames";
import cn from "./CommentList.module.scss";

import Comment from "./Comment";
import FormComment from "../Form/FormComment";
interface CommentListProps {
    arrayComment: OnePostComment[],
    postId: number,
    changeCountComm: (newCounterComm: number) => void
}

const CommentList = ({arrayComment, postId, changeCountComm}: CommentListProps) => {

    const [comments, setComments] = useState(arrayComment);

    const onModifyCommentHandler = (commentToModify: number, modifyBy: Role | null, newContent: string): void => {
        setComments((prevState) => {
            const newCommentsArray = [...prevState];
            const indexOfCommentToModify = newCommentsArray.findIndex((comment) => comment.id == commentToModify);
            newCommentsArray[indexOfCommentToModify].content = newContent;
            newCommentsArray[indexOfCommentToModify].updatedBy = modifyBy;
            return newCommentsArray;
        });
    };

    const onDeleteCommentHandler = (commentToDelete: number): void => {
        setComments((prevState) => {
            const newCommentsArray = prevState.filter((comment) => comment.id != commentToDelete);
            changeCountComm(newCommentsArray.length);
            return newCommentsArray;
        });
    };

    const onCommentSubmit = (newComment: OnePostComment): void => {
        setComments((prevState) => {
            const newCommentsArray = [...prevState];
            newCommentsArray.push(newComment);
            changeCountComm(newCommentsArray.length);
            return newCommentsArray;
        });
    };

    return (
        <div className={classNames(cn["commentList-container"])}>
            {comments.map((comment) => {
                return (
                    <Comment
                        comment={comment}
                        key={comment.id}
                        postId={postId}
                        onModifyComment={onModifyCommentHandler}
                        onDeleteComment={onDeleteCommentHandler}
                    />
                );
            })}
            <FormComment
                classes={classNames(cn.form_comment)}
                tabIndex={0}
                id={`comm${postId}`}
                postId={postId}
                name='content'
                placeHolder='Ecrivez un commentaire ...'
                onCreateForm={onCommentSubmit}
            />
        </div>
    );
};

export default CommentList;