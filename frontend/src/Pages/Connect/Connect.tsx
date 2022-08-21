import classNames from 'classnames'
import { FormEvent, useState } from 'react';
import cn from './Connect.module.scss'
import { Navigate } from 'react-router-dom'

import { dataLogin, dataSignup } from '../../interface/Index';
import Modal from '../../Components/Modal/Modal';
import axios from 'axios';

const Connect = () => {

    if (localStorage.getItem('userData')) {
        return <Navigate to='/posts' />
    }

    const [modalToggle, setModalToggle] = useState(false);
    const [errorText, setErrorText] = useState('')
    
    const [toggleForm, setToggleForm] = useState(false);
    const [activeForm, setActiveForm] = useState('login');
    
    const [ emailLogin, setEmailLogin ] = useState('');
    const [ passwordLogin, setPasswordLogin ] = useState('');
    
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');

    const changeVisibilityModal = () => {
        setModalToggle(!modalToggle);
    }

    const loginHandler = async (event: FormEvent) => {
        event.preventDefault()
        const data: dataLogin = {
            email: emailLogin,
            password: passwordLogin
        }
        try {
            const userData = await axios.post('http://127.0.0.1:3000/api/auth/login', data)
            localStorage.setItem('userData', JSON.stringify(userData.data));
            location.reload();
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
        const myForm: HTMLFormElement = document.querySelector('#formSignUp')!
        const data = new FormData(myForm)
        const option = {
            headers: { "Content-Type": "multipart/form-data" },
            data: data
        }
        try {
            const userData = await axios.post('http://127.0.0.1:3000/api/auth/signup', option)
            localStorage.setItem('userData', JSON.stringify(userData.data));
            location.reload();
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

    return (
        <>
            {modalToggle && <Modal text={errorText} onCloseModal={changeVisibilityModal} />}
            <div className = {classNames(cn.container)} id='form_container'>
                <div className={toggleForm ? classNames(cn.form_container, cn.animation) : classNames(cn.form_container)}>
                    <div className={classNames(cn.form, cn.coteDroit)}></div>
                    <form className = {classNames(cn.form, cn.form_login)} onSubmit={loginHandler} id='formLogin'>
                        <h3>Connexion</h3>
                        <label htmlFor='emailLogin'>Adresse mail :</label>
                        <input tabIndex={toggleForm ? -1 : 0} type='text' id='emailLogin' name='emailLogin' value={emailLogin} onChange={(event) => setEmailLogin(event.target.value)} />
                        <label htmlFor='passwordLogin'>Mot de passe :</label>
                        <input tabIndex={toggleForm ? -1 : 0} type='password' id='passwordLogin' name='passwordLogin' value={passwordLogin} onChange={(event) => setPasswordLogin(event.target.value)} />
                        <button tabIndex={toggleForm ? -1 : 0} type='submit' onClick={loginHandler}>Se connecter</button>
                    </form>
                    <div className={classNames(cn.form, cn.coteGauche)}></div>
                    <form className = {classNames(cn.form, cn.form_signup)} id='formSingUp'>
                        <h3>Inscription</h3>
                        <label htmlFor='email'>Adresse mail :</label>
                        <input tabIndex={toggleForm ? 0 : -1} type='text' id='email' name='email' value={email} onChange={(event) => setEmail(event.target.value)} />
                        <label htmlFor='password'>Mot de passe :</label>
                        <input tabIndex={toggleForm ? 0 : -1} type='password'  id='password' name='password' value={password} onChange={(event) => setPassword(event.target.value)} />
                        <label htmlFor='confirmPassword'>Confirmer le mot de passe :</label>
                        <input tabIndex={toggleForm ? 0 : -1} type='password' id='confirmPassword' name='confirmPassword' value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
                        <button tabIndex={toggleForm ? 0 : -1} type='button' onClick={signupHandler}>S'inscrire</button>
                    </form>
                </div>
                <h2><span className={classNames(cn.navLink)} onKeyDownCapture ={clickAnimation} onClick={clickAnimation} id='signup' tabIndex={0}>Inscription</span> ----- <span className={classNames(cn.navLink)} onKeyDown={clickAnimation} onClick={clickAnimation} tabIndex={0} id='login'>Connexion</span></h2>
            </div>
        </>
    )
}

export default Connect;