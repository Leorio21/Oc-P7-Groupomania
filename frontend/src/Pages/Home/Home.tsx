import { Navigate } from "react-router-dom";

import classNames from "classnames";
import cn from './Home.module.scss'

import PostsList from "../../Components/Post/PostsList";


const Home = () => {
    
    
    if(!localStorage.getItem('userData')) {
        return <Navigate to='/'/>
    }
    

    return (
        <>
            <PostsList />
        </>
    )
}

export default Home;