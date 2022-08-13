import classNames from 'classnames'
import { useState } from 'react';
import cn from './Connect.module.scss'

const Connect = () => {

    const [toggleForm, setToggleForm] = useState(false);

    const clickAnimation = (): void => {
        setToggleForm(!toggleForm)
        console.log(toggleForm)
    }

    return (
        <div className = {classNames(cn.container)}>
            <div className={classNames(cn.form_container)} style={toggleForm ? {'transform': 'rotate3d(0, 1, 0, 180deg)'} : {}}>
                <div className={classNames(cn.form, cn.coteDroit)}></div>
                <form className = {classNames(cn.form, cn.form_login)}>
                    <h2><span className={classNames(cn.navLink)} onClick={clickAnimation}>Inscription</span> -- <span>Connexion</span></h2>
                    <label htmlFor='name'>Adresse mail :</label>
                    <input tabIndex={toggleForm ? -1 : 0} type='text' id='mail' name='mail' />
                    <label htmlFor='password'>Mot de passe :</label>
                    <input tabIndex={toggleForm ? -1 : 0} type='password' id='password' name='password' />
                    <button tabIndex={toggleForm ? -1 : 0} type='button'>Se connecter</button>
                </form>
                <div className={classNames(cn.form, cn.coteGauche)}></div>
                <form className = {classNames(cn.form, cn.form_signup)}>
                    <h2><span>Inscription</span> -- <span className={classNames(cn.navLink)} onClick={clickAnimation}>Connexion</span></h2>
                    <label htmlFor='name'>Adresse mail :</label>
                    <input tabIndex={toggleForm ? 0 : -1} type='text' id='mail' name='mail' />
                    <label htmlFor='password'>Mot de passe :</label>
                    <input tabIndex={toggleForm ? 0 : -1} type='password' id='password' name='password' />
                    <label htmlFor='confirmPassword'>Confirmer le mot de passe :</label>
                    <input tabIndex={toggleForm ? 0 : -1} type='password' id='confirmPassword' name='confirmPassword' />
                    <button tabIndex={toggleForm ? 0 : -1} type='button'>S'inscrire</button>
                </form>
            </div>
        </div>
    )
}

export default Connect;