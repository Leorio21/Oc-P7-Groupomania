import React, { useReducer } from "react"
import { IFormValues } from "../../interface/Index"
import LabeledInput from "./LabeledInput/LabeledInput"
import Button from "../../Components/Form/Button/Button"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import axios, { AxiosError } from "axios"
import { useContext } from "react"
import { AuthContext } from "../../Context/AuthContext"
import Modal from "../Modal/Modal"

const schemaLogin = yup.object({
    email: yup.string().required(),
    password: yup.string().required(),
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

interface FormLoginProps {
    classes: string,
    activeForm: string,
}

const FormLogin = ({classes, activeForm}: FormLoginProps) => {

    const authContext = useContext(AuthContext)

    const [textError, dispatchModal] = useReducer(reducerModal, initilTextError)
    const { register, handleSubmit, formState: { errors } } = useForm<IFormValues>({resolver: yupResolver(schemaLogin)})

    const onLoginSubmit = async (data: IFormValues) => {
        try {
            const userData = await axios.post("http://127.0.0.1:3000/api/auth/login", data)
            localStorage.setItem("token", JSON.stringify(userData.data.token))
            authContext?.setConnectHandle(true)
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
    }
    
    return (
        <>
            <form className = {classes} onSubmit={handleSubmit(onLoginSubmit)}>
                <h2>Connexion</h2>
                <LabeledInput
                    tabIndex={activeForm === "login" ? 0 : -1}
                    type='text'
                    id='emailLogin'
                    name='email'
                    label='Adresse mail :'
                    placeHolder='nom.prenom@groupomania.fr'
                    register={register}
                    required
                />
                <p>{errors.email?.message && "Veuillez saisir votre email"}</p>
                <LabeledInput
                    tabIndex={activeForm === "login" ? 0 : -1}
                    type='password'
                    id='passwordLogin'
                    name='password'
                    label='Mot de Passe :'
                    placeHolder='Mot de passe'
                    register={register}
                    required
                />
                <p>{errors.password?.message && "Veuillez saisir votre mot de passe"}</p>
                <Button 
                    tabIndex={activeForm == "login" ? 0 : -1}
                    type='submit'
                    label='Se connecter'
                />
            </form>
            {textError !== "" && <Modal text={textError} onCloseModal={() => {dispatchModal({type: "hide"})}} />}
        </>
    )
}

export default FormLogin