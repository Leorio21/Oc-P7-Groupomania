import { PencilIcon, TrashIcon } from "@heroicons/react/solid";
import axios from "axios";

import classNames from "classnames";
import { useContext, useReducer } from "react";
import { AuthContext } from "../../Context/AuthContext";
import Modal from "../Modal/Modal";
import cn from './AdminMenu.module.scss'

const initilTextError = ''
const reducerModal = (state: string, action: { type: string; payload: string; }) => {
    switch(action.type) {
        case 'display':
            state = action.payload
            return state
        case 'hide':
            state = ''
            return state
    }
    return state;
}

interface AdminMenuProps {
    id: number,
    onModifyClick: Function,
    onDeleteClick: Function
}

const AdminMenu = ({ id, onModifyClick, onDeleteClick}: AdminMenuProps) => {

    const authContext = useContext(AuthContext)
    
    const [textError, dispatchModal] = useReducer(reducerModal, initilTextError);
    
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

    const onModifyHandler = () => {
        onModifyClick()
    }

    const onDeleteHandler = () => {
        onDeleteClick(id)
    }

    return (
        <>
            <PencilIcon tabIndex={0} onKeyDown={onModifyKeyDownHandler} onClick={onModifyHandler} className={classNames(cn['menu-icone'])} />
            <TrashIcon tabIndex={0} onKeyDown={onDeleteKeyDownHandler} onClick={onDeleteHandler} className={classNames(cn['menu-icone'])} />
            {textError != '' && <Modal text={textError} onCloseModal={() => {dispatchModal({type: 'hide', payload: ''})}} />}
        </>
    )
}

export default AdminMenu;