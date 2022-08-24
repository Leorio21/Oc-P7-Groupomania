import { ChangeEventHandler, useState } from "react";

import classNames from "classnames";
import cn from './Input.module.scss'

interface PropsType {
    tabIndex: number,
    type: string,
    id: string,
    value: string,
    onChangeHandler: Function,
    label: string
}

const Input = ({tabIndex, type, id, value, onChangeHandler, label}: PropsType) => {

    const [inputValue, setInputValue] = useState(value)

const changeHandler = (event: any) => {
    setInputValue(event.target.value)
    onChangeHandler(event.target.value)
}

    return (
        <>
            <label htmlFor={id} className={classNames(cn.label)}>{label}</label>
            <input tabIndex={tabIndex} type={type} id={id} name={id} value={inputValue} onChange={changeHandler} className={classNames(cn.input)} />
        </>
    )
}

export default Input;