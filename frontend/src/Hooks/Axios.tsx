import axios, { AxiosError, AxiosRequestConfig } from "axios";
import React, { useEffect, useReducer, useState } from "react";
import Modal from "../Components/Modal/Modal";
import { IFormValues } from "../interface/Index";

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

export const useAxios = (params: AxiosRequestConfig) => {
    
    const [response, setResponse] = useState();
    const [textError, dispatchModal] = useReducer(reducerModal, initilTextError);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        try {
            const result = await axios(params);
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
        fetchData();
    }, []);

    return {response, isLoading};
};