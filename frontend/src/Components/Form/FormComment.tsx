
import { useReducer } from 'react';
import { IFormValues } from '../../interface/Index';
import { Path, SubmitHandler, useForm, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

import Modal from '../Modal/Modal';
import TextArea from './TextArea/TextArea';

const schemaComment = yup.object({
    content: yup.string().required(),
}).required();

const initilTextError = ''
const reducerModal = (state: string, action: { type: string; payload?: string; }) => {
    switch(action.type) {
        case 'display':
            state = action.payload!
            return state
        case 'hide':
            state = ''
            return state
    }
    return state;
}

interface FormCommentProps {
    classes: string,
    postId?: number,
    commentContent?: string,
    tabIndex: number,
    id: string,
    name: Path<IFormValues>
    placeHolder: string,
    value?: string,
    onSubmitComment: SubmitHandler<IFormValues>,
    editMode?: boolean
}

const FormComment = ({classes, postId, tabIndex, id, name, placeHolder, value, onSubmitComment, editMode}: FormCommentProps) => {

    const [textError, dispatchModal] = useReducer(reducerModal, initilTextError);
    const { register, handleSubmit, formState: { errors } } = useForm<IFormValues>({resolver: yupResolver(schemaComment)});

    return (
        <>
            <form className = {classes} onSubmit={handleSubmit(onSubmitComment)}>
                <TextArea
                    tabIndex={tabIndex}
                    id={id}
                    name={name}
                    placeHolder={placeHolder}
                    register={register}
                    value={value}
                    onSubmitComment={handleSubmit(onSubmitComment)}
                    required
                />
                <p>{errors.content?.message}</p>
            </form>
            {textError != '' && <Modal text={textError} onCloseModal={() => {dispatchModal({type: 'hide'})}} />}
        </>
    )
}

export default FormComment;