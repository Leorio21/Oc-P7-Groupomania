import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";

import classNames from "classnames";
import cn from './Home.module.scss'

import Post from "../../Components/Post/Post";
import { addPosts } from "../../store/index";
import { OnePost } from '../../interface/Post';

interface PostArray {
    posts: OnePost[]
}


const Posts = () => {

    const dispatch = useDispatch();
    const posts = useSelector((state:PostArray) => state.posts)

    if(!localStorage.getItem('userData')) {
        return <Navigate to='/'/>
    }

    const userData:{userId:number, token:string, role:string} = JSON.parse(localStorage.getItem('userData')!)
    const option = { headers: {Authorization: `Bearer ${userData.token}`}}

    const fetchData = async () => {
        try {
            const getPosts = await axios.get('http://127.0.0.1:3000/api/post', option)
            return getPosts
        } catch (error) {
            console.log('error')
        }
    }

    useEffect(() => {
        fetchData()
        .then((res) => {
            res!.data.map((post:OnePost) => {
                dispatch(addPosts(post))
            })
        })
    }, [])

    

    return (
        <div className={classNames(cn.mainContainer)}>
            {posts.map((post:OnePost) => {
                return <Post post={post} key={post.id} userId={userData.userId}/>
            })}
        </div>
    )
}

export default Posts;