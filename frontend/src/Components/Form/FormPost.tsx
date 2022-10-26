import { PhotographIcon } from "@heroicons/react/outline";
import { Path, useForm } from "react-hook-form";
import { IFormValues, OnePost } from "../../interface/Index";
import { AuthContext } from "../../Context/AuthContext";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import React, { useCallback, useContext, useEffect, useState } from "react";


import PicturePreview from "./PicturePreview/PicturePreview";
import TextArea from "./TextArea/TextArea";
import FileInput from "./FileInput/FileInput";
import Button from "./Button/Button";
import HorizontalContainer from "./HorizontalContainer/HorizontalContainer";
import { useAxios } from "../../Hooks/Axios";

const schemaPost = yup.object({
    content: yup.string(),
    photo: yup.mixed()
}).required();

interface FormPostProps {
    classes: string,
    classesIcon: string,
    buttonLabel: string,
    tabIndex: number,
    id: string,
    name: Path<IFormValues>
    placeHolder: string,
    post?: OnePost,
    onPostSubmit: (newPost: OnePost) => void,
    editMode?: boolean,
}

const FormPost = ({classes, buttonLabel, classesIcon, post, tabIndex, id, name, placeHolder, onPostSubmit, editMode}: FormPostProps) => {

    const authContext = useContext(AuthContext);
    const { response, isLoading, axiosFunction } = useAxios<{message: string, post: OnePost}>({
        url: post ? `/post/${post?.id}` : "/post",
        method: post ? "PUT" : "POST",
        headers: {
            "Content-Type":"multipart/form-data"
        }
    });
    const { register, handleSubmit, getValues, resetField, watch } = useForm<IFormValues>({defaultValues: { photo: undefined }, resolver: yupResolver(schemaPost)});
    const [ pictureUrl, setPictureUrl ] = useState<string | null | undefined>(post?.image);

    const onSubmitHandler = useCallback(
        async (data: IFormValues) => {
            if(!data.content && (!data.photo || data.photo.length == 0)) {
                throw "Impossible de publier un message vide";
            }
            const myFormData = new FormData();
            if (data.content) {
                myFormData.append("content", data.content);
            } else {
                myFormData.append("content", "");
            }
            if (pictureUrl) {
                const image = pictureUrl;
                myFormData.append("image", image);
            } else {
                myFormData.append("image", "");
            }
            if (data.photo) {
                myFormData.append("photo", data.photo[0]);
            }
            axiosFunction(myFormData);
        }, [pictureUrl]
    );

    const resetPicture = () => {
        setPictureUrl("");
        resetField("photo");
    };

    const auto_grow = useCallback(() => {
        const element = document.getElementById(id)!;
        element.style.height = "5px";
        element.style.height = (element.scrollHeight) + "px";
    }, []);

    useEffect(() => {
        if(getValues("photo")) {
            if (getValues("photo").length > 0) {
                setPictureUrl(window.URL.createObjectURL([...getValues("photo")][0]));
            }
        }
    }, [watch("photo")]);

    useEffect(() => {
        if (response) {
            const newPost: OnePost = {
                ...response.post,
                like: [],
                comment: [],
                author: {
                    id: authContext!.userId,
                    firstName: authContext!.firstName,
                    lastName: authContext!.lastName,
                    avatar: authContext!.avatar
                }
            };
            onPostSubmit(newPost);
            resetPicture();
            resetField("content");
            auto_grow();
        }
    }, [response]);

    return (
        <form className = {classes} onSubmit={handleSubmit(onSubmitHandler)}>
            {pictureUrl !== "" && <PicturePreview pictureUrl={pictureUrl} resetPicture={resetPicture} />}
            <TextArea
                tabIndex={tabIndex}
                id={id}
                name={name}
                placeHolder={placeHolder}
                register={register}
                value={post?.content}
                onSubmitComment={handleSubmit(onSubmitHandler)}
                postForm
                editMode={editMode}
            />
            <HorizontalContainer>
                <Button tabIndex={0} type={"submit"} label={buttonLabel} isLoading={isLoading} color="green"/>
                <FileInput id={`picture${post?.id}`} name='photo' accept={"image/jpeg, image/png, image/gif, image/webp"} multiple={false} register={register}>
                    <PhotographIcon className={classesIcon} />Photo
                </FileInput>
            </HorizontalContainer>
        </form>
    );
};

export default FormPost;