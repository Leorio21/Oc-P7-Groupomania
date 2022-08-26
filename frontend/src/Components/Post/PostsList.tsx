import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";

import classNames from "classnames";
import cn from './PostsList.module.scss'

import Post from "./Post";
import { OnePost, OptionAxios } from '../../interface/Index';

const PostsList = () => {

    const authContext = useContext(AuthContext)
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
            } catch (error) {
                console.log('error')
            }
        }
    
    useEffect(() => {
        fetchData(option)
    }, [])

    
if(posts == []) {
    return (<></>)
} else {
    return (
        <div className={classNames(cn.mainContainer)}>
            {posts!.map((post:OnePost) => {
                return <Post post={post} key={post.id} />
            })}
        </div>
    )
        }
}

export default PostsList;