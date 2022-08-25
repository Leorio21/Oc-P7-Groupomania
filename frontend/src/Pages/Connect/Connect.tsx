import classNames from 'classnames'
import { FormEvent, useEffect, useState } from 'react';
import cn from './Connect.module.scss'
import { useNavigate } from 'react-router-dom'

import { DataLogin, DataSignup } from '../../interface/Index';
import Modal from '../../Components/Modal/Modal';
import axios from 'axios';
import Input from '../../Components/Form/Input/Input';
import Button from '../../Components/Form/Button/Button';

const Connect = () => {
    const navigate = useNavigate();

    const [modalToggle, setModalToggle] = useState(false);
    const [errorText, setErrorText] = useState('')
    
    const [toggleForm, setToggleForm] = useState(false);
    const [activeForm, setActiveForm] = useState('login');
    
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');

    const changeVisibilityModal = () => {
        setModalToggle(!modalToggle);
    }

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
            navigate('/posts')
        } catch (error: any) {
            if(error.response.data.message){
                setErrorText(error.response.data.message)
            } else if (error.response.data) {
                setErrorText(error.response.data)
            }
            setModalToggle(!modalToggle)
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
            navigate('/posts')
        } catch (error: any) {
            if(error.response.data.message){
                setErrorText(error.response.data.message)
            } else if (error.response.data) {
                setErrorText(error.response.data)
            }
            setModalToggle(!modalToggle)
        }
    }

    const clickAnimation = (event:any): void => {
        if ((activeForm === 'signup' && event.target.id === 'login') || (activeForm === 'login' && event.target.id === 'signup')) {
            if (event.type === 'click' || event.code === 'Space') {
                activeForm === 'login' ? setActiveForm('signup') : setActiveForm('login')
                setToggleForm(!toggleForm)
            }
        }
    }

    useEffect(() => {
        if (localStorage.getItem('userData')) {
            navigate('/posts')
        }
    }, [])

    return (
        <>
            <div className = {classNames(cn.container)} id='form_container'>
                <div className={toggleForm ? classNames(cn.form_container, cn.animation) : classNames(cn.form_container)}>
                    <div className={classNames(cn.form, cn.coteDroit)}></div>
                    <form className = {classNames(cn.form, cn.form_login)} onSubmit={loginHandler} id='formLogin'>
                        <h3>Connexion</h3>
                        <Input
                            tabIndex={toggleForm ? -1 : 0}
                            type='text'
                            id='emailLogin'
                            value={email}
                            onChangeHandler={changeEmailHandler}
                            label='Adresse mail :'
                            placeHolder='nom.prenom@groupomania.fr'
                        />
                        <Input
                            tabIndex={toggleForm ? -1 : 0}
                            type='password'
                            id='passwordLogin'
                            value={password}
                            onChangeHandler={changePasswordHandler}
                            label='Mot de passe :'
                            placeHolder='Mot de passe'
                        />
                        <Button 
                            tabIndex={toggleForm ? -1 : 0}
                            type='submit'
                            onClickHandler={loginHandler}
                            label='Se connecter'
                            />
                    </form>
                    <div className={classNames(cn.form, cn.coteGauche)}></div>
                    <form className = {classNames(cn.form, cn.form_signup)} id='formSingUp'>
                        <h3>Inscription</h3>
                        <Input
                            tabIndex={toggleForm ? 0 : -1}
                            type='text'
                            id='email'
                            value={email}
                            onChangeHandler={changeEmailHandler}
                            label='Adresse mail :'
                            placeHolder='nom.prenom@groupomania.fr'
                            />
                        <Input
                            tabIndex={toggleForm ? 0 : -1}
                            type='password'
                            id='password'
                            value={password}
                            onChangeHandler={changePasswordHandler}
                            label='Mot de passe :'
                            placeHolder='Mot de passe'
                        />
                        <Input
                            tabIndex={toggleForm ? 0 : -1}
                            type='password'
                            id='confirmPassword'
                            value={confirmPassword}
                            onChangeHandler={changeConfirmPasswordHandler}
                            label='Mot de passe :'
                            placeHolder='Confirmer le mot de passe'
                        />
                        <Button 
                            tabIndex={toggleForm ? 0 : -1}
                            type='submit'
                            onClickHandler={signupHandler}
                            label="S'inscrire"
                        />
                    </form>
                </div>
                <h2><span className={classNames(cn.navLink)} onKeyDownCapture ={clickAnimation} onClick={clickAnimation} id='signup' tabIndex={0}>Inscription</span> ----- <span className={classNames(cn.navLink)} onKeyDown={clickAnimation} onClick={clickAnimation} tabIndex={0} id='login'>Connexion</span></h2>
            </div>
            {modalToggle && <Modal text={errorText} onCloseModal={changeVisibilityModal} />}
        </>
    )
}

export default Connect;