import axios, { AxiosError } from "axios";
import React, { createContext, PropsWithChildren, useEffect, useMemo, useReducer, useState } from "react";
import Modal from "../Components/Modal/Modal";

interface AuthContextInterface {
    apiUrl: string
    userId: number
    token: string
    role: string
    firstName: string
    lastName: string
    avatar: string
    connected: boolean
    setConnectHandle: (isConnected: boolean) => void
}

const initialTextError = "";
const reducerModal = (state: string, action: { type: string; payload?: string; }) => {
    switch(action.type) {
    case "display":
        state = action.payload ?? "texte non défini";
        return state;
    case "hide":
        state = "";
        return state;
    }
    return state;
};

export const AuthContext = createContext<AuthContextInterface | null>(null);

const AuthContextProvider = ({children}: PropsWithChildren) => {

    const apiUrl = useMemo(() => {
        return "http://127.0.0.1:3000";
    }, []);
    
    const [textError, dispatchModal] = useReducer(reducerModal, initialTextError);
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
        const token = JSON.parse(localStorage.getItem("token") ?? "");
        const option = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        try {
            const userData = await axios.get(`${apiUrl}/api/auth/connect`, option);
            localStorage.setItem("token", JSON.stringify(userData.data.token));
            setUserId(userData.data.userId);
            setFirstName(userData.data.firstName);
            setLastName(userData.data.lastName);
            setAvatar(userData.data.avatar);
            setToken(userData.data.token);
            setRole(userData.data.role);
        } catch (error: unknown) {
            console.log(error);
            if (error instanceof AxiosError) {
                if(error.response?.data.message){
                    dispatchModal({type: "display", payload: `Context : Une erreur est survenue :\n${error.response.data.message}`});
                } else if (error.response?.data) {
                    dispatchModal({type: "display", payload: `Context : Une erreur est survenue :\n${error.response.data}`});
                }
            } else {
                dispatchModal({type: "display", payload: "Une erreur est survenue :\nErreur inconnue"});
            }
        }
    };

    const contextValues = useMemo(() => {
        return {
            apiUrl,
            userId,
            token,
            role,
            firstName,
            lastName,
            avatar,
            connected, setConnectHandle};
    }, [apiUrl, userId, token, role, firstName, lastName, avatar, connected]);

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

    return (
        <AuthContext.Provider value={contextValues}>
            {children}
            {textError !== "" && <Modal text={textError} onCloseModal={() => {dispatchModal({type: "hide"});}} />}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;