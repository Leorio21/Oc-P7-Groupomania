import axios from "axios";
import { useEffect, useState } from "react";

import classNames from "classnames";
import cn from './PostsList.module.scss'

import Post from "./Post";
import { OnePost, UserDataLs, OptionAxios } from '../../interface/Index';

const PostsList = () => {

    const [userData, setUserData] = useState<UserDataLs>(JSON.parse(localStorage.getItem('userData')!))
    const [option, setOption] = useState<OptionAxios>({
        headers: {
            Authorization: `Bearer ${userData.token}`
        }
    })
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
                return <Post post={post} key={post.id} userId={userData.userId}/>
            })}
        </div>
    )
        }
}

export default PostsList;