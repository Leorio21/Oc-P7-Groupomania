import { Navigate } from "react-router-dom";


const Posts = () => {

    if(!localStorage.getItem('userData')) {
        return <Navigate to='/'/>
    }

    return (
        <>
            <div>Posts</div>
        </>
    )
}

export default Posts;