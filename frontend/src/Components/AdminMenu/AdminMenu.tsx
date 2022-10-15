import { PencilIcon, TrashIcon } from "@heroicons/react/solid";

import classNames from "classnames";
import React, { KeyboardEvent, useReducer } from "react";
import Modal from "../Modal/Modal";
import cn from "./AdminMenu.module.scss";

const initilTextError = "";
const reducerModal = (state: string, action: { type: string; payload: string; }) => {
    switch(action.type) {
    case "display":
        state = action.payload;
        return state;
    case "hide":
        state = "";
        return state;
    }
    return state;
};

interface AdminMenuProps {
    onModifyClick: () => void,
    onDeleteClick: () => void
}

const AdminMenu = ({ onModifyClick, onDeleteClick}: AdminMenuProps) => {
    
    const [textError, dispatchModal] = useReducer(reducerModal, initilTextError);
    
    const onModifyKeyDownHandler = (event: KeyboardEvent) => {
        if (event.key === "Enter") {
            onModifyHandler();
        }
    };

    const onDeleteKeyDownHandler = (event: KeyboardEvent) => {
        if (event.key === "Enter") {
            onDeleteHandler();
        }
    };

    const onModifyHandler = () => {
        onModifyClick();
    };

    const onDeleteHandler = () => {
        onDeleteClick();
    };

    return (
        <>
            <PencilIcon tabIndex={0} onKeyDown={onModifyKeyDownHandler} onClick={onModifyHandler} className={classNames(cn["menu-icone"])} />
            <TrashIcon tabIndex={0} onKeyDown={onDeleteKeyDownHandler} onClick={onDeleteHandler} className={classNames(cn["menu-icone"])} />
            {textError !== "" && <Modal text={textError} onCloseModal={() => {dispatchModal({type: "hide", payload: ""});}} />}
        </>
    );
};

export default AdminMenu;