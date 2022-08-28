import { Path, UseFormRegister } from "react-hook-form";
import { IFormValues } from "../../../interface/Index";

import classNames from "classnames";
import cn from './Input.module.scss'

interface PropsType {
    tabIndex: number,
    type: string,
    id: string,
    name: Path<IFormValues>
    label: string,
    placeHolder: string,
    register: UseFormRegister<IFormValues>,
    required: boolean
}

const Input = ({tabIndex, type, id, label, name, placeHolder, register, required}: PropsType) => {

    return (
        <>
            <label htmlFor={id} className={classNames(cn.label)}>{label}
                <input tabIndex={tabIndex} id={id} type={type} {...register(name, { required })} placeholder={placeHolder} className={classNames(cn.input)} />
            </label>
        </>
    )
}

export default Input;