import classNames from "classnames";
import React, { FormEvent } from "react";
import cn from './TextArea.module.scss'

interface TextAreaProps {
    tabIndex: number,
    id: string,
    name: string,
    placeHolder: string,
    value: string,
    onSubnmitComment: Function,
    onChangeHandler: Function,
    editMode?: boolean
}

const TextArea = ({tabIndex, id, placeHolder, name, value, onSubnmitComment, onChangeHandler, editMode}: TextAreaProps) => {

    const changeHandler = (event: any) => {
        onChangeHandler(event.target.value)
    }

    const onKeyDownHandler = (event: any) => {
        const element = document.getElementById(id)! as HTMLTextAreaElement
        if (event.keyCode == 13 && !event.altKey) {
            event.preventDefault()
            onSubnmitComment(event)
            if (!editMode) {
                element.value=''
            }
        } else if (event.keyCode == 13 && event.altKey) {
            element.value += '\n'
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
            name={name}
            id={id}
            onFocus={auto_grow}
            placeholder={placeHolder}
            rows={1}
            onKeyDown={onKeyDownHandler}
            onInput={auto_grow}
            onChange={changeHandler}
            className={classNames(cn.textArea)}
            value={value}>
        </textarea>
    )
}

export default TextArea;