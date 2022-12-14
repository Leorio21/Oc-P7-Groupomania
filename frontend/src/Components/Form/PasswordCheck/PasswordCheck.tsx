import React from "react";
import { CheckIcon, XIcon } from "@heroicons/react/solid";

import classNames from "classnames";
import { Control, FieldValues, Path, useWatch } from "react-hook-form";
import cn from "./PasswordCheck.module.scss";

interface PasswordCheckProps<T extends FieldValues>{
    name: Path<T>
    control: Control<T>
}

const passwordCheck = <T extends FieldValues>({name, control}: PasswordCheckProps<T>) => {
    const password = useWatch({ control, name });

    return (
        <div className={classNames(cn.container)}>
            <span>Le mot de passe doit :</span>
            <span>{password?.match(/[a-z]/) ? <CheckIcon className={classNames(cn.icon, cn.iconCheck)} />:<XIcon className={classNames(cn.icon, cn.iconX)} />} contenir au moins 1 minuscule</span>
            <span>{password?.match(/[A-Z]/) ? <CheckIcon className={classNames(cn.icon, cn.iconCheck)} />:<XIcon className={classNames(cn.icon, cn.iconX)} />} contenir au moins 1 majuscule</span>
            <span>{password?.match(/[0-9].*[0-9]/) ? <CheckIcon className={classNames(cn.icon, cn.iconCheck)} />:<XIcon className={classNames(cn.icon, cn.iconX)} />} contenir au moins 2 chiffres</span>
            <span>{password?.match(/[\W]/) ? <CheckIcon className={classNames(cn.icon, cn.iconCheck)} />:<XIcon className={classNames(cn.icon, cn.iconX)} />} contenir au moins 1 symbole</span>
            <span>{password?.match(/^.{8,20}$/) ? <CheckIcon className={classNames(cn.icon, cn.iconCheck)} />:<XIcon className={classNames(cn.icon, cn.iconX)} />} faire entre 8 et 20 caractères</span>
        </div>
    );
};

export default passwordCheck;