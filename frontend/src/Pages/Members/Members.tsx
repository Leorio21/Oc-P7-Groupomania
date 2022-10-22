import classNames from "classnames";
import cn from "./Members.module.scss";
import React, { useContext, useEffect, useState } from "react";
import User from "../../Components/User/User";
import { AuthContext } from "../../Context/AuthContext";
import { UserProfil } from "../../interface/Index";
import { useAxios } from "../../Hooks/Axios";

const Members = () => {

    const authContext = useContext(AuthContext);
    const [userList, setUserList] = useState<UserProfil[]>([]);

    const { response, isLoading } = useAxios({
        url : "/auth/members",
        headers: {
            Authorization: `Bearer ${authContext?.token}`
        }
    });

    useEffect(() => {
        if (response) {
            setUserList(response["user"]);
        }
    }, [response]);
    
    return (
        <>
            {isLoading && <div>Chargement en cours....</div>}
            {response &&
                <>
                    <div className={classNames(cn.members_container)}>
                        {userList ? userList?.map((user) => {
                            return <User key={`user${user.id}`} user={user} />;
                        }) : <div>Chargement en cours....</div>}
                    </div>
                </>
            }
        </>
    );
};

export default Members;