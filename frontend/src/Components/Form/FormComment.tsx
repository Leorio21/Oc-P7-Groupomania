
import { IFormValues, OnePostComment } from '../../interface/Index';
import { Path, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

import TextArea from './TextArea/TextArea';
import { useContext, useReducer } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import axios from 'axios';
import Modal from '../Modal/Modal';

const schemaComment = yup.object({
    content: yup.string().required('Ce champ ne peut être vide'),
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
    tabIndex: number,
    id: string,
    name: Path<IFormValues>
    placeHolder: string,
    comment?: OnePostComment,
    onSubmitForm: Function,
    editMode?: boolean
}

const FormComment = ({classes, tabIndex, id, postId, name, placeHolder, comment, onSubmitForm}: FormCommentProps) => {
    
    const authContext = useContext(AuthContext)
    const [textError, dispatchModal] = useReducer(reducerModal, initilTextError);
    const { register, handleSubmit, formState: { errors } } = useForm<IFormValues>({resolver: yupResolver(schemaComment)});


    const onSubmitHandler = (data: IFormValues) => {
        if (comment) {
            modifyComment(data)
        } else {
            createNewComment(data)
        }
    }

    const modifyComment = async (data: IFormValues) => {
        try {
            const option = {
                headers: {
                    Authorization: `Bearer ${authContext!.token}`
                }
            }
            const modifyComment = await axios.put(`http://127.0.0.1:3000/api/post/${postId}/comment/${comment!.id}`, data, option)
            onSubmitForm(comment!.id, modifyComment.data.updatedBy, data.content)
        } catch (error: any) {
            if(error.response.data.message){
                dispatchModal({type: 'display', payload: `Une erreur est survenue :\n${error.response.data.message}`})
            } else if (error.response.data) {
                dispatchModal({type: 'display', payload: `Une erreur est survenue :\n${error.response.data}`})
            }
        }
    }

    const createNewComment = async (data: IFormValues) => {
        try {
            const option = {
                headers: {
                    Authorization: `Bearer ${authContext!.token}`
                }
            }
            const bddComment = await axios.post(`http://127.0.0.1:3000/api/post/${postId}/comment`, data, option)
            const newComment: OnePostComment = { ...bddComment.data.comment }
            onSubmitForm(newComment)
        } catch (error: any) {
            if(error.response.data.message){
                dispatchModal({type: 'display', payload: `Une erreur est survenue :\n${error.response.data.message}`})
            } else if (error.response.data) {
                dispatchModal({type: 'display', payload: `Une erreur est survenue :\n${error.response.data}`})
            }
        }
    }

    return (
        <>
            <form className = {classes} onSubmit={handleSubmit(onSubmitHandler)}>
                <TextArea
                    tabIndex={tabIndex}
                    id={id}
                    name={name}
                    placeHolder={placeHolder}
                    register={register}
                    value={comment?.content}
                    onSubmitComment={handleSubmit(onSubmitHandler)}
                />
                <p>{errors.content?.message}</p>
            </form>
            {textError != '' && <Modal text={textError} onCloseModal={() => {dispatchModal({type: 'hide'})}} />}
        </>
    )
}

export default FormComment;