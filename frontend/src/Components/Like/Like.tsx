import { ThumbUpIcon } from "@heroicons/react/outline";
import { ThumbUpIcon as ThumbUpIconSolid } from "@heroicons/react/solid";
import React, { useCallback, useContext, useEffect, useReducer, useState } from "react";

import classNames from "classnames";
import cn from "./Like.module.scss";
import Modal from "../Modal/Modal";
import axios from "axios";
import { OnePostLike } from "../../interface/Index";
import { AuthContext } from "../../Context/AuthContext";
import { useAxios } from "../../Hooks/Axios";

interface LikeProps {
    likeData: OnePostLike[],
    userLikePost: boolean,
    postId: number,
    onClickLike: () => void
}

const Like = ({likeData, userLikePost, postId, onClickLike}: LikeProps) => {

    const authContext = useContext(AuthContext);
    const [postLike, setPostLike] = useState(likeData);
    const { response, isLoading, axiosFunction } = useAxios<{like: OnePostLike}>({
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
            } else {
                const newLike: OnePostLike = { ...response.like };
                const newLikeArray = [...postLike];
                newLikeArray.push(newLike);
                setPostLike(newLikeArray);
            }
            onClickLike();
        }
    }, [response]);

    if (isLoading) {
        return (
            <div>Loading Data...</div>
        );
    }

    return (
        <div>
            <span className={classNames(cn.nbLike)}>{postLike.length}</span>{userLikePost ? <ThumbUpIconSolid onClick={onClickLikeHandler} onKeyDown={onKeyDownHandler} className={classNames(cn.icon)} tabIndex={0} /> :  <ThumbUpIcon onClick={onClickLikeHandler} onKeyDown={onKeyDownHandler} className={classNames(cn.icon)}  tabIndex={0} />}
        </div>
    );
};

export default Like;
