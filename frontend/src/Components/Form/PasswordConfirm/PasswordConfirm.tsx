import { CheckIcon, XIcon } from '@heroicons/react/solid';

import classNames from "classnames";
import { useEffect } from 'react';
import cn from './PasswordConfirm.module.scss'

interface PasswordConfirmProps {
    password: string | null
    passwordConfirm: string | null
}
const PasswordConfirm = ({password, passwordConfirm}: PasswordConfirmProps) => {

    return (
        <div className={classNames(cn.container)}>
            {password == passwordConfirm ? <span><CheckIcon className={classNames(cn.icon, cn.iconCheck)} /> Les mots de passe sont identique</span>:<span><XIcon className={classNames(cn.icon, cn.iconX)} /> Les mots de passe ne sont pas identique</span>}
            
        </div>
    )
}

export default PasswordConfirm;