import classNames from "classnames";
import React, { MouseEventHandler } from "react";

import cn from "./Button.module.scss";

interface ButtonProps {
    tabIndex: number
    type: "button" | "submit" | "reset"
    onClickHandler?: MouseEventHandler
    label: string
    color?: "green" | "red"
}

const Button = ({tabIndex, type, onClickHandler, label, color}: ButtonProps) => {

    return (
        <button className={color && classNames(cn[color])} tabIndex={tabIndex} type={type} onClick={onClickHandler}>{label}</button>
    );
};

export default Button;