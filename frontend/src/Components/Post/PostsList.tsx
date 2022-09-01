import axios from "axios";
import { useContext, useEffect, useReducer, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";

import classNames from "classnames";
import cn from './PostsList.module.scss'

import Post from "./Post";
import { IFormValues, OnePost, OptionAxios } from '../../interface/Index';
import Modal from "../Modal/Modal";
import FormPost from "../Form/FormPost";

const initilTextError = ''
const reducerModal = (state: string, action: { type: string; payload?: string; }) => {
    switch(action.type) {
        case 'display':
            state = action.payload!
            return state
        case 'hide':
            state = ''
            return state
    }
    return state;
}

const PostsList = () => {

    const authContext = useContext(AuthContext)
    const [textError, dispatchModal] = useReducer(reducerModal, initilTextError);
    const [posts, setPosts] = useState<OnePost[]>([])
    
    const option: OptionAxios = {
        headers: {
            Authorization: `Bearer ${authContext!.token}`
        }
    }

    const fetchData = async (option: OptionAxios) => {
        try {
            const getPosts = await axios.get('http://127.0.0.1:3000/api/post', option)
            setPosts(getPosts.data)
        } catch (error: any) {
            if(error.response.data.message){
                dispatchModal({type: 'display', payload: `Une erreur est survenue : ${error.response.data.message}`})
            } else if (error.response.data) {
                dispatchModal({type: 'display', payload: `Une erreur est survenue : ${error.response.data}`})
            }
        }
    }
    
    const onPostSubmit = (newPost: OnePost) => {
            setPosts((prevState) => {
                const newPostsArray = [...prevState]
                newPostsArray.unshift(newPost)
                return newPostsArray
            })
        
    }
    
    useEffect(() => {
        fetchData(option)
    }, [])

    
if(posts == []) {
    return (<></>)
} else {
    return (
        <>
            <div className={classNames(cn.mainContainer)}>
                <FormPost
                    classes={classNames(cn.form_container)}
                    classesIcon={classNames(cn.iconPicture)}
                    tabIndex={0}
                    id='content'
                    name='content'
                    placeHolder='Publiez quelque chose ...'
                    onPostSubmit={onPostSubmit}
                    required
                />
                {posts!.map((post:OnePost) => {
                    return (
                        <Post
                            post={post}
                            key={post.id}
                        />
                    )
                })}
            </div>
            {textError != '' && <Modal text={textError} onCloseModal={() => {dispatchModal({type: 'hide'})}} />}
        </>
    )
        }
}

export default PostsList;