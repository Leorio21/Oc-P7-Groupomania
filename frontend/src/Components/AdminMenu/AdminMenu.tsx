import { PencilIcon, TrashIcon } from "@heroicons/react/solid";
import axios from "axios";

import classNames from "classnames";
import { KeyboardEventHandler, useState } from "react";
import { UserDataLs } from "../../interface/UserDataLs";
import Modal from "../Modal/Modal";
import cn from './AdminMenu.module.scss'

interface AdminMenuProps {
    commentId?: number,
    postId: number,
    onDeleteComment: Function
}

const AdminMenu = ({commentId, postId, onDeleteComment}: AdminMenuProps) => {

    const [modalToggle, setModalToggle] = useState(false);
    const [errorText, setErrorText] = useState('');

    const changeVisibilityModal = () => {
        setModalToggle(!modalToggle);
    }
    
    const onModifyKeyDownHandler = (event: any) => {
        if (event.keyCode == 13) {
            onModifyHandler()
        }
    }

    const onDeleteKeyDownHandler = (event: any) => {
        if (event.keyCode == 13) {
            onDeleteHandler()
        }
    }

    const onModifyHandler = async () => {
        const userData: UserDataLs = JSON.parse(localStorage.getItem('userData')!)
        const option = {
            headers: {
                Authorization: `Bearer ${userData.token}`
            }
        }
    }

    const onDeleteHandler = async () => {
        const userData: UserDataLs = JSON.parse(localStorage.getItem('userData')!)
        const option = {
            headers: {
                Authorization: `Bearer ${userData.token}`
            }
        }
        if (commentId) {
            try {
                await axios.delete(`http://127.0.0.1:3000/api/post/${postId}/comment/${commentId}`, option)
                onDeleteComment(commentId)
            } catch (error) {
                setErrorText(`Une erreur est survenue :\n${error}`)
                changeVisibilityModal()
            }
        } else if (postId) {
            console.log('delete post')
        }
    }

    return (
        <>
            <PencilIcon tabIndex={0} onKeyDown={onModifyKeyDownHandler} onClick={onModifyHandler} className={classNames(cn['menu-icone'])} />
            <TrashIcon tabIndex={0} onKeyDown={onDeleteKeyDownHandler} onClick={onDeleteHandler} className={classNames(cn['menu-icone'])} />
            {modalToggle && <Modal text={errorText} onCloseModal={changeVisibilityModal} />}
        </>
    )
}

export default AdminMenu;