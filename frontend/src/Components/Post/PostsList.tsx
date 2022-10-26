import React, { useEffect, useState } from "react";
import { useAxios } from "../../Hooks/Axios";

import classNames from "classnames";
import cn from "./PostsList.module.scss";

import Post from "./Post";
import { OnePost } from "../../interface/Index";
import FormPost from "../Form/FormPost";
import Loader from "../Loader/Loader";

interface PostListProps {
    postUser?: OnePost[]
}

const PostsList = ({postUser}:  PostListProps) => {

    const [posts, setPosts] = useState<OnePost[]>([]);

    const {response, isLoading} = useAxios<OnePost[]>({
        url: "/post",
    });
    
    const onPostSubmit = (newPost: OnePost): void => {
        setPosts((prevState) => {
            const newPostsArray = [...prevState];
            newPostsArray.unshift(newPost);
            return newPostsArray;
        });
    };

    const onPostDelete = (postToDelete: number): void => {
        setPosts((prevState) => {
            const newPostArray = prevState.filter((post) => post.id != postToDelete);
            return newPostArray;
        });
    };
    
    useEffect(() => {
        if (postUser) {
            setPosts(postUser);
        }
    }, [postUser]);

    useEffect (() => {
        if (response && !postUser) {
            setPosts(response);
        }
    }, [response]);

    return (
        <>
            <div className={classNames(cn.mainContainer)}>
                {!postUser &&
                    <FormPost
                        classes={classNames(cn.form_container)}
                        classesIcon={classNames(cn.iconPicture)}
                        buttonLabel='Publier'
                        tabIndex={0}
                        id='content'
                        name='content'
                        placeHolder='Publiez quelque chose ...'
                        onPostSubmit={onPostSubmit}
                    />
                }
                {isLoading && <Loader color={"#FFFFFF"} isLoading size={50} />}
                {response &&
                    <>
                        {posts && posts?.map((post:OnePost) => {
                            return (
                                <Post
                                    post={post}
                                    onDeletePost={onPostDelete}
                                    key={post.id}
                                />
                            );
                        })}
                    </>
                }
            </div>
        </>
    );
};

export default PostsList;