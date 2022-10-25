import React, { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import { PencilIcon, UserCircleIcon } from "@heroicons/react/solid";

import { OneUser } from "../../interface/Index";

import classNames from "classnames";
import cn from "./Profile.module.scss";

import PostsList from "../../Components/Post/PostsList";
import { useAxios } from "../../Hooks/Axios";

const Profile = () => {

    const params = useParams();
    const authContext = useContext(AuthContext);
    const { response, isLoading } = useAxios<{user :OneUser}>({
        url: `auth/user/${params.userId}`
    });

    if (isLoading) {
        return (
            <div>Loading Data...</div>
        );
    }

    if (response) {
        return (
            <>
                <div className={classNames(cn.picture_container)}>
                    {response.user.background && <img src={response.user.background} alt='image de fond utilisateur' className={classNames(cn.backgroundPicture)} />}
                    {response.user.avatar ? <img src={response.user.avatar} alt="avatar de l'utilisteur utilisateur" className={classNames(cn.avatarPicture)} /> : <UserCircleIcon className={classNames(cn.avatarPicture)} />}
                </div>
                <div className={classNames(cn.name)}>{response.user.firstName} {response.user.lastName}{authContext?.role === "ADMIN" && <Link to={`/myprofile/${params.userId}`} className={classNames(cn.link)}><PencilIcon tabIndex={0} className={classNames(cn["menu-icone"])} /></Link>}</div>
                {!response.user.post.length ? <div className={classNames(cn.noPost)}>Aucune publications</div> : <PostsList postUser={response.user.post}/>}
            </>
        );
    }

    return (
        <div>Aucune Données</div>
    );
};

export default Profile;