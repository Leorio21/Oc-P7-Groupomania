import React from "react";
import { CheckIcon, XIcon } from "@heroicons/react/solid";

import classNames from "classnames";
import { Control, FieldValues, Path, useWatch } from "react-hook-form";
import cn from "./PasswordConfirm.module.scss";

interface PasswordConfirmProps<T extends FieldValues>{
    name: Path<T>
    nameConfirm: Path<T>
    control: Control<T>
}
const PasswordConfirm = <T extends FieldValues>({name, nameConfirm, control}: PasswordConfirmProps<T>) => {

    const password = useWatch({name, control});
    const passwordConfirm = useWatch({name: nameConfirm, control});

    return (
        <div className={classNames(cn.container)}>
            {password === passwordConfirm ? <span><CheckIcon className={classNames(cn.icon, cn.iconCheck)} /> Les mots de passe sont identiques</span>:<span><XIcon className={classNames(cn.icon, cn.iconX)} /> Les mots de passe ne sont pas identiques</span>}
            
        </div>
    );
};

export default PasswordConfirm;