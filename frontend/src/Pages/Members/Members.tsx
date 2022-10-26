import classNames from "classnames";
import cn from "./Members.module.scss";
import React from "react";
import User from "../../Components/User/User";
import { UserProfil } from "../../interface/Index";
import { useAxios } from "../../Hooks/Axios";
import Loader from "../../Components/Loader/Loader";

const Members = () => {

    const { response, isLoading } = useAxios<{users: UserProfil[]}>({
        url : "/auth/members"
    });

    if (isLoading) {
        return (
            <div className={classNames(cn.loader)}>
                <Loader color={"#FFFFFF"} isLoading size={50} />
            </div>
        );
    }
    
    if (!response?.users.length) {
        return (
            <div>Aucune données</div>
        );
    }
    
    return (
        <div className={classNames(cn.members_container)}>
            {response.users.map((user) => {
                return <User key={`user${user.id}`} user={user} />;
            })}
        </div>
    );
};

export default Members;