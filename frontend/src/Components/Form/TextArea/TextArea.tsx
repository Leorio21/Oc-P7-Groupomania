import { Path, UseFormRegister } from "react-hook-form";
import { IFormValues } from "../../../interface/Index";

import classNames from "classnames";
import cn from './TextArea.module.scss'

interface TextAreaProps {
    tabIndex: number,
    id: string,
    name: Path<IFormValues>
    placeHolder: string,
    register: UseFormRegister<IFormValues>,
    value?: string,
    onSubmitComment: Function,
    editMode?: boolean,
    postForm?: boolean,
}

const TextArea = ({tabIndex, id, placeHolder, name,  value, register, onSubmitComment, editMode, postForm }: TextAreaProps) => {

    const onKeyDownHandler = (event: any) => {
        if (!postForm) {
            const txtAreaEl = document.getElementById(id)! as HTMLTextAreaElement
            if (event.key == 'Enter' && !event.altKey) {
                event.preventDefault()
                onSubmitComment()
                if (!editMode) {
                    txtAreaEl.value = ''
                }
            } else  if (event.key == 'Enter' && event.altKey) {
                const poscur = txtAreaEl.selectionEnd
                const debut = txtAreaEl.value.substring(0, poscur);
                const fin = txtAreaEl.value.substring(poscur, txtAreaEl.value.length);
                txtAreaEl.value = debut + '\n' + fin
                txtAreaEl.setSelectionRange(poscur + 1, poscur + 1)
            }
        }
        auto_grow()
    }

    const auto_grow = () => {
        const element = document.getElementById(id)!
        element.style.height = "5px";
        element.style.height = (element.scrollHeight) + "px";
    }

    return (
        <textarea
            tabIndex={tabIndex}
            id={id}
            onFocus={auto_grow}
            placeholder={placeHolder}
            {...register(name)}
            rows={1}
            onKeyDown={onKeyDownHandler}
            onInput={auto_grow}
            className={classNames(cn.textArea)}
            defaultValue={value}>
        </textarea>
    )
}

export default TextArea;