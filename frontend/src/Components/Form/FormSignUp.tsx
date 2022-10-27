import React, { useEffect, useReducer } from "react";
import { IFormValues } from "../../interface/Index";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";

import Button from "../../Components/Form/Button/Button";
import LabeledInput from "./LabeledInput/LabeledInput";

import PasswordCheck from "./PasswordCheck/PasswordCheck";
import PasswordConfirm from "./PasswordConfirm/PasswordConfirm";
import { useAxios } from "../../Hooks/Axios";
import Modal from "../Modal/Modal";

const schemaSignUp = yup.object({
    email: yup.string().required(),
    password: yup.string().required(),
    confirmPassword: yup.string().required(),
}).required();


const initilTextError = "";
const reducerModal = (state: string, action: { type: string; payload?: string; }) => {
    switch(action.type) {
    case "display":
        state = action.payload ?? "Texte non defini";
        return state;
    case "hide":
        state = "";
        return state;
    }
    return state;
};
interface FomrSignUpProps {
    classes: string,
    activeForm: string,
}

const FormSignUp = ({classes, activeForm}: FomrSignUpProps) => {

    const authContext = useContext(AuthContext);
    const { response, isLoading, error, axiosFunction } = useAxios<{token: string}>({
        url: "/auth/signup",
        method: "POST"
    });
    const { register, handleSubmit, control, formState: { errors } } = useForm<IFormValues>({resolver: yupResolver(schemaSignUp)});
    const [textError, dispatchModal] = useReducer(reducerModal, initilTextError);

    const onSignUpSubmit =  (data: IFormValues) => {
        axiosFunction(data);
    };

    useEffect(() => {
        if (response) {
            localStorage.setItem("token", JSON.stringify(response.token));
            authContext?.setConnectHandle(true);
        }
        if (error) {
            dispatchModal({type: "display", payload: error});
        }
    }, [response, error]);

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
                <p>{errors.password?.message && "Veuillez saisir votre mot de passe"}</p>
                <PasswordCheck control={control} name='password'/>
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
                <p>{errors.confirmPassword?.message && "Veuillez confirmer votre mot de passe"}</p>
                <PasswordConfirm control={control}  name='password' nameConfirm='confirmPassword' />
                <Button 
                    tabIndex={activeForm == "signup" ? 0 : -1}
                    type='submit'
                    label="S'inscrire"
                    isLoading={isLoading}
                />
            </form>
            {textError && <Modal text={error} onCloseModal={() => {dispatchModal({type: "hide"});}} />}
        </>
    );
};

export default FormSignUp;