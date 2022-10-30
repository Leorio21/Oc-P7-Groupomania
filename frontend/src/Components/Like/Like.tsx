import { ThumbUpIcon } from "@heroicons/react/outline";
import { ThumbUpIcon as ThumbUpIconSolid } from "@heroicons/react/solid";
import React, { useContext, useEffect, useReducer, useState } from "react";

import classNames from "classnames";
import cn from "./Like.module.scss";
import { OnePostLike } from "../../interface/Index";
import { AuthContext } from "../../Context/AuthContext";
import { useAxios } from "../../Hooks/Axios";
import Loader from "../Loader/Loader";
import Modal from "../Modal/Modal";

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

interface LikeProps {
    likeData: OnePostLike[],
    userLikePost: boolean,
    postId: number,
    onClickLike: (userLikePost: boolean, idLike?: number) => void
}

const Like = ({likeData, userLikePost, postId, onClickLike}: LikeProps) => {

    const authContext = useContext(AuthContext);
    const [postLike, setPostLike] = useState(likeData);
    const [textError, dispatchModal] = useReducer(reducerModal, initilTextError);
    const { response, isLoading, error, axiosFunction } = useAxios<{like: OnePostLike}>({
        url: `/post/${postId}/like`,
        method: "POST"
    });
    
    const onKeyDownHandler = (event: React.KeyboardEvent<SVGSVGElement>) => {
        if (event.key === "Enter") {
            onClickLikeHandler();
        }
    };

    const onClickLikeHandler = () => {
        axiosFunction();
        
    };

    useEffect(() => {
        if (response) {
            if (userLikePost) {
                const newLikeArray = postLike.filter((like) => like.userId !== authContext?.userId);
                setPostLike(newLikeArray);
                onClickLike(!userLikePost);
            } else {
                const newLike: OnePostLike = { ...response.like };
                const newLikeArray = [...postLike];
                newLikeArray.push(newLike);
                setPostLike(newLikeArray);
                onClickLike(!userLikePost, response.like.id);
            }
        }
        if (error) {
            dispatchModal({type: "display", payload: error});
        }
    }, [response, error]);

    if (isLoading) {
        return (
            <Loader color="#ffffff" isLoading={isLoading} size={25} />
        );
    }
    
    return (
        <>
            <div className={classNames(cn.like_container)}>
                <span className={classNames(cn.nbLike)}>{postLike.length}</span>
                {postLike.length > 0 && <div className={classNames(cn.liker_list)}>{
                    likeData.map((like) => {
                        return (
                            <div key={like.id}>{like.user.firstName} {like.user.lastName}</div>
                        );
                    })
                }</div>}
                {userLikePost ? <ThumbUpIconSolid onClick={onClickLikeHandler} onKeyDown={onKeyDownHandler} className={classNames(cn.icon)} tabIndex={0} /> :  <ThumbUpIcon onClick={onClickLikeHandler} onKeyDown={onKeyDownHandler} className={classNames(cn.icon)}  tabIndex={0} />}
            </div>
            {textError && <Modal text={textError} onCloseModal={() => {dispatchModal({type: "hide"});}} />}
        </>
    );
};

export default Like;
