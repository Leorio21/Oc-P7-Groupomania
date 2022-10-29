import axios, { AxiosError, AxiosRequestConfig } from "axios";
import React, { useEffect, useState } from "react";
import { IFormValues } from "../interface/Form";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.method = "GET";

export const useAxios = <T = unknown>(params: AxiosRequestConfig): {response?: T, isLoading: boolean, error: string, axiosFunction: (data?: IFormValues | FormData) => void} => {
    
    const [response, setResponse] = useState<T>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");


    const axiosFunction = async (data?: IFormValues | FormData) => {
        setIsLoading(true);
        setError("");
        if (localStorage.getItem("token")) {
            const token = JSON.parse(localStorage.getItem("token") ?? "");
            params.headers = {Authorization: "Bearer " + token};
        }
        try {
            const result = await axios({...params, data});
            setResponse(result.data);
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                if(error.response?.data.error){
                    setError(error.response.data.error);
                } else if (error.response?.data) {
                    setError(error.response.data);
                } else if(error.message){
                    setError(error.message);
                } 
            } else {
                setError("Une erreur est survenue :\nErreur inconnue");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (localStorage.getItem("token") && !params.method) {
            axiosFunction();
        }
    }, []);
    
    return {response, isLoading, error, axiosFunction};
};