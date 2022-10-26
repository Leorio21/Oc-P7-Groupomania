import classNames from "classnames";
import React, { MouseEventHandler } from "react";
import Loader from "../../Loader/Loader";

import cn from "./Button.module.scss";

interface ButtonProps {
    tabIndex: number
    type: "button" | "submit" | "reset"
    onClickHandler?: MouseEventHandler
    label: string
    color?: "green" | "red"
    isLoading?: boolean
}

const Button = ({tabIndex, type, onClickHandler, label, color, isLoading}: ButtonProps) => {

    return (
        <button className={color && classNames(cn[color])} tabIndex={tabIndex} type={type} onClick={onClickHandler}>
            {isLoading ?
                <div>
                    <Loader color="#ffffff" isLoading size={25} />
                </div>
                :
                label}
        </button>
    );
};

export default Button;