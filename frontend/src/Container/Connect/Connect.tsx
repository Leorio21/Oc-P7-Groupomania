import classNames from 'classnames'
import { useState } from 'react';
import cn from './Connect.module.scss'

const Connect = () => {

    const [toggleForm, setToggleForm] = useState(false);
    const [activeForm, setActiveForm] = useState('login');

    const clickAnimation = (event:any): void => {
        if ((activeForm === 'login' && event.target.id === 'login') || (activeForm === 'signup' && event.target.id === 'signup')) {
            if (event.type === 'click' || event.code === 'Space') {
                activeForm === 'login' ? setActiveForm('signup') : setActiveForm('login')
                setToggleForm(!toggleForm)
            }
        }
    }

    return (
        <div className = {classNames(cn.container)}>
            <div className={toggleForm ? classNames(cn.form_container) : classNames(cn.form_container, cn.animation)}>
                <div className={classNames(cn.form, cn.coteDroit)}></div>
                <form className = {classNames(cn.form, cn.form_login)}>
                    <h3>Connexion</h3>
                    <label htmlFor='emailLogin'>Adresse mail :</label>
                    <input tabIndex={toggleForm ? 0 : -1} type='text' id='emailLogin' name='emailLogin' />
                    <label htmlFor='passwordLogin'>Mot de passe :</label>
                    <input tabIndex={toggleForm ? 0 : -1} type='password' id='passwordLogin' name='passwordLogin' />
                    <button tabIndex={toggleForm ? 0 : -1} type='button'>Se connecter</button>
                </form>
                <div className={classNames(cn.form, cn.coteGauche)}></div>
                <form className = {classNames(cn.form, cn.form_signup)}>
                    <h3>Inscription</h3>
                    <label htmlFor='email'>Adresse mail :</label>
                    <input tabIndex={toggleForm ? -1 : 0} type='text' id='email' name='email' />
                    <label htmlFor='password'>Mot de passe :</label>
                    <input tabIndex={toggleForm ? -1 : 0} type='password' id='password' name='password' />
                    <label htmlFor='confirmPassword'>Confirmer le mot de passe :</label>
                    <input tabIndex={toggleForm ? -1 : 0} type='password' id='confirmPassword' name='confirmPassword' />
                    <button tabIndex={toggleForm ? -1 : 0} type='button'>S'inscrire</button>
                </form>
            </div>
            <h2><span className={classNames(cn.navLink)} onKeyDownCapture ={clickAnimation} onClick={clickAnimation} id='signup' tabIndex={0}>Inscription</span> ----- <span className={classNames(cn.navLink)} onKeyDown={clickAnimation} onClick={clickAnimation} tabIndex={0} id='login'>Connexion</span></h2>
        </div>
    )
}

export default Connect;