import React, { useContext, useEffect, useReducer, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { AuthContext } from "../../Context/AuthContext"
import axios, { AxiosError } from "axios"
import { PencilIcon, UserCircleIcon } from "@heroicons/react/solid"

import { OneUser } from "../../interface/Index"

import classNames from "classnames"
import cn from "./Profile.module.scss"

import Modal from "../../Components/Modal/Modal"
import PostsList from "../../Components/Post/PostsList"

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

const Profile = () => {

    const params = useParams()
    const authContext = useContext(AuthContext)
    const [textError, dispatchModal] = useReducer(reducerModal, initilTextError)
    const [userData, setUserData] = useState<OneUser>()

    const recupUserData = async () => {
        try {
            const option = {
                headers: {
                    Authorization: `Bearer ${authContext?.token}`
                }
            }
            const response = await axios.get(`http://127.0.0.1:3000/api/auth/user/${params.userId}`, option)
            setUserData(response.data.user)
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
    }

    useEffect(() => {
        recupUserData()
    }, [params.userId])
    
    return (
        <>{userData &&
            <>
                <div className={classNames(cn.picture_container)}>
                    {userData?.background && <img src={userData?.background} alt='image de fond utilisateur' className={classNames(cn.backgroundPicture)} />}
                    {userData?.avatar ? <img src={userData?.avatar} alt="avatar de l'utilisteur utilisateur" className={classNames(cn.avatarPicture)} /> : <UserCircleIcon className={classNames(cn.avatarPicture)} />}
                </div>
                <div className={classNames(cn.name)}>{userData?.firstName} {userData?.lastName}{authContext?.role === "ADMIN" && <Link to={`/myprofile/${params.userId}`} className={classNames(cn.link)}><PencilIcon tabIndex={0} className={classNames(cn["menu-icone"])} /></Link>}</div>
                <PostsList postUser={userData.post}/>
                {textError !== "" && <Modal text={textError} onCloseModal={() => {dispatchModal({type: "hide"})}} />}
            </>
        }
        </>
    )
}

export default Profile