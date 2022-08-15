import axios from 'axios';
import classNames from 'classnames'
import { useEffect, useState } from 'react';
import cn from './Connect.module.scss'
import { Navigate } from 'react-router-dom'

import { dataLogin, dataSignup } from '../../interface';

const Connect = () => {

    if (localStorage.getItem('userData')) {
        return <Navigate to='/posts' />
    }

    const [toggleForm, setToggleForm] = useState(false);
    const [activeForm, setActiveForm] = useState('login');
    
    const [ emailLogin, setEmailLogin ] = useState('');
    const [ passwordLogin, setPasswordLogin ] = useState('');

    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');

    const loginHandler = async () => {
        const data: dataLogin = {
            email: emailLogin,
            password: passwordLogin
        }
        try {
            const userData = await axios.post('http://127.0.0.1:3000/api/auth/login', data)
            localStorage.setItem('userData', JSON.stringify(userData.data));
            location.reload();
        } catch (error) {
            console.log(error)
        }
    }

    const signupHandler = async () => {
        const data: dataSignup = {
            email: email,
            password: password,
            confirmPassword: confirmPassword
        }
        try {
            const userData = await axios.post('http://127.0.0.1:3000/api/auth/signup', data)
            localStorage.setItem('userData', JSON.stringify(userData.data));
            location.reload();
        } catch (error) {
            console.log(error)
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
        <div className = {classNames(cn.container)}>
            <div className={toggleForm ? classNames(cn.form_container, cn.animation) : classNames(cn.form_container)}>
                <div className={classNames(cn.form, cn.coteDroit)}></div>
                <form className = {classNames(cn.form, cn.form_login)}>
                    <h3>Connexion</h3>
                    <label htmlFor='emailLogin'>Adresse mail :</label>
                    <input tabIndex={toggleForm ? 0 : -1} type='text' id='emailLogin' name='emailLogin' value={emailLogin} onChange={(event) => setEmailLogin(event.target.value)} />
                    <label htmlFor='passwordLogin'>Mot de passe :</label>
                    <input tabIndex={toggleForm ? 0 : -1} type='password' id='passwordLogin' name='passwordLogin' value={passwordLogin} onChange={(event) => setPasswordLogin(event.target.value)} />
                    <button tabIndex={toggleForm ? 0 : -1} type='button' onClick={loginHandler}>Se connecter</button>
                </form>
                <div className={classNames(cn.form, cn.coteGauche)}></div>
                <form className = {classNames(cn.form, cn.form_signup)}>
                    <h3>Inscription</h3>
                    <label htmlFor='email'>Adresse mail :</label>
                    <input tabIndex={toggleForm ? -1 : 0} type='text' id='email' name='email' value={email} onChange={(event) => setEmail(event.target.value)} />
                    <label htmlFor='password'>Mot de passe :</label>
                    <input tabIndex={toggleForm ? -1 : 0} type='password'  id='password' name='password' value={password} onChange={(event) => setPassword(event.target.value)} />
                    <label htmlFor='confirmPassword'>Confirmer le mot de passe :</label>
                    <input tabIndex={toggleForm ? -1 : 0} type='password' id='confirmPassword' name='confirmPassword' value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
                    <button tabIndex={toggleForm ? -1 : 0} type='button' onClick={signupHandler}>S'inscrire</button>
                </form>
            </div>
            <h2><span className={classNames(cn.navLink)} onKeyDownCapture ={clickAnimation} onClick={clickAnimation} id='signup' tabIndex={0}>Inscription</span> ----- <span className={classNames(cn.navLink)} onKeyDown={clickAnimation} onClick={clickAnimation} tabIndex={0} id='login'>Connexion</span></h2>
        </div>
    )
}

export default Connect;