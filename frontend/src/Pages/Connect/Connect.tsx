import React, { useContext, useEffect, useReducer } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../Context/AuthContext"

import classNames from "classnames"
import cn from "./Connect.module.scss"

import FormLogin from "../../Components/Form/FormLogin"
import FormSignUp from "../../Components/Form/FormSignUp"

const initialForm = "login"
const reducerForm = (state: string) => {
    return state === "login" ? "signup" : "login"
}

const Connect = () => {
    const navigate = useNavigate()
    const authContext = useContext(AuthContext)

    const [activeForm, toggleForm] = useReducer(reducerForm, initialForm)
    
    const onKeyDownHandler = (event: any) => {
        console.log(event)
        if (event.key === " " || event.key === "Enter") {
            toggleForm()
        }
    }

    useEffect(() => {
        if (authContext?.connected) {
            navigate("/home")
        }
    }, [authContext?.connected])

    return (
        <>
            <div className = {classNames(cn.container)} id='form_container'>
                <div className={activeForm === "signup" ? classNames(cn.form_container, cn.animation) : classNames(cn.form_container)}>
                    <div className={classNames(cn.form, cn.coteDroit)}></div>
                    <FormLogin
                        activeForm={activeForm}
                        classes={classNames(cn.form, cn.form_login)}
                    />
                    <div className={classNames(cn.form, cn.coteGauche)}></div>
                    <FormSignUp
                        activeForm={activeForm}
                        classes={classNames(cn.form, cn.form_signup)}
                    />
                </div>
                <div>
                    {activeForm === "login" ? 
                    <span className={classNames(cn.navLink)} onKeyDown ={onKeyDownHandler} onClick={toggleForm} id='signup' tabIndex={0}>Pas encore compte ? Créez un compte</span>
                    :
                    <span className={classNames(cn.navLink)} onKeyDown={onKeyDownHandler} onClick={toggleForm} tabIndex={0} id='login'>Déjà inscrit ? Connectez-vous</span>}
                </div>
            </div>
        </>
    )
}

export default Connect