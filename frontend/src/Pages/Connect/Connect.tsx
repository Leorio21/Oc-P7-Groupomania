import { FormEvent, useContext, useEffect, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../Context/AuthContext';
import { DataLogin, DataSignup } from '../../interface/Index';

import classNames from 'classnames'
import cn from './Connect.module.scss'

import Modal from '../../Components/Modal/Modal';
import axios from 'axios';
import Input from '../../Components/Form/Input/Input';
import Button from '../../Components/Form/Button/Button';

const initialForm = 'login'
const reducerForm = (state: string) => {
    return state == 'login' ? 'signup' : 'login';
}

const initilTextError = ''
const reducerModal = (state: string, action: { type: string; payload?: string; }) => {
    switch(action.type) {
        case 'display':
            state = action.payload!
            return state
        case 'hide':
            state = ''
            return state
    }
    return state;
}

const Connect = () => {
    const navigate = useNavigate();
    const authContext = useContext(AuthContext)

    const [activeForm, toggleForm] = useReducer(reducerForm, initialForm);
    const [textError, dispatchModal] = useReducer(reducerModal, initilTextError);
    
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');

    const changeEmailHandler = (newEmail: string) => {
        setEmail(newEmail)
    }

    const changePasswordHandler = (newPassword: string) => {
        setPassword(newPassword)
    }

    const changeConfirmPasswordHandler = (newConfirmPassword: string) => {
        setConfirmPassword(newConfirmPassword)
    }

    const loginHandler = async (event: FormEvent) => {
        event.preventDefault()
        const data: DataLogin = {
            email: email,
            password: password
        }
        try {
            const userData = await axios.post('http://127.0.0.1:3000/api/auth/login', data)
            localStorage.setItem('userData', JSON.stringify(userData.data));
            authContext!.setUserIdHandle(userData.data.userId)
            authContext!.setTokenHandle(userData.data.token)
            authContext!.setRoleHandle(userData.data.role)
            authContext!.setConnectHandle(true)
            navigate('/home')
        } catch (error: any) {
            if(error.response.data.message){
                dispatchModal({type: 'display', payload: error.response.data.message})
            } else if (error.response.data) {
                dispatchModal({type: 'display', payload: error.response.data})
            }
        }
    }

    const signupHandler = async (event: FormEvent) => {
        event.preventDefault()
        const data: DataSignup = {
            email: email,
            password: password,
            confirmPassword: confirmPassword
        }
        try {
            const userData = await axios.post('http://127.0.0.1:3000/api/auth/signup', data)
            localStorage.setItem('userData', JSON.stringify(userData.data));
            authContext!.setUserIdHandle(userData.data.userId)
            authContext!.setTokenHandle(userData.data.token)
            authContext!.setRoleHandle(userData.data.role)
            authContext!.setConnectHandle(true)
            navigate('/home')
        } catch (error: any) {
            if(error.response.data.message){
                dispatchModal({type: 'display', payload: error.response.data.message})
            } else if (error.response.data) {
                dispatchModal({type: 'display', payload: error.response.data})
            }
        }
    }

    useEffect(() => {
        if (authContext!.connected) {
            navigate('/home')
        }
    }, [authContext!.connected])

    return (
        <>
            <div className = {classNames(cn.container)} id='form_container'>
                <div className={activeForm == 'signup' ? classNames(cn.form_container, cn.animation) : classNames(cn.form_container)}>
                    <div className={classNames(cn.form, cn.coteDroit)}></div>
                    <form className = {classNames(cn.form, cn.form_login)} onSubmit={loginHandler} id='formLogin'>
                        <h3>Connexion</h3>
                        <Input
                            tabIndex={activeForm == 'login' ? 0 : -1}
                            type='text'
                            id='emailLogin'
                            value={email}
                            onChangeHandler={changeEmailHandler}
                            label='Adresse mail :'
                            placeHolder='nom.prenom@groupomania.fr'
                        />
                        {<Input
                            tabIndex={activeForm == 'login' ? 0 : -1}
                            type='password'
                            id='passwordLogin'
                            value={password}
                            onChangeHandler={changePasswordHandler}
                            label='Mot de passe :'
                            placeHolder='Mot de passe'
                        />}
                        <Button 
                            tabIndex={activeForm == 'login' ? 0 : -1}
                            type='submit'
                            label='Se connecter'
                            />
                    </form>
                    <div className={classNames(cn.form, cn.coteGauche)}></div>
                    <form className = {classNames(cn.form, cn.form_signup)} onSubmit={signupHandler} id='formSignUp'>
                        <h3>Inscription</h3>
                        <Input
                            tabIndex={activeForm == 'signup' ? 0 : -1}
                            type='text'
                            id='email'
                            value={email}
                            onChangeHandler={changeEmailHandler}
                            label='Adresse mail :'
                            placeHolder='nom.prenom@groupomania.fr'
                            />
                        <Input
                            tabIndex={activeForm == 'signup' ? 0 : -1}
                            type='password'
                            id='password'
                            value={password}
                            onChangeHandler={changePasswordHandler}
                            label='Mot de passe :'
                            placeHolder='Mot de passe'
                        />
                        <Input
                            tabIndex={activeForm == 'signup' ? 0 : -1}
                            type='password'
                            id='confirmPassword'
                            value={confirmPassword}
                            onChangeHandler={changeConfirmPasswordHandler}
                            label='Mot de passe :'
                            placeHolder='Confirmer le mot de passe'
                        />
                        <Button 
                            tabIndex={activeForm == 'signup' ? 0 : -1}
                            type='submit'
                            label="S'inscrire"
                        />
                    </form>
                </div>
                <div>
                    {activeForm == 'login' ? 
                    <span className={classNames(cn.navLink)} onKeyDownCapture ={toggleForm} onClick={toggleForm} id='signup' tabIndex={0}>Pas encore compte ? Créez un compte</span>
                    :
                    <span className={classNames(cn.navLink)} onKeyDown={toggleForm} onClick={toggleForm} tabIndex={0} id='login'>Déjà inscrit ? Connectez-vous</span>}
                </div>
            </div>
            {textError != '' && <Modal text={textError} onCloseModal={() => {dispatchModal({type: 'hide'})}} />}
        </>
    )
}

export default Connect;