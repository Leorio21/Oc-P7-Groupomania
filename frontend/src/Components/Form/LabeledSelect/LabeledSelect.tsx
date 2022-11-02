import React, { PropsWithChildren } from "react";
import classNames from "classnames";
import cn from "./LabeledSelect.module.scss";
import { Path, UseFormRegister } from "react-hook-form";
import { IFormValues } from "../../../interface/Index";

interface LabeledSelectProps extends PropsWithChildren {
    tabIndex: number
    name: Path<IFormValues>
    label: string
    id: string
    role: string
    register: UseFormRegister<IFormValues>,
    options: string[]
}

const LabeledSelect = ({tabIndex, name, label, id, role, register, options}: LabeledSelectProps) => {
    
    const selectOptions = options.map((option, key) => {
        return (<option value={option} key={key} >{option}</option>);
    });

    return (
        <div className={classNames(cn.selectContainer)}>
            <label>{label}</label>
            <select {...register(name)} value={role} id={id} tabIndex={tabIndex}>
                {selectOptions}
            </select>
        </div>
    );
};

export default LabeledSelect;
