import React, { useEffect } from "react";
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

const schemaSignUp = yup.object({
    email: yup.string().required(),
    password: yup.string().required(),
    confirmPassword: yup.string().required(),
}).required();

interface FomrSignUpProps {
    classes: string,
    activeForm: string,
}

const FormSignUp = ({classes, activeForm}: FomrSignUpProps) => {

    const authContext = useContext(AuthContext);
    const { response, isLoading, axiosFunction } = useAxios<{token: string}>({
        url: "/auth/signup",
        method: "POST"
    });
    const { register, handleSubmit, control, formState: { errors } } = useForm<IFormValues>({resolver: yupResolver(schemaSignUp)});

    const onSignUpSubmit =  (data: IFormValues) => {
        axiosFunction(data);
    };

    useEffect(() => {
        if (response) {
            localStorage.setItem("token", JSON.stringify(response.token));
            authContext?.setConnectHandle(true);
        }
    }, [response]);

    if (isLoading) {
        return (
            <div>Loading data...</div>
        );
    }
    
    return (
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
    );
};

export default FormSignUp;