import axios from "axios";
import { useContext, useEffect, useReducer, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";

import classNames from "classnames";
import cn from './PostsList.module.scss'

import Post from "./Post";
import { OnePost, OptionAxios } from '../../interface/Index';
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
    
    const option: OptionAxios = {
        headers: {
            Authorization: `Bearer ${authContext!.token}`
        }
    }
    const [posts, setPosts] = useState<OnePost[]>([])

    const fetchData = async (option: OptionAxios) => {
            try {
                const getPosts = await axios.get('http://127.0.0.1:3000/api/post', option)
                setPosts(getPosts.data)
            } catch (error: any) {
                console.log(error)
                if(error.response.data.message){
                    dispatchModal({type: 'display', payload: `Une erreur est survenue : ${error.response.data.message}`})
                } else if (error.response.data) {
                    dispatchModal({type: 'display', payload: `Une erreur est survenue : ${error.response.data}`})
                }
            }
        }
    
    useEffect(() => {
        fetchData(option)
    }, [])

    
if(posts == []) {
    return (<></>)
} else {
    return (
        <>
        <FormPost />
            <div className={classNames(cn.mainContainer)}>
                {posts!.map((post:OnePost) => {
                    return <Post post={post} key={post.id} />
                })}
            </div>
            {textError != '' && <Modal text={textError} onCloseModal={() => {dispatchModal({type: 'hide'})}} />}
        </>
    )
        }
}

export default PostsList;