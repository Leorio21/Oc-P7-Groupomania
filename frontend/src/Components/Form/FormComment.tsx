
import { IFormValues } from '../../interface/Index';
import { Path, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

import TextArea from './TextArea/TextArea';

const schemaComment = yup.object({
    content: yup.string().required('Ce champ ne peut être vide'),
}).required();

interface FormCommentProps {
    classes: string,
    postId?: number,
    tabIndex: number,
    id: string,
    name: Path<IFormValues>
    placeHolder: string,
    value?: string,
    onSubmitComment: SubmitHandler<IFormValues>,
    editMode?: boolean
}

const FormComment = ({classes, tabIndex, id, name, placeHolder, value, onSubmitComment, editMode}: FormCommentProps) => {

    const { register, handleSubmit, formState: { errors } } = useForm<IFormValues>({resolver: yupResolver(schemaComment)});

    return (
        <form className = {classes} onSubmit={handleSubmit(onSubmitComment)}>
            <TextArea
                tabIndex={tabIndex}
                id={id}
                name={name}
                placeHolder={placeHolder}
                register={register}
                value={value}
                onSubmitComment={handleSubmit(onSubmitComment)}
            />
            <p>{errors.content?.message}</p>
        </form>
    )
}

export default FormComment;