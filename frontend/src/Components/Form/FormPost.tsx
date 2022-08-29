import { useReducer } from "react";
import { useForm } from "react-hook-form";
import { IFormValues } from "../../interface/Index";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

import Input from "./Input/Input";

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

const onPostSubmit = (data: IFormValues) => {

}

const FormPost = () => {

    const [textError, dispatchModal] = useReducer(reducerModal, initilTextError);
    const { register, handleSubmit, formState: { errors } } = useForm<IFormValues>({resolver: yupResolver(schemaPost)});

    return (
        <form className = {} onSubmit={handleSubmit(onPostSubmit)}>
            <Input
                tabIndex={0}
                type='text'
                id='content'
                name='content'
                placeHolder='Publiez quelque chose ...'
                register={register}
                required
            />
        </form>
    )
}

export default FormPost;