import React, { createContext, PropsWithChildren, useEffect, useMemo, useState } from "react";
import { useAxios } from "../Hooks/Axios";
import { UserProfil } from "../interface/Index";

interface AuthContextInterface {
    userId: number
    role: string
    firstName: string
    lastName: string
    avatar: string
    connected: boolean
    setConnectHandle: (isConnected: boolean) => void
    setModifyProfileHandle: (isModify: boolean) => void 
}

export const AuthContext = createContext<AuthContextInterface | null>(null);

const AuthContextProvider = ({children}: PropsWithChildren) => {

    const {response, axiosFunction} = useAxios<{token: string, user: UserProfil}>({
        url: "/auth/connect",

    });
    const [userId, setUserId] = useState(-1);
    const [role, setRole] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [avatar, setAvatar] = useState("");
    const [connected, setConnected] = useState(false);
    const [modifyProfile, setModifyProfile] = useState(false);

    const setConnectHandle = (isConnected: boolean): void => {
        setConnected(isConnected);
    };

    const setModifyProfileHandle = (isModify: boolean): void => {
        setModifyProfile(isModify);
    };

    const getUserData = async () => {
        axiosFunction();
    };

    const contextValues = useMemo(() => {
        return {
            userId,
            role,
            firstName,
            lastName,
            avatar,
            connected, setConnectHandle,
            setModifyProfileHandle
        };
    }, [ userId, role, firstName, lastName, avatar, connected ]);

    useEffect(() => {
        if(localStorage.getItem("token")) {
            getUserData();
            setConnected(true);
        } else {
            setUserId(-1);
            setFirstName("");
            setLastName("");
            setAvatar("");
            setRole("");
        }
        setModifyProfile(false);
    }, [connected, modifyProfile]);

    useEffect(() => {
        if (response) {
            localStorage.setItem("token", JSON.stringify(response.token));
            setUserId(response.user.id);
            setFirstName(response.user.firstName);
            setLastName(response.user.lastName);
            setAvatar(response.user.avatar);
            setRole(response.user.role);
        }
    }, [response]);

    return (
        <AuthContext.Provider value={contextValues}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;