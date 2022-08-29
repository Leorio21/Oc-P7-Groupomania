import { Path, UseFormRegister } from "react-hook-form";
import { IFormValues } from "../../../interface/Index";

import classNames from "classnames";
import cn from './Input.module.scss';

interface InputProps {
    tabIndex: number,
    type: string,
    id: string,
    name: Path<IFormValues>
    placeHolder: string,
    register: UseFormRegister<IFormValues>,
    required: boolean
}

const Input = ({tabIndex, type, id, name, placeHolder, register, required}: InputProps) => {

    return (
        <>
            <input tabIndex={tabIndex} type={type} id={id} placeholder={placeHolder} {...register(name, { required })} />
        </>
    )
}

export default Input;