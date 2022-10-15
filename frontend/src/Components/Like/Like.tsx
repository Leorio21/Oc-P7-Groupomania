import { ThumbUpIcon } from "@heroicons/react/outline";
import { ThumbUpIcon as ThumbUpIconSolid } from "@heroicons/react/solid";
import React, { useCallback, useContext, useReducer, useState } from "react";

import classNames from "classnames";
import cn from "./Like.module.scss";
import Modal from "../Modal/Modal";
import axios from "axios";
import { OnePostLike } from "../../interface/Index";
import { AuthContext } from "../../Context/AuthContext";

const initilTextError = "";
const reducerModal = (state: string, action: { type: string; payload?: string; }) => {
    switch(action.type) {
    case "display":
        state = action.payload ?? "Texte non défini";
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
    onClickLike: () => void
}

const Like = ({likeData, userLikePost, postId, onClickLike}: LikeProps) => {

    const authContext = useContext(AuthContext);

    const [postLike, setPostLike] = useState(likeData);
    const [textError, dispatchModal] = useReducer(reducerModal, initilTextError);
    
    const onKeyDownHandler = (event: React.KeyboardEvent<SVGSVGElement>) => {
        if (event.key === "Enter") {
            onClickLikeHandler();
        }
    };

    const onClickLikeHandler = useCallback(
        async () => {
            try {
                const option = {
                    headers: {
                        Authorization: `Bearer ${authContext?.token}`
                    }
                };
                const bddLike = await axios.post(`${authContext?.apiUrl}/api/post/${postId}/like`, {}, option);
                if (userLikePost) {
                    const newLikeArray = postLike.filter((like) => like.userId !== authContext?.userId);
                    setPostLike(newLikeArray);
                } else {
                    const newLike: OnePostLike = { ...bddLike.data.like };
                    const newLikeArray = [...postLike];
                    newLikeArray.push(newLike);
                    setPostLike(newLikeArray);
                }
                onClickLike();
            } catch (error) {
                dispatchModal({type: "display", payload: `Une erreur est survenue :\n${error}`});
            }
        }, [postId, userLikePost]
    );

    return (
        <>
            <div>
                <span className={classNames(cn.nbLike)}>{postLike.length}</span>{userLikePost ? <ThumbUpIconSolid onClick={onClickLikeHandler} onKeyDown={onKeyDownHandler} className={classNames(cn.icon)} tabIndex={0} /> :  <ThumbUpIcon onClick={onClickLikeHandler} onKeyDown={onKeyDownHandler} className={classNames(cn.icon)}  tabIndex={0} />}
            </div>
            {textError !== "" && <Modal text={textError} onCloseModal={() => {dispatchModal({type: "hide"});}} />}
        </>
    );
};

export default Like;
