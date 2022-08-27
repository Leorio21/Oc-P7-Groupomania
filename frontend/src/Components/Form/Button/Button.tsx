import { MouseEventHandler } from "react";

import classNames from 'classnames'
import cn from './Button.module.scss'


interface ButtonProps {
    tabIndex: number,
    type: 'button' | 'submit' | 'reset' | undefined,
    onClickHandler?: MouseEventHandler,
    label: string
}

const Button = ({tabIndex, type, onClickHandler, label}: ButtonProps) => {

    return (
        <button tabIndex={tabIndex} type={type} onClick={onClickHandler} className={classNames(cn.button)} >{label}</button>
    )
}

export default Button;