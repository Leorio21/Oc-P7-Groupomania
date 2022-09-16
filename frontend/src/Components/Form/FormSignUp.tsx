import React, { useReducer } from "react"
import { IFormValues } from "../../interface/Index"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import axios from "axios"
import { useContext } from "react"
import { AuthContext } from "../../Context/AuthContext"

import Button from "../../Components/Form/Button/Button"
import LabeledInput from "./LabeledInput/LabeledInput"
import Modal from "../Modal/Modal"

import PasswordCheck from "./PasswordCheck/PasswordCheck"
import PasswordConfirm from "./PasswordConfirm/PasswordConfirm"

const schemaSignUp = yup.object({
    email: yup.string().required(),
    password: yup.string().required(),
    confirmPassword: yup.string().required(),
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

interface FomrSignUpProps {
    classes: string,
    activeForm: string,
}

const FormSignUp = ({classes, activeForm}: FomrSignUpProps) => {

    const authContext = useContext(AuthContext)

    const [textError, dispatchModal] = useReducer(reducerModal, initilTextError)
    const { register, handleSubmit, control, formState: { errors } } = useForm<IFormValues>({resolver: yupResolver(schemaSignUp)})

    const onSignUpSubmit = async (data: IFormValues) => {
        try {
            const userData = await axios.post("http://127.0.0.1:3000/api/auth/signup", data)
            localStorage.setItem("userData", JSON.stringify(userData.data))
            authContext?.setConnectHandle(true)
        } catch (error: any) {
            console.log(error)
            if(error.response.data.message){
                dispatchModal({type: "display", payload: `Une erreur est survenue : ${error.response.data.error}`})
            } else if (error.response.data) {
                dispatchModal({type: "display", payload: `Une erreur est survenue : ${error.response.data}`})
            }
        }
    }
    
    return (
        <>
            <form className = {classes} onSubmit={handleSubmit(onSignUpSubmit)}>
                <h2>Inscription</h2>
                <LabeledInput
                tabIndex={activeForm == "signup" ? 0 : -1}
                type='text'
                id='emailSignUp'
                name='email'
                label='Adresse mail :'
                placeHolder='nom.prenom@groupomania.fr'
                register={register}
                required
                />
                <p>{errors.email?.message && "Veuillez saisir votre email"}</p>
                <LabeledInput
                tabIndex={activeForm == "signup" ? 0 : -1}
                type='password'
                id='passwordSignUp'
                name='password'
                label='Mot de Passe :'
                placeHolder='Mot de passe'
                register={register}
                required
                />
                <PasswordCheck control={control} name='password'/>
                <p>{errors.password?.message && "Veuillez saisir votre mot de passe"}</p>
                <LabeledInput
                tabIndex={activeForm == "signup" ? 0 : -1}
                type='password'
                id='confirmPassword'
                name='confirmPassword'
                label='Confirmer votre mot de Passe :'
                placeHolder='Mot de passe'
                register={register}
                required
                />
                <PasswordConfirm control={control}  name='password' nameConfirm='confirmPassword' />
                <p>{errors.confirmPassword?.message && "Veuillez confirmer votre mot de passe"}</p>
                <Button 
                    tabIndex={activeForm == "signup" ? 0 : -1}
                    type='submit'
                    label="S'inscrire"
                    />
            </form>
            {textError != "" && <Modal text={textError} onCloseModal={() => {dispatchModal({type: "hide"})}} />}
        </>
    )
}

export default FormSignUp