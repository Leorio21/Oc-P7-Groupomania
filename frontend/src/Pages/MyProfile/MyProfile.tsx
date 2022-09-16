import axios from "axios"
import React, { useContext, useEffect, useReducer, useState } from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import Modal from "../../Components/Modal/Modal"
import { AuthContext } from "../../Context/AuthContext"
import { IFormValues, OneUser } from "../../interface/Index"

import classNames from "classnames"
import cn from "./MyProfile.module.scss"
import FileInput from "../../Components/Form/FileInput/FileInput"
import { useForm } from "react-hook-form"
import { PencilIcon, TrashIcon } from "@heroicons/react/solid"
import Button from "../../Components/Form/Button/Button"

const schemaProfile = yup.object({
    firstName: yup.string(),
    lastName: yup.string(),
    newPassword: yup.string(),
    confirmNewPassword: yup.string(),
    avatar: yup.mixed(),
    bgPicture: yup.mixed()
}).required()

const initilTextError = ""
const reducerModal = (state: string, action: { type: string; payload?: string; }) => {
    switch(action.type) {
        case "display":
            state = action.payload ?? "Texte non défini"
            return state
        case "hide":
            state = ""
            return state
    }
    return state
}

const MyProfile = () => {
    
    const authContext = useContext(AuthContext)

    const { register, handleSubmit, getValues, resetField, watch } = useForm<IFormValues>({defaultValues: { bgPicture: undefined, avatar: undefined }, resolver: yupResolver(schemaProfile)})
    
    
    const [textError, dispatchModal] = useReducer(reducerModal, initilTextError)
    const [userFirstName, setUserFirstName] = useState("")
    const [userLastName, setUserLastName] = useState("")
    const [userBgPictureUrl, setUserBgPictureUrl] = useState<string | null | undefined>()
    const [userAvatarUrl, setUserAvatarUrl] = useState<string | null | undefined>()

    const recupUserData = async () => {
        try {
            const option = {
                headers: {
                    Authorization: `Bearer ${authContext?.token}`
                }
            }
            const response = await axios.get(`http://127.0.0.1:3000/api/auth/${authContext?.userId}`, option)
            setUserFirstName(response.data.user.firstName)
            setUserLastName(response.data.user.lastName)
            setUserBgPictureUrl(response.data.user.background)
            setUserAvatarUrl(response.data.user.avatar)
        } catch (error: any) {
            if(error.response.data.message){
                dispatchModal({type: "display", payload: `Une erreur est survenue :\n${error.response.data.message}`})
            } else if (error.response.data) {
                dispatchModal({type: "display", payload: `Une erreur est survenue :\n${error.response.data}`})
            }
        }
    }

    const onDeleteBgPicture = () => {
        setUserBgPictureUrl(null)
        resetField("bgPicture")
    }

    const onDeleteAvatarPicture = () => {
        setUserAvatarUrl(null)
        resetField("avatar")
    }

    const onFormSubmit = async (data: IFormValues) => {
        try {
            const myFormData = new FormData()
            myFormData.append("password", "Fleurs#44")
            if (userBgPictureUrl) {
                const bgImg = userBgPictureUrl
                myFormData.append("userBg", bgImg)
            } else {
                myFormData.append("userBg", "")
            }
            if (data.bgPicture) {
                myFormData.append("bgPicture", data.bgPicture[0])
            }
            if (userAvatarUrl) {
                const avatarImg = userAvatarUrl
                myFormData.append("userAvatar", avatarImg)
            } else {
                myFormData.append("userAvatar", "")
            }
            if (data.avatar) {
                myFormData.append("avatar", data.avatar[0])
            }
            const option = {
                headers: {
                    "Content-Type":"multipart/form-data",
                    Authorization: `Bearer ${authContext?.token}`
                }
            }
            await axios.put(`http://127.0.0.1:3000/api/auth/${authContext?.userId}`, myFormData, option)
        } catch (error: any) {
            console.log(error)
            if(error.response.data.message){
                dispatchModal({type: "display", payload: `Une erreur est survenue : ${error.response.data.error}`})
            } else if (error.response.data) {
                dispatchModal({type: "display", payload: `Une erreur est survenue : ${error.response.data}`})
            }
        } 
    }

    useEffect(() => {
        if(getValues("bgPicture")) {
            if (getValues("bgPicture").length > 0) {
                setUserBgPictureUrl(window.URL.createObjectURL([...getValues("bgPicture")][0]))
            }
        }
    }, [watch("bgPicture")])

    useEffect(() => {
        if(getValues("avatar")) {
            if (getValues("avatar").length > 0) {
                setUserAvatarUrl(window.URL.createObjectURL([...getValues("avatar")][0]))
            }
        }
    }, [watch("avatar")])

    useEffect(() => {
        recupUserData()
    }, [])

    return (
        <>
            <form className={classNames(cn.form)} onSubmit={handleSubmit(onFormSubmit)}>
                <div className={classNames(cn.bg_container)}>
                    {userBgPictureUrl && <img src={userBgPictureUrl} alt="Image utilisateur" />}
                    <div className={classNames(cn.menuImg, cn["menuImg--bg"])}>
                        <TrashIcon className={classNames(cn.icon, cn["icon--trash"])} onClick={onDeleteBgPicture}/>
                        <FileInput id={"picture"} name='bgPicture' accept={"image/jpeg, image/png, image/gif, image/webp"} multiple={false} register={register}>
                            <PencilIcon className={classNames(cn.icon, cn["icon--pencil"])} />
                        </FileInput>
                    </div>
                </div>
                <div className={classNames(cn.avatar_container)}>
                    {userAvatarUrl && <img src={userAvatarUrl} alt="Image utilisateur" />}
                    <div className={classNames(cn.menuImg, cn["menuImg--avatar"])}>
                        <TrashIcon className={classNames(cn.icon, cn["icon--trash"])} onClick={onDeleteAvatarPicture}/>
                        <FileInput id={"avatar"} name='avatar' accept={"image/jpeg, image/png, image/gif, image/webp"} multiple={false} register={register}>
                            <PencilIcon className={classNames(cn.icon, cn["icon--pencil"])} />
                        </FileInput>
                    </div>
                </div>
                <Button 
                    tabIndex={0}
                    type='submit'
                    label="Enregistrer"
                />
            </form>
            {textError != "" && <Modal text={textError} onCloseModal={() => {dispatchModal({type: "hide"})}} />}
        </>
    )
}

export default MyProfile