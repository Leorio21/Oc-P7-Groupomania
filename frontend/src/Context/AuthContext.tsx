import React, { createContext, PropsWithChildren, useEffect, useMemo, useState } from "react";
import { useAxios } from "../Hooks/Axios";
import { UserProfil } from "../interface/Index";

interface AuthContextInterface {
    userId: number
    token: string
    role: string
    firstName: string
    lastName: string
    avatar: string
    connected: boolean
    setConnectHandle: (isConnected: boolean) => void
}

export const AuthContext = createContext<AuthContextInterface | null>(null);

const AuthContextProvider = ({children}: PropsWithChildren) => {

    const {response, axiosFunction} = useAxios<{token: string, user: UserProfil}>({
        url: "/auth/connect",

    });
    const [userId, setUserId] = useState(-1);
    const [token, setToken] = useState("");
    const [role, setRole] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [avatar, setAvatar] = useState("");
    const [connected, setConnected] = useState(false);

    const setConnectHandle = (isConnected: boolean): void => {
        setConnected(isConnected);
    };

    const getUserData = async () => {
        axiosFunction();
    };

    const contextValues = useMemo(() => {
        return {
            userId,
            token,
            role,
            firstName,
            lastName,
            avatar,
            connected, setConnectHandle};
    }, [ userId, token, role, firstName, lastName, avatar, connected ]);

    useEffect(() => {
        if(localStorage.getItem("token")) {
            getUserData();
            setConnected(true);
        } else {
            setUserId(-1);
            setFirstName("");
            setLastName("");
            setAvatar("");
            setToken("");
            setRole("");
        }
    }, [connected]);

    useEffect(() => {
        if (response) {
            localStorage.setItem("token", JSON.stringify(response.token));
            setUserId(response.user.id);
            setFirstName(response.user.firstName);
            setLastName(response.user.lastName);
            setAvatar(response.user.avatar);
            setToken(response.user.token);
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