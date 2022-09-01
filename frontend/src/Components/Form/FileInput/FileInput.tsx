import { ChangeEventHandler, ReactElement, useEffect, useState } from "react";
import { Path, UseFormGetValues, UseFormRegister } from "react-hook-form";
import { IFormValues } from "../../../interface/Index";

import classNames from "classnames";
import cn from './FileInput.module.scss'

interface FileInputProps {
    id: string,
    name: Path<IFormValues>,
    accept?: string,
    multiple?: boolean,
    register: UseFormRegister<IFormValues>,
    children: any
}

const FileInput = ({id, name, register, accept, multiple, children}: FileInputProps) => {

    return (
        <label htmlFor={id} className={classNames(cn.container)}>
            {children}
            <input className={classNames(cn.inputFile)} accept={accept} type='file' multiple={multiple} id={id} { ...register(name)} />
        </label>
    )
}

export default FileInput;