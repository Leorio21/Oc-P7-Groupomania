import axios, { AxiosError, AxiosRequestConfig } from "axios";
import React, { useEffect, useReducer, useState } from "react";
import Modal from "../Components/Modal/Modal";
import { IFormValues } from "../interface/Form";

axios.defaults.baseURL = "http://127.0.0.1:3000/api";
axios.defaults.method = "GET";

const initilTextError = "";
const reducerModal = (state: string, action: { type: string; payload?: string; }) => {
    switch(action.type) {
    case "display":
        state = action.payload ?? "Texte non defini";
        return state;
    case "hide":
        state = "";
        return state;
    }
    return state;
};

export const useAxios = <T = unknown>(params: AxiosRequestConfig): {response?: T, isLoading: boolean, axiosFunction: (data?: IFormValues | FormData) => void} => {
    
    const [response, setResponse] = useState<T>();
    const [textError, dispatchModal] = useReducer(reducerModal, initilTextError);
    const [isLoading, setIsLoading] = useState(false);


    const axiosFunction = async (data?: IFormValues | FormData) => {
        setIsLoading(true);
        if (localStorage.getItem("token")) {
            const token = JSON.parse(localStorage.getItem("token") ?? "");
            params.headers = {Authorization: "Bearer " + token};
        }
        try {
            const result = await axios({...params, data});
            setResponse(result.data);
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                if(error.message){
                    dispatchModal({type: "display", payload: `Une erreur est survenue1 :\n${error.message}`});
                } else if(error.response?.data.error){
                    dispatchModal({type: "display", payload: `Une erreur est survenue2 :\n${error.response.data.error}`});
                } else if (error.response?.data) {
                    dispatchModal({type: "display", payload: `Une erreur est survenue3 :\n${error.response.data}`});
                }
                return (
                    <>
                        {textError !== "" && <Modal text={textError} onCloseModal={() => {dispatchModal({type: "hide"});}} />}
                    </>
                );
            } else {
                dispatchModal({type: "display", payload: "Une erreur est survenue :\nErreur inconnue"});
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
    
    return {response, isLoading, axiosFunction};
};