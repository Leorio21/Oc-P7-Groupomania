import React, { useContext, useEffect, useState } from "react";
import Loader from "../../Components/Loader/Loader";

import PostsList from "../../Components/Post/PostsList";
import { AuthContext } from "../../Context/AuthContext";

import classNames from "classnames";
import cn from "./Home.module.scss";


const Home = () => {

    const authContext = useContext(AuthContext);

    const [isConnected, setIsConnected] = useState(false);

    useEffect (() => {
        setIsConnected(authContext?.userId !== -1 ? true : false);
    }, [authContext?.userId]);

    return (
        <>
            {isConnected ? <PostsList /> : <div className={classNames(cn.loader)}><Loader color={"#FFFFFF"} isLoading size={50} /></div>}
        </>
    );
};

export default Home;