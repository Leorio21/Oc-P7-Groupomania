import axios, { AxiosError } from "axios"
import classNames from "classnames"
import cn from "./Members.module.scss"
import React, { useCallback, useContext, useEffect, useReducer, useState } from "react"
import Modal from "../../Components/Modal/Modal"
import User from "../../Components/User/User"
import { AuthContext } from "../../Context/AuthContext"
import { UserProfil } from "../../interface/Index"

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

const Members = () => {

    const authContext = useContext(AuthContext)
    const [textError, dispatchModal] = useReducer(reducerModal, initilTextError)
    const [userList, setUserList] = useState<UserProfil[]>([])

    const recupUserData = useCallback(
        async (): Promise<void> => {
            try {
                const option = {
                    headers: {
                        Authorization: `Bearer ${authContext?.token}`
                    }
                }
                const response = await axios.get("http://127.0.0.1:3000/api/auth/members", option)
                setUserList(response.data.user)
            } catch (error: unknown) {
                if (error instanceof AxiosError) {
                    if(error.response?.data.error){
                        dispatchModal({type: "display", payload: `Une erreur est survenue :\n${error.response.data.error}`})
                    } else if (error.response?.data) {
                        dispatchModal({type: "display", payload: `Une erreur est survenue :\n${error.response.data}`})
                    }
                } else {
                    dispatchModal({type: "display", payload: "Une erreur est survenue :\nErreur inconnue"})
                }
            }
        }, []
    )

    useEffect(() => {
        recupUserData()
    }, [])
    
    return (
        <div className={classNames(cn.members_container)}>
            {userList ? userList?.map((user) => {
                return <User key={`user${user.id}`} user={user} />
            }) : <div>Chargement en cours....</div>}
            {textError !== "" && <Modal text={textError} onCloseModal={() => {dispatchModal({type: "hide"})}} />}
        </div>
    )
}

export default Members