import dayjs from "dayjs"
import "dayjs/locale/fr"
import relativeTime from "dayjs/plugin/relativeTime"
import { AuthContext } from "../../Context/AuthContext"
import React, { useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react"
import { UserCircleIcon } from "@heroicons/react/solid"
import { OnePost } from "../../interface/Index"
import axios, { AxiosError } from "axios"

import classNames from "classnames"
import cn from "./Post.module.scss"

import Like from "../Like/Like"
import CommentList from "../Comment/CommentList"
import AdminMenu from "../AdminMenu/AdminMenu"
import Modal from "../Modal/Modal"
import FormPost from "../Form/FormPost"
import { Link } from "react-router-dom"

const initilTextError = ""
const reducerModal = (state: string, action: { type: string; payload?: string; }): string => {
    switch (action.type) {
    case "display":
        state = action.payload ?? "Texte non défini"
        return state
    case "hide":
        state = ""
        return state
    }
    return state
}
interface PostProps {
    post: OnePost,
    onDeletePost: (postToDelete: number) => void
}

dayjs.locale("fr")
dayjs().format()
dayjs.extend(relativeTime)

const Post = ({ post, onDeletePost }: PostProps): JSX.Element => {

    const authContext = useContext(AuthContext)

    const [postData, setPostData] = useState(post)
    const [userLikePost, setUserLikePost] = useState(post.like.find((like) => like.userId == authContext?.userId) ? true : false)
    const [countComm, setCountComm] = useState(post.comment.length)
    const [editMode, setEditMode] = useState(false)
    const [postedAt, setPostedAt] = useState(dayjs(postData.createdAt).fromNow(true))
    const [textError, dispatchModal] = useReducer(reducerModal, initilTextError)

    const changeCountComm = (newCounterComm: number): void => {
        setCountComm(newCounterComm)
    }

    const changeLikePost = (): void => {
        setUserLikePost(!userLikePost)
    }

    const onModifyHandler = (): void => {
        setEditMode(!editMode)
    }

    /**
     * OnPostSubmitHandler takes a OnePost object and returns nothing. It sets the state of postData to
     * a new object that has the same properties as the OnePost object passed in, and then toggles the
     * editMode state.
     * @param {OnePost} modifyPost - OnePost = {
     */
    const onPostSubmitHandler = //useCallback(() => {
        (modifyPost: OnePost): void => {
            setPostData((prevState) => {
                const newPost = prevState
                newPost.content = modifyPost.content
                newPost.image = modifyPost.image
                newPost.updatedBy = modifyPost.updatedBy
                return newPost
            })
            setEditMode(!editMode)
        }
    //}, [])

    /**
     * OnDeleteHandler is a function that deletes a post from the database and the frontend.
     */
    const onDeleteHandler = useCallback( async (): Promise<void> => {
        console.log("delete post : " + postData.id)
        const option = {
            headers: {
                Authorization: `Bearer ${authContext?.token}`
            }
        }
        try {
            await axios.delete(`http://127.0.0.1:3000/api/post/${postData.id}`, option)
            onDeletePost(postData.id)
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                if(error.response?.data.message){
                    dispatchModal({type: "display", payload: `Une erreur est survenue :\n${error.response.data.message}`})
                } else if (error.response?.data) {
                    dispatchModal({type: "display", payload: `Une erreur est survenue :\n${error.response.data}`})
                }
            }
        }
    }, [])

    /* A memoized function that returns a string based on the value of the updatedBy property of the
    post object. */
    const modifyAuthor: string = useMemo(() => {
        switch (post.updatedBy) {
        case "ADMIN":
            return "(modifié par Admin)"
        case "MODERATOR":
            return "(modifié par Modérateur)"
        }
        return "(modifié)"
    }, [post.updatedBy])

    useEffect(() => {
        if (editMode) {
            const element = document.getElementById(`content${postData.id}`)!
            element.style.height = "5px"
            element.style.height = (element.scrollHeight) + "px"
        }
    }, [editMode])

    /* Updating the postedAt state every 60 seconds. */
    useEffect(() => {
        const intervalId = window.setInterval(() => {
            setPostedAt(dayjs(postData.createdAt).fromNow(true))
        }, 60000)

        return () => {
            window.clearInterval(intervalId)
        }
    }, [])

    return (
        <>
            <article className={classNames(cn.post)} tabIndex={0}>
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
            {textError !== "" && <Modal text={textError} onCloseModal={() => { dispatchModal({ type: "hide" }) }} />}
        </>
    )
}

export default Post