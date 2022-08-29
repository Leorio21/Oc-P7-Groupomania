import { Path, SubmitHandler, useForm } from "react-hook-form";
import { IFormValues } from "../../interface/Index";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

import TextArea from "./TextArea/TextArea";

const schemaPost = yup.object({
    content: yup.string().required('Ce champ ne peut être vide'),
}).required();

interface FormPostProps {
    classes: string,
    postId?: number,
    tabIndex: number,
    id: string,
    name: Path<IFormValues>
    placeHolder: string,
    value?: string,
    onPostSubmit: SubmitHandler<IFormValues>,
    editMode?: boolean,
    required?: boolean
}

const FormPost = ({classes, postId, tabIndex, id, name, placeHolder, onPostSubmit, editMode, required}: FormPostProps) => {

    const { register, handleSubmit, formState: { errors } } = useForm<IFormValues>({resolver: yupResolver(schemaPost)});

    return (
        <form className = {'t'} onSubmit={handleSubmit(onPostSubmit)}>
            <TextArea
                tabIndex={0}
                id={id}
                name={name}
                placeHolder={placeHolder}
                register={register}
                onSubmitComment={handleSubmit(onPostSubmit)}
                required
            />
        </form>
    )
}

export default FormPost;