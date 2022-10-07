import React from "react"
import logo from "../../assets/logo_rouge.webp"
import classNames from "classnames"
import cn from "./Error.module.scss"


const Error = () => {
    return (
        <div className={classNames(cn.error_container)}>
            <img src={logo} alt='logo Groupomania' />
            <h1 className={classNames(cn.primary_title)}>Erreur 404</h1>
            <p className={classNames(cn.error_texte)}>La page demandée n&apos;existe pas</p>
            <h2 className={classNames(cn.secondary_title)}>Groupomania</h2>
        </div>
    )
}

export default Error