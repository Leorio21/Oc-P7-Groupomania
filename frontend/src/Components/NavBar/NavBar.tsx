import { Link } from 'react-router-dom'

import { HomeIcon, LogoutIcon, UserCircleIcon } from '@heroicons/react/outline'

import classNames from 'classnames'
import cn from './NavBar.module.scss'


const NavBar = () => {


    return (
        <nav className={classNames(cn.nav)}>
            <Link to="/myprofile" className={classNames(cn.link)}><span className={classNames(cn.icon_container)}><UserCircleIcon className={classNames(cn.icon)} /></span><span className={classNames(cn.linkText)}>Mon Profil</span></Link>
            <Link to="/home" className={classNames(cn.link)}><span className={classNames(cn.icon_container)}><HomeIcon className={classNames(cn.icon)} /></span><span className={classNames(cn.linkText)}>Accueil</span></Link>
            <Link to="/logout" className={classNames(cn.link)}><span className={classNames(cn.icon_container)}><LogoutIcon className={classNames(cn.icon)} /></span><span className={classNames(cn.linkText)}>Déconnexion</span></Link>
        </nav>
    )
}

export default NavBar;