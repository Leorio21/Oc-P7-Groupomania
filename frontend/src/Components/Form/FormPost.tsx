import { useReducer } from "react";
import { useForm } from "react-hook-form";
import { IFormValues } from "../../interface/Index";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

import TextArea from "./TextArea/TextArea";

const schemaPost = yup.object({
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

const FormPost = () => {
    
    const onPostSubmit = (data: IFormValues) => {
    
    }

    const [textError, dispatchModal] = useReducer(reducerModal, initilTextError);
    const { register, handleSubmit, formState: { errors } } = useForm<IFormValues>({resolver: yupResolver(schemaPost)});

    return (
        <form className = {'t'} onSubmit={handleSubmit(onPostSubmit)}>
            <TextArea
                tabIndex={0}
                id='content'
                name='content'
                placeHolder='Publiez quelque chose ...'
                register={register}
                handleSubmit={handleSubmit}
            />
        </form>
    )
}

export default FormPost;