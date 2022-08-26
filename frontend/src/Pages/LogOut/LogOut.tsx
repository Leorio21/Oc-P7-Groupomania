import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


const LogOut = () => {

    const navigate = useNavigate()
    localStorage.removeItem('userData')

    useEffect(() => {
        navigate('/')
    }, [])

    return (
        <>
            Deconnexion ...
        </>
    )
}

export default LogOut;