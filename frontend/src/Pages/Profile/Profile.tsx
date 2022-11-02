import React, { useContext, useEffect, useReducer } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import { PencilIcon, UserCircleIcon } from "@heroicons/react/solid";

import { LocationProps, OneUser } from "../../interface/Index";

import classNames from "classnames";
import cn from "./Profile.module.scss";

import PostsList from "../../Components/Post/PostsList";
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

const Profile = () => {

    const location = useLocation();
    const { userId } = location.state as LocationProps;
    const authContext = useContext(AuthContext);
    const [textError, dispatchModal] = useReducer(reducerModal, initilTextError);
    const { response, isLoading, error } = useAxios<{user :OneUser}>({
        url: `auth/user/${userId}`
    });
    
    useEffect(() => {
        if (error) {
            dispatchModal({type: "display", payload: error});
        }
    }, [error]);

    if (isLoading) {
        return (
            <Loader color={"#FFFFFF"} isLoading size={50} />
        );
    }

    if (response) {
        return (
            <>
                <div className={classNames(cn.picture_container)}>
                    {response.user.background && <img src={response.user.background} alt='image de fond utilisateur' className={classNames(cn.backgroundPicture)} />}
                    {response.user.avatar ? <img src={response.user.avatar} alt="avatar de l'utilisteur utilisateur" className={classNames(cn.avatarPicture)} /> : <UserCircleIcon className={classNames(cn.avatarPicture)} />}
                </div>
                <div className={classNames(cn.name)}>{response.user.firstName} {response.user.lastName}{authContext?.role === "ADMIN" && <Link to={"/myprofile"} state={{ userId: userId }}className={classNames(cn.link)}><PencilIcon tabIndex={0} className={classNames(cn["menu-icone"])} /></Link>}</div>
                {!response.user.post.length ? <div className={classNames(cn.noPost)}>Aucune publications</div> : <PostsList postUser={response.user.post}/>}
            </>
        );
    }

    return (
        <>
            <div>Aucune Données</div>
            {textError && <Modal text={textError} onCloseModal={() => {dispatchModal({type: "hide"});}} />}
        </>
    );
};

export default Profile;