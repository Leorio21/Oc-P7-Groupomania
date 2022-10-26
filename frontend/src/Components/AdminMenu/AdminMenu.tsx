import { PencilIcon, TrashIcon } from "@heroicons/react/solid";

import classNames from "classnames";
import React, { KeyboardEvent } from "react";
import cn from "./AdminMenu.module.scss";

interface AdminMenuProps {
    onModifyClick: () => void,
    onDeleteClick: () => void
}

const AdminMenu = ({ onModifyClick, onDeleteClick}: AdminMenuProps) => {
    
    
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
        </>
    );
};

export default AdminMenu;