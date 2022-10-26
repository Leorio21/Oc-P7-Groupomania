import { IFormValues, OnePostComment } from "../../interface/Index";
import { Path, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Role } from "../../../../backend/node_modules/@prisma/client";
import TextArea from "./TextArea/TextArea";
import React, { useEffect } from "react";
import { useAxios } from "../../Hooks/Axios";
import Loader from "../Loader/Loader";

const schemaComment = yup.object({
    content: yup.string().required("Ce champ ne peut être vide"),
}).required();
interface FormCommentProps {
    classes: string,
    postId?: number,
    tabIndex: number,
    id: string,
    name: Path<IFormValues>
    placeHolder: string,
    comment?: OnePostComment,
    onCreateForm?: (newComment: OnePostComment) => void,
    onModifyForm?: (commentId: number, updatedBy: Role | null, content: string) => void,
    editMode?: boolean
}

const FormComment = ({classes, tabIndex, id, postId, name, placeHolder, comment, onCreateForm, onModifyForm}: FormCommentProps) => {
    
    const { register, handleSubmit, resetField, formState: { errors } } = useForm<IFormValues>({resolver: yupResolver(schemaComment)});
    const { response, isLoading, axiosFunction } = useAxios<{comment: OnePostComment}>({
        url: comment ? `post/${postId}/comment/${comment?.id}` : `post/${postId}/comment`,
        method: comment ? "PUT" : "POST"
    });

    const onSubmitHandler = (data: IFormValues) => {
        axiosFunction(data);
    };

    useEffect(() => {
        if (response) {
            if (comment) {
                onModifyForm && onModifyForm(comment!.id, response!.comment.updatedBy, response!.comment.content);
            } else if (onCreateForm) {
                const newComment: OnePostComment = { ...response.comment };
                onCreateForm && onCreateForm(newComment);
            }
            resetField("content");
        }
    }, [response]);

    if (isLoading) {
        return (
            <Loader color={"#FFFFFF"} isLoading size={50} />
        );
    }

    return (
        <form className = {classes} onSubmit={handleSubmit(onSubmitHandler)}>
            <TextArea
                tabIndex={tabIndex}
                id={id}
                name={name}
                placeHolder={placeHolder}
                register={register}
                value={comment?.content}
                onSubmitComment={handleSubmit(onSubmitHandler)}
            />
            <p>{errors.content?.message}</p>
        </form>
    );
};

export default FormComment;