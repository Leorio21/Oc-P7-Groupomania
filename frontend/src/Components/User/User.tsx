import React from "react"
import { UserProfil } from "../../interface/Index"
import classNames from "classnames"
import cn from "./User.module.scss"
import { UserCircleIcon } from "@heroicons/react/solid"
import { Link } from "react-router-dom"

interface UserProps {
    user: UserProfil
}

const User = ({user}: UserProps) => {
    
    return (
        <>
            <Link to={`/profile/${user.id}`} className={classNames(cn.nav__link)}>
                <div className={classNames(cn.user_container)}>
                    {user?.avatar ? <img src={user?.avatar} alt="avatar de l'utilisteur utilisateur" className={classNames(cn.avatarPicture)} /> : <UserCircleIcon className={classNames(cn.avatarPicture)} />}
                    <div className={classNames(cn.name)}>{user?.firstName} {user?.lastName}</div>
                </div>
            </Link>
        </>
    )
}

export default User