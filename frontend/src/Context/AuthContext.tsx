import { createContext, PropsWithChildren, useEffect, useMemo, useState } from "react";
import { UserDataLs } from "../interface/UserData";

interface AuthContextInterface {
    userId: number
    token: string
    role: string
    firstName: string
    lastName: string
    avatar: string
    connected: boolean
    setConnectHandle: Function
}

export const AuthContext = createContext<AuthContextInterface | null>(null);

const AuthContextProvider = ({children}: PropsWithChildren) => {
    
    const [userId, setUserId] = useState(-1)
    const [token, setToken] = useState('')
    const [role, setRole] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [avatar, setAvatar] = useState('')
    const [connected, setConnected] = useState(false)

    const setConnectHandle = (isConnected: boolean) => {
        setConnected(isConnected)
    }

    const contextValues = useMemo(() => {
        return {
            userId,
            token,
            role,
            firstName,
            lastName,
            avatar,
            connected, setConnectHandle}
    }, [userId, token, role, firstName, lastName, avatar, connected])

    useEffect(() => {
        if(localStorage.getItem('userData')) {
            const userData: UserDataLs = JSON.parse(localStorage.getItem('userData')!)

            setUserId(userData.userId)
            setFirstName(userData.firstName)
            setLastName(userData.lastName)
            setAvatar(userData.avatar)
            setToken(userData.token)
            setRole(userData.role)
            setConnected(true)
        } else {
            setUserId(-1)
            setFirstName('')
            setLastName('')
            setAvatar('')
            setToken('')
            setRole('')
        }
    }, [connected])

    return (
        <AuthContext.Provider value={contextValues}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider;