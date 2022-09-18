import axios, { AxiosError } from "axios"
import React, { useContext, useEffect, useReducer, useState } from "react"
import { AuthContext } from "../../Context/AuthContext"

import classNames from "classnames"
import cn from "./PostsList.module.scss"

import Post from "./Post"
import { OnePost, OptionAxios } from "../../interface/Index"
import Modal from "../Modal/Modal"
import FormPost from "../Form/FormPost"

const initilTextError = ""
const reducerModal = (state: string, action: { type: string; payload?: string; }) => {
    switch(action.type) {
    case "display":
        state = action.payload ?? "Texte non defini"
        return state
    case "hide":
        state = ""
        return state
    }
    return state
}

interface PostListProps {
    postUser?: OnePost[]
}

const PostsList = ({postUser}:  PostListProps) => {

    const authContext = useContext(AuthContext)
    const [textError, dispatchModal] = useReducer(reducerModal, initilTextError)
    const [posts, setPosts] = useState<OnePost[]>([])
    
    const option: OptionAxios = {
        headers: {
            Authorization: `Bearer ${authContext?.token}`
        }
    }

    const fetchData = async (option: OptionAxios) => {
        try {
            const getPosts = await axios.get("http://127.0.0.1:3000/api/post", option)
            setPosts(getPosts.data)
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                if(error.response?.data.message){
                    dispatchModal({type: "display", payload: `Une erreur est survenue :\n${error.response.data.message}`})
                } else if (error.response?.data) {
                    dispatchModal({type: "display", payload: `Une erreur est survenue :\n${error.response.data}`})
                }
            }
        }
    }
    
    const onPostSubmit = (newPost: OnePost): void => {
        setPosts((prevState) => {
            const newPostsArray = [...prevState]
            newPostsArray.unshift(newPost)
            return newPostsArray
        })
    }

    const onPostDelete = (postToDelete: number): void => {
        setPosts((prevState) => {
            const newPostArray = prevState.filter((post) => post.id != postToDelete)
            return newPostArray
        })
    }
    
    useEffect(() => {
        if (postUser) {
            setPosts(postUser)
        } else {
            fetchData(option)
        }
    }, [postUser])


    return (
        <>
            <div className={classNames(cn.mainContainer)}>
                {!postUser && <FormPost
                    classes={classNames(cn.form_container)}
                    classesIcon={classNames(cn.iconPicture)}
                    buttonLabel='Publier'
                    tabIndex={0}
                    id='content'
                    name='content'
                    placeHolder='Publiez quelque chose ...'
                    onPostSubmit={onPostSubmit}
                />}
                {posts && posts?.map((post:OnePost) => {
                    return (
                        <Post
                            post={post}
                            onDeletePost={onPostDelete}
                            key={post.id}
                        />
                    )
                })}
            </div>
            {textError !== "" && <Modal text={textError} onCloseModal={() => {dispatchModal({type: "hide"})}} />}
        </>
    )
}

export default PostsList