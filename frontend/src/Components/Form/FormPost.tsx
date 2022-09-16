import { PhotographIcon } from "@heroicons/react/outline"
import { Path, useForm } from "react-hook-form"
import { IFormValues, OnePost } from "../../interface/Index"
import { AuthContext } from "../../Context/AuthContext"
import axios from "axios"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import React, { useCallback, useContext, useEffect, useReducer, useState } from "react"


import PicturePreview from "./PicturePreview/PicturePreview"
import TextArea from "./TextArea/TextArea"
import FileInput from "./FileInput/FileInput"
import Modal from "../Modal/Modal"
import Button from "./Button/Button"
import HorizontalContainer from "./HorizontalContainer/HorizontalContainer"

const schemaPost = yup.object({
    content: yup.string(),
    photo: yup.mixed()
}).required()

const initilTextError = ""
const reducerModal = (state: string, action: { type: string; payload?: string; }) => {
    switch(action.type) {
        case "display":
            state = action.payload ?? "texte non défini"
            return state
        case "hide":
            state = ""
            return state
    }
    return state
}

interface FormPostProps {
    classes: string,
    classesIcon: string,
    buttonLabel: string,
    tabIndex: number,
    id: string,
    name: Path<IFormValues>
    placeHolder: string,
    post?: OnePost,
    onPostSubmit: Function,
    editMode?: boolean,
}

const FormPost = ({classes, buttonLabel, classesIcon, post, tabIndex, id, name, placeHolder, onPostSubmit, editMode}: FormPostProps) => {

    const authContext = useContext(AuthContext)
    const [textError, dispatchModal] = useReducer(reducerModal, initilTextError)
    const { register, handleSubmit, getValues, resetField, watch } = useForm<IFormValues>({defaultValues: { photo: undefined }, resolver: yupResolver(schemaPost)})
    const [ pictureUrl, setPictureUrl ] = useState<string | null | undefined>(post?.image)

    const onSubmitHandler = (data: IFormValues) => {
        if (post) {
            modifyPost(data)
        } else {
            createPost(data)
        }
    }

    const createPost = async (data: IFormValues) => {
        try {
            if(!data.content && (!data.photo || data.photo.length == 0)) {
                throw "Impossible de publier un message vide"
            }
            const myFormData = new FormData()
            myFormData.append("content", data.content)
            if (data.photo) {
                myFormData.append("photo", data.photo[0])
            }
            const option = {
                headers: {
                    "Content-Type":"multipart/form-data",
                    Authorization: `Bearer ${authContext?.token}`
                }
            }
            const bddPost = await axios.post("http://127.0.0.1:3000/api/post/", myFormData, option)
            const newPost: OnePost = {
                ...bddPost.data.post,
                like: [],
                comment: [],
                author: {
                    firstName: authContext?.firstName,
                    lastName: authContext?.lastName,
                    avatar: authContext?.avatar
                }
            }
            onPostSubmit(newPost)
            resetPicture()
            resetField("content")
            auto_grow()
        } catch (error: any) {
            if (!error.response) {
                dispatchModal({type: "display", payload: `${error}`})
            } else if(error.response.data.message){
                dispatchModal({type: "display", payload: `Une erreur est survenue :\n${error.response.data.message}`})
            } else if (error.response.data) {
                dispatchModal({type: "display", payload: `Une erreur est survenue :\n${error.response.data}`})
            }
        }
    }

    const modifyPost = async (data: IFormValues) => {
        try {
            if(data.content === "" && (!data.photo || data.photo.length == 0)) {
                throw "Impossible de publier un message vide"
            }
            const myFormData = new FormData()
            myFormData.append("content", data.content)
            if (pictureUrl) {
                const image = pictureUrl
                myFormData.append("image", image)
            } else {
                myFormData.append("image", "")
            }
            if (data.photo) {
                myFormData.append("photo", data.photo[0])
            }
            const option = {
                headers: {
                    "Content-Type":"multipart/form-data",
                    Authorization: `Bearer ${authContext?.token}`
                }
            }
            const bddPost = await axios.put(`http://127.0.0.1:3000/api/post/${post!.id}`, myFormData, option)
            const newPost: OnePost = {
                ...bddPost.data.post,
                like: [],
                comment: [],
                author: {
                    firstName: authContext?.firstName,
                    lastName: authContext?.lastName,
                    avatar: authContext?.avatar
                }
            }
            onPostSubmit(newPost)
            resetPicture()
            resetField("content")
            auto_grow()
        } catch (error: any) {
            if (!error.response) {
                dispatchModal({type: "display", payload: `${error}`})
            } else if(error.response.data.message){
                dispatchModal({type: "display", payload: `Une erreur est survenue :\n${error.response.data.message}`})
            } else if (error.response.data) {
                dispatchModal({type: "display", payload: `Une erreur est survenue :\n${error.response.data}`})
            }
        }
    }

    const resetPicture = () => {
        setPictureUrl("")
        resetField("photo")
    }

    const auto_grow = useCallback(() => {
        const element = document.getElementById(id)!
        element.style.height = "5px"
        element.style.height = (element.scrollHeight) + "px"
    }, [])

    useEffect(() => {
        if(getValues("photo")) {
            if (getValues("photo").length > 0) {
                setPictureUrl(window.URL.createObjectURL([...getValues("photo")][0]))
            }
        }
    }, [watch("photo")])

    return (
        <>
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
                    <Button tabIndex={0} type={"submit"} label={buttonLabel} />
                    <FileInput id={`picture${post?.id}`} name='photo' accept={"image/jpeg, image/png, image/gif, image/webp"} multiple={false} register={register}>
                        <PhotographIcon className={classesIcon} />Photo
                    </FileInput>
                </HorizontalContainer>
            </form>
            {textError !== "" && <Modal text={textError} onCloseModal={() => {dispatchModal({type: "hide"})}} />}
        </>
    )
}

export default FormPost