import { MouseEventHandler } from "react";

interface ButtonProps {
    tabIndex: number,
    type: 'button' | 'submit' | 'reset' | undefined,
    onClickHandler?: MouseEventHandler,
    label: string
}

const Button = ({tabIndex, type, onClickHandler, label}: ButtonProps) => {

    return (
        <button tabIndex={tabIndex} type={type} onClick={onClickHandler}>{label}</button>
    )
}

export default Button;