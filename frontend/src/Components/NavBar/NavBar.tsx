import { Link } from "react-router-dom"
import { HomeIcon, LogoutIcon, UserCircleIcon, UserGroupIcon } from "@heroicons/react/outline"

import classNames from "classnames"
import cn from "./NavBar.module.scss"

import React, { useContext } from "react"
import { AuthContext } from "../../Context/AuthContext"


const NavBar = () => {

    const authContext = useContext(AuthContext)

    const onLogOutHandler = () => {
        localStorage.removeItem("token")

        authContext?.setConnectHandle(false)
    }

    return (
        <nav className={classNames(cn.nav)}>
            <Link to="/myprofile" className={classNames(cn.link)}><span className={classNames(cn.icon_container)}><UserCircleIcon className={classNames(cn.icon)} /></span><span className={classNames(cn.linkText)}>Mon Profil</span></Link>
            <Link to="/home" className={classNames(cn.link)}><span className={classNames(cn.icon_container)}><HomeIcon className={classNames(cn.icon)} /></span><span className={classNames(cn.linkText)}>Accueil</span></Link>
            <Link to="/members" className={classNames(cn.link)}><span className={classNames(cn.icon_container)}><UserGroupIcon className={classNames(cn.icon)} /></span><span className={classNames(cn.linkText)}>Membres</span></Link>
            <Link to="/" className={classNames(cn.link)} onClick={onLogOutHandler}><span className={classNames(cn.icon_container)}><LogoutIcon className={classNames(cn.icon)} /></span><span className={classNames(cn.linkText)}>Déconnexion</span></Link>
        </nav>
    )
}

export default NavBar