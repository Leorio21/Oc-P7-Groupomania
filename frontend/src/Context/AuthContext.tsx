import { createContext, useEffect, useState } from "react";
import { UserDataLs } from "../interface/UserDataLs";

interface AuthContextInterface {
    userId: number
    setUserIdHandle: Function
    token: string
    setTokenHandle: Function
    role: string
    setRoleHandle: Function
    connected: boolean
    setConnectHandle: Function
}

export const AuthContext = createContext<AuthContextInterface | null>(null);

const AuthContextProvider = (props: any) => {
    
    const [userId, setUserId] = useState(-1)
    const [token, setToken] = useState('')
    const [role, setRole] = useState('')
    const [connected, setConnected] = useState(false)

    const setUserIdHandle = (newUserId: number) => {
        setUserId(newUserId)
    }

    const setTokenHandle = (newToken: string) => {
        setToken(newToken)
    }

    const setRoleHandle = (newRole: string) => {
        setRole(newRole)
    }

    const setConnectHandle = (isConnected: boolean) => {
        setConnected(isConnected)
    }

    useEffect(() => {
        if(localStorage.getItem('userData')) {
            const userData: UserDataLs = JSON.parse(localStorage.getItem('userData')!)

            setUserId(userData.userId)
            setToken(userData.token)
            setRole(userData.role)
            setConnected(true)
        }
    }, [])

    return (
        <AuthContext.Provider value={{userId, setUserIdHandle, token, setTokenHandle, role, setRoleHandle, connected, setConnectHandle}}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider;