/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

import dayjs from "dayjs";
import "dayjs/locale/fr";
import relativeTime from "dayjs/plugin/relativeTime";
import { AuthContext } from "../../Context/AuthContext";
import React, { useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { UserCircleIcon } from "@heroicons/react/solid";
import { OnePost } from "../../interface/Index";

import classNames from "classnames";
import cn from "./Post.module.scss";

import Like from "../Like/Like";
import CommentList from "../Comment/CommentList";
import AdminMenu from "../AdminMenu/AdminMenu";
import FormPost from "../Form/FormPost";
import { Link } from "react-router-dom";
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

interface PostProps {
    post: OnePost,
    onDeletePost: (postToDelete: number) => void
}

dayjs.locale("fr");
dayjs().format();
dayjs.extend(relativeTime);

const Post = ({ post, onDeletePost }: PostProps): JSX.Element => {

    const authContext = useContext(AuthContext);

    const [postData, setPostData] = useState(post);
    const [userLikePost, setUserLikePost] = useState(post.like.find((like) => like.userId == authContext?.userId) ? true : false);
    const [textError, dispatchModal] = useReducer(reducerModal, initilTextError);
    const [countComm, setCountComm] = useState(post.comment.length);
    const [editMode, setEditMode] = useState(false);
    const [postedAt, setPostedAt] = useState(dayjs(postData.createdAt).fromNow(true));
    const { response, isLoading, error, axiosFunction } = useAxios({
        url: `post/${postData.id}`,
        method: "DELETE"
    });

    const changeCountComm = (newCounterComm: number): void => {
        setCountComm(newCounterComm);
    };

    const changeLikePost = (like: boolean, id?: number): void => {
        setUserLikePost(!userLikePost);
        if(like) {
            setPostData((prevState) => {
                const newPostState = prevState;
                newPostState.like.push({
                    id: id!,
                    postId: postData.id,
                    user: {
                        firstName: authContext?.firstName!,
                        lastName: authContext?.lastName!
                    },
                    userId: authContext?.userId!
                });
                return newPostState;
            });
        } else {
            setPostData((prevState) => {
                prevState.like = prevState.like.filter(userLike => userLike.userId !== authContext?.userId);
                const newPostData = prevState;
                return newPostData;
            });
        }
    };

    const onModifyHandler = (): void => {
        setEditMode(!editMode);
    };

    /**
     * OnPostSubmitHandler takes a OnePost object and returns nothing. It sets the state of postData to
     * a new object that has the same properties as the OnePost object passed in, and then toggles the
     * editMode state.
     * @param {OnePost} modifyPost - OnePost = {
     */
    const onPostSubmitHandler = useCallback(
        (modifyPost: OnePost): void => {
            setPostData((prevState) => {
                const newPost = prevState;
                newPost.content = modifyPost.content;
                newPost.image = modifyPost.image;
                newPost.updatedBy = modifyPost.updatedBy;
                return newPost;
            });
            setEditMode(!editMode);
        }, [editMode]
    );

    /**
     * OnDeleteHandler is a function that deletes a post from the database and the frontend.
     */
    const onDeleteHandler = useCallback(
        async (): Promise<void> => {
            const confirmDelete = confirm("Êtes-vous sur de vouloir supprimer ce post ?");
            if (confirmDelete) {
                axiosFunction();
            }
        }, [postData.id]
    );

    /* A memoized function that returns a string based on the value of the updatedBy property of the
    post object. */
    const modifyAuthor: string = useMemo(() => {
        switch (post.updatedBy) {
        case "ADMIN":
            return "(modifié par Admin)";
        case "MODERATOR":
            return "(modifié par Modérateur)";
        }
        return "(modifié)";
    }, [post.updatedBy]);

    /* Updating the postedAt state every 60 seconds. */
    useEffect(() => {
        const intervalId = window.setInterval(() => {
            setPostedAt(dayjs(postData.createdAt).fromNow(true));
        }, 60000);

        return () => {
            window.clearInterval(intervalId);
        };
    }, []);

    useEffect(() => {
        if (response) {
            onDeletePost(postData.id);
        }
    }, [response]);

    useEffect(() => {
        if (error) {
            dispatchModal({type: "display", payload: error});
        }
    }, [error]);

    return (
        <>
            <article className={classNames(cn.post)} tabIndex={0}>
                {isLoading && <div className={classNames(cn.loader)}><Loader color={"#FFFFFF"} isLoading size={50} /></div>}
                <div className={classNames(cn.header)}>
                    <div className={classNames(cn.header_title)}>
                        <div className={classNames(cn.avatar)}>{postData.author.avatar ? <img src={`${postData.author.avatar}`} alt={"Image de l'utilisateur"} /> : <UserCircleIcon className={classNames(cn.icone)} />}</div>
                        <div className={classNames(cn.author_container)}>
                            <Link to={`/profile/${postData.authorId}`} className={classNames(cn.nav__link)}><span className={classNames(cn.author)}>{postData.author.firstName + " " + postData.author.lastName}</span></Link>
                            <span>Il y a {postedAt}</span>
                        </div>
                    </div>
                    <div className={classNames(cn.menu)}>
                        {(authContext?.userId == postData.authorId || authContext?.role == "ADMIN" || authContext?.role == "MODERATOR") && <AdminMenu onModifyClick={onModifyHandler} onDeleteClick={onDeleteHandler} />}
                    </div>
                </div>
                {editMode ?
                    <FormPost
                        classes={classNames(cn.form_container)}
                        classesIcon={classNames(cn.iconPicture)}
                        buttonLabel='Enregistrer'
                        tabIndex={0}
                        id={`content${postData.id}`}
                        name='content'
                        placeHolder='Publiez quelque chose ...'
                        onPostSubmit={onPostSubmitHandler}
                        post={postData}
                        editMode={editMode}
                    />
                    :
                    <div className={classNames(cn.content)}>
                        {postData.image && <img src={postData.image} alt={"image d'illustration"} />}
                        {postData.content &&
                        <div className={classNames(cn.text)}>
                            {postData.content}
                        </div>
                        }
                        {postData.updatedBy && <div className={classNames(cn.modifyBy)}>{modifyAuthor}</div>}
                    </div>
                }
                <div className={classNames(cn.footer)}>
                    <div className={classNames(cn.likeComment)}>
                        <Like likeData={post.like} postId={post.id} userLikePost={userLikePost} onClickLike={changeLikePost} />
                        <div className={classNames(cn.nbComm)}>{countComm} Commentaire{countComm > 1 && "s"}</div>
                    </div>
                    <CommentList arrayComment={post.comment} postId={post.id} changeCountComm={changeCountComm} />
                </div>
            </article>
            {textError && <Modal text={textError} onCloseModal={() => {dispatchModal({type: "hide"});}} />}
        </>
    );
};

export default Post;