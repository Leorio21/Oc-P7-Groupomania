import React, { useContext, useEffect, useState } from "react";

import PostsList from "../../Components/Post/PostsList";
import { AuthContext } from "../../Context/AuthContext";


const Home = () => {

    const authContext = useContext(AuthContext);

    const [isConnected, setIsConnected] = useState(false);

    useEffect (() => {
        setIsConnected(authContext?.userId !== -1 ? true : false);
    }, [authContext?.userId]);

    return (
        <>
            {isConnected ? <PostsList /> : "Chargement en cours ..."}
        </>
    );
};

export default Home;