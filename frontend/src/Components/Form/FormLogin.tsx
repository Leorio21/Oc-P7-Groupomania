import React, { useCallback, useEffect } from "react";
import { IFormValues, UserToken } from "../../interface/Index";
import LabeledInput from "./LabeledInput/LabeledInput";
import Button from "../../Components/Form/Button/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { useAxios } from "../../Hooks/Axios";

const schemaLogin = yup.object({
    email: yup.string().required(),
    password: yup.string().required(),
}).required();
interface FormLoginProps {
    classes: string,
    activeForm: string,
}

const FormLogin = ({classes, activeForm}: FormLoginProps) => {

    const { response, isLoading, axiosFunction } = useAxios<UserToken>({
        url: "auth/login",
        method: "POST"
    });
    const authContext = useContext(AuthContext);
    const { register, handleSubmit, formState: { errors } } = useForm<IFormValues>({resolver: yupResolver(schemaLogin)});

    const onLoginSubmit = useCallback(
        async (data: IFormValues) => {
            axiosFunction(data);
        }, []
    );

    useEffect(() => {
        if (response) {
            localStorage.setItem("token", JSON.stringify(response.token));
            authContext?.setConnectHandle(true);
        }
    }, [response]);

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
                    isLoading={isLoading}
                />
            </form>
        </>
    );
};

export default FormLogin;