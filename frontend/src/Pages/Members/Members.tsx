import classNames from "classnames";
import cn from "./Members.module.scss";
import React, { useEffect, useReducer } from "react";
import User from "../../Components/User/User";
import { UserProfil } from "../../interface/Index";
import { useAxios } from "../../Hooks/Axios";
import Loader from "../../Components/Loader/Loader";
import Modal from "../../Components/Modal/Modal";

const initilTextError = "";
const reducerModal = (state: string, action: { type: string; payload?: string; }) => {
    switch(action.type) {
    case "display":
        state = action.payload ?? "Texte non defini";
        return state;
    case "hide":
        state = "";
        return state;
    }
    return state;
};

const Members = () => {
    
    const [textError, dispatchModal] = useReducer(reducerModal, initilTextError);
    const { response, isLoading, error } = useAxios<{users: UserProfil[]}>({
        url : "/auth/members"
    });

    useEffect(()=>{
        if (error) {
            dispatchModal({type: "display", payload: error});
        }
    }, [error]);

    if (isLoading) {
        return (
            <div className={classNames(cn.loader)}>
                <Loader color={"#FFFFFF"} isLoading size={50} />
            </div>
        );
    }
    
    if (!response?.users.length) {
        return (
            <div>Aucune données</div>
        );
    }
    
    return (
        <>
            <div className={classNames(cn.members_container)}>
                {response.users.map((user) => {
                    return <User key={`user${user.id}`} user={user} />;
                })}
            </div>
            {textError && <Modal text={textError} onCloseModal={() => {dispatchModal({type: "hide"});}} />}
        </>
    );
};

export default Members;