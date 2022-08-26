import { Navigate } from "react-router-dom";
import { useContext } from "react";

import classNames from "classnames";
import cn from './Home.module.scss'

import { AuthContext } from "../../Context/AuthContext";
import PostsList from "../../Components/Post/PostsList";


const Home = () => {
    
    const authContext = useContext(AuthContext)
    
    if(!authContext!.connected) {
        return <Navigate to='/'/>
    }
    

    return (
        <>
            <PostsList />
        </>
    )
}

export default Home;