import { PhotographIcon } from "@heroicons/react/outline";
import { Path, useForm } from "react-hook-form";
import { IFormValues, OnePost } from "../../interface/Index";
import { AuthContext } from "../../Context/AuthContext";
import axios from "axios";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useContext, useEffect, useReducer, useState } from "react";


import PicturePreview from "./PicturePreview/PicturePreview";
import TextArea from "./TextArea/TextArea";
import FileInput from "./FileInput/FileInput";
import Modal from "../Modal/Modal";
import Button from "./Button/Button";
import HorizontalContainer from "./HorizontalContainer/HorizontalContainer";

const schemaPost = yup.object({
    content: yup.string().nullable(),
    photo: yup.mixed().nullable()
}).required;

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

interface FormPostProps {
    classes: string,
    classesIcon: string,
    postId?: number,
    tabIndex: number,
    id: string,
    name: Path<IFormValues>
    placeHolder: string,
    value?: string,
    onPostSubmit: Function,
    editMode?: boolean,
    required?: boolean
}

const FormPost = ({classes, postId, classesIcon, tabIndex, id, name, placeHolder, onPostSubmit, editMode, required}: FormPostProps) => {

    const authContext = useContext(AuthContext)
    const [textError, dispatchModal] = useReducer(reducerModal, initilTextError);
    const { register, handleSubmit, getValues, resetField, watch, formState: { isSubmitSuccessful, errors } } = useForm<IFormValues>({defaultValues: { content: '', photo: undefined }})//{resolver: yupResolver(schemaPost)});
    const [ pictureUrl, setPictureUrl ] = useState('')

    const onSubmitHandler = async (data: IFormValues) => {
        const myFormData = new FormData();
        myFormData.append('content', data.content)
        if (data.photo) {
            myFormData.append('photo', data.photo[0])
        }
        try {
            const option = {
                headers: {
                    'Content-Type':'multipart/form-data',
                    Authorization: `Bearer ${authContext!.token}`
                }
            }
            const bddPost = await axios.post(`http://127.0.0.1:3000/api/post/`, myFormData, option)
            const newPost: OnePost = {
                ...bddPost.data.post,
                like: [],
                comment: [],
                author: {
                    firstName: authContext!.firstName,
                    lastName: authContext!.lastName,
                    avatar: authContext!.avatar
                }
            }
            onPostSubmit(newPost)
            setPictureUrl('')
            resetField('photo')
            resetField('content')
        } catch (error: any) {
            if(error.response.data.message){
                dispatchModal({type: 'display', payload: `Une erreur est survenue :\n${error.response.data.message}`})
            } else if (error.response.data) {
                dispatchModal({type: 'display', payload: `Une erreur est survenue :\n${error.response.data}`})
            }
        }
    }

    const resetPicture = () => {
        setPictureUrl('')
        resetField('photo')
    }

    useEffect(() => {
        if(getValues('photo')) {
            if (getValues('photo').length > 0) {
                setPictureUrl(window.URL.createObjectURL([...getValues('photo')][0]))
            }
        }
    }, [watch('photo')])

    return (
        <>
            <form className = {classes} onSubmit={handleSubmit(onSubmitHandler)}>
                {pictureUrl != '' && <PicturePreview pictureUrl={pictureUrl} resetPicture={resetPicture} /> }
                <TextArea
                    tabIndex={tabIndex}
                    id={id}
                    name={name}
                    placeHolder={placeHolder}
                    register={register}
                    onSubmitComment={handleSubmit(onSubmitHandler)}
                    postForm
                />
                <HorizontalContainer>
                    <Button tabIndex={0} type={'submit'} label={'Publier'} />
                    <FileInput id='picture' name='photo' accept={'image/jpeg, image/png, image/gif, image/webp'} multiple={false} register={register}>
                        <PhotographIcon className={classesIcon} />Photo
                    </FileInput>
                </HorizontalContainer>
            </form>
            {textError != '' && <Modal text={textError} onCloseModal={() => {dispatchModal({type: 'hide'})}} />}
        </>
    )
}

export default FormPost;