/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import axios from "axios";
import React, { useCallback, useContext, useEffect, useReducer, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AuthContext } from "../../Context/AuthContext";
import { IFormValues, LocationProps, OneUser } from "../../interface/Index";

import classNames from "classnames";
import cn from "./MyProfile.module.scss";
import FileInput from "../../Components/Form/FileInput/FileInput";
import { useForm } from "react-hook-form";
import { PencilIcon, TrashIcon } from "@heroicons/react/solid";
import Button from "../../Components/Form/Button/Button";
import LabeledInput from "../../Components/Form/LabeledInput/LabeledInput";
import PasswordCheck from "../../Components/Form/PasswordCheck/PasswordCheck";
import PasswordConfirm from "../../Components/Form/PasswordConfirm/PasswordConfirm";
import { useNavigate, useLocation } from "react-router-dom";
import LabeledSelect from "../../Components/Form/LabeledSelect/LabeledSelect";
import { useAxios } from "../../Hooks/Axios";
import Loader from "../../Components/Loader/Loader";
import Modal from "../../Components/Modal/Modal";

const schemaProfile = yup.object({
    firstName: yup.string(),
    lastName: yup.string(),
    password: yup.string().required(),
    newPassword: yup.string(),
    confirmNewPassword: yup.string(),
    avatar: yup.mixed(),
    bgPicture: yup.mixed()
}).required();

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

const MyProfile = () => {
    
    const authContext = useContext(AuthContext);
    const location = useLocation();
    let { userId } = location.state as LocationProps;
    let isMyProfile = false;
    if (!userId) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        userId = authContext?.userId!;
        isMyProfile = true;
    }
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, control, getValues, setValue, resetField, watch } = useForm<IFormValues>({defaultValues: { password: "", newPassword: "", confirmNewPassword: "", bgPicture: undefined, avatar: undefined }, resolver: yupResolver(schemaProfile)});
    const [userFirstName, setUserFirstName] = useState("");
    const [userLastName, setUserLastName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userBgPictureUrl, setUserBgPictureUrl] = useState<string>("");
    const [userAvatarUrl, setUserAvatarUrl] = useState<string>("");
    const [userRole, setUserRole] = useState("");
    const [isModify, setModify] = useState(false);
    const [isDelete, setDelete] = useState(false);
    const [textError, dispatchModal] = useReducer(reducerModal, initilTextError);
    const { response, isLoading, error, axiosFunction } = useAxios<{user: OneUser}>({
        url: `/auth/user/${userId}`
    });

    const recupUserData = useCallback(
        async () => {
            axiosFunction();
        }, [userId]
    );

    const onDeleteBgPicture = (): void => {
        setUserBgPictureUrl("");
        resetField("bgPicture");
    };

    const onDeleteAvatarPicture = (): void => {
        setUserAvatarUrl("");
        resetField("avatar");
    };

    const resetUserForm = ():void => {
        resetField("avatar");
        resetField("bgPicture");
        resetField("password");
        resetField("newPassword");
        resetField("confirmNewPassword");
    };

    const onFormSubmit = useCallback(
        async (data: IFormValues): Promise<void> => {
            setModify(true);
            const myFormData = new FormData();
            data.firstName && myFormData.append("firstName", data.firstName);
            data.lastName && myFormData.append("lastName", data.lastName);
            data.email && myFormData.append("email", data.email);
            data.role && myFormData.append("role", data.role);
            myFormData.append("password", data.password);
            data.newPassword && myFormData.append("newPassword", data.newPassword);
            data.confirmNewPassword && myFormData.append("confirmNewPassword", data.confirmNewPassword);
            myFormData.append("userBg", userBgPictureUrl);
            data.bgPicture && myFormData.append("bgPicture", data.bgPicture[0]);
            myFormData.append("userAvatar", userAvatarUrl);
            data.avatar && myFormData.append("avatar", data.avatar[0]);
            const myInterceptor = axios.interceptors.request.use((config) => {
                config.method = "PUT";
                return config;
            });
            axiosFunction(myFormData);
            axios.interceptors.request.eject(myInterceptor);
        }, [userId, userBgPictureUrl, userAvatarUrl]
    );

    const deleteAccount = useCallback(
        async (data: IFormValues): Promise<void> => {
            setDelete(true);
            const deleteAccount = isMyProfile ?
                confirm("??tes-vous s??r de vouloir supprimer votre compte ??\nToutes vos donn??es et messages seront supprim??s")
                :
                confirm("??tes-vous s??r de vouloir supprimer le compte ??\nToutes les donn??es et messages seront supprim??s");
            if (deleteAccount) {
                const myInterceptor = axios.interceptors.request.use((config) => {
                    config.method = "DELETE";
                    config.data = {password: data.password};
                    return config;
                });
                axiosFunction();
                axios.interceptors.request.eject(myInterceptor);
                if(isMyProfile) {
                    localStorage.removeItem("token");
                    authContext?.setConnectHandle(false);
                }
            }
        }, [userId]
    );

    const modifyRole = (newRole: string) => {
        setUserRole(newRole);
    };

    useEffect(() => {
        if(getValues("bgPicture")) {
            if (getValues("bgPicture").length > 0) {
                setUserBgPictureUrl(window.URL.createObjectURL([...getValues("bgPicture")][0]));
            }
        }
        if(getValues("avatar")) {
            if (getValues("avatar").length > 0) {
                setUserAvatarUrl(window.URL.createObjectURL([...getValues("avatar")][0]));
            }
        }
    }, [watch("bgPicture"), watch("avatar")]);

    useEffect(() => {
        recupUserData();
    }, [userId]);

    useEffect(()=>{
        if (error) {
            dispatchModal({type: "display", payload: error});
        }
    }, [error]);

    useEffect(() => {
        if (response && isModify) {
            resetUserForm();
            alert("Modifications enregistr??es");
            authContext?.setModifyProfileHandle(true);
        } else if (response && isDelete) {
            alert("Compte supprim??");
            navigate("/home");
        } else if(response) {
            setUserFirstName(response!.user.firstName);
            setValue("firstName", response!.user.firstName);
            setUserLastName(response!.user.lastName);
            setValue("lastName", response!.user.lastName);
            setUserEmail(response!.user!.email);
            setValue("email", response!.user.email);
            setUserBgPictureUrl(response!.user.background!);
            setUserAvatarUrl(response!.user.avatar!);
            setUserRole(response!.user.role);
        }
        setModify(false);
        setDelete(false);
    }, [response]);

    if (isLoading) {
        return (
            <div className={classNames(cn.loader)}>
                <Loader color={"#FFFFFF"} isLoading size={50} />
            </div>
        );
    }

    return (
        <>
            <form className={classNames(cn.form)} onSubmit={handleSubmit(onFormSubmit)}>
                <div className={classNames(cn.bg_container)} tabIndex={0}>
                    {userBgPictureUrl && <img src={userBgPictureUrl} alt="Image utilisateur" />}
                    <div className={classNames(cn.menuImg, cn["menuImg--bg"])}>
                        <FileInput id={"picture"} name='bgPicture' accept={"image/jpeg, image/png, image/gif, image/webp"} multiple={false} register={register}>
                            <PencilIcon className={classNames(cn.icon, cn["icon--pencil"])} tabIndex={0} />
                        </FileInput>
                        <TrashIcon className={classNames(cn.icon, cn["icon--trash"])} onClick={onDeleteBgPicture} tabIndex={0} />
                    </div>
                </div>
                <div className={classNames(cn.profil_container)} >
                    <div className={classNames(cn.avatar_container)} tabIndex={0}>
                        {userAvatarUrl && <img src={userAvatarUrl} alt="Image utilisateur" />}
                        <div className={classNames(cn.menuImg, cn["menuImg--avatar"])}>
                            <FileInput id={"avatar"} name='avatar' accept={"image/jpeg, image/png, image/gif, image/webp"} multiple={false} register={register}>
                                <PencilIcon className={classNames(cn.icon, cn["icon--pencil"])} tabIndex={0} />
                            </FileInput>
                            <TrashIcon className={classNames(cn.icon, cn["icon--trash"])} onClick={onDeleteAvatarPicture} tabIndex={0} />
                        </div>
                    </div>
                    
                    <div className={classNames(cn.profil)} >
                        {authContext?.role === "ADMIN" ?
                            <>
                                <LabeledInput
                                    tabIndex={0}
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    label={"Pr??nom :"}
                                    placeHolder={"Pr??nom"}
                                    register={register}
                                    required={false}
                                />
                                <LabeledInput
                                    tabIndex={0}
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    label={"Nom :"}
                                    placeHolder={"Nom"}
                                    register={register}
                                    required={false}
                                />
                                <LabeledInput
                                    tabIndex={0}
                                    type="text"
                                    id="email"
                                    name="email"
                                    label={"Email :"}
                                    placeHolder={"Email"}
                                    register={register}
                                    required={false}
                                />
                                <LabeledSelect
                                    tabIndex={0}
                                    name="role"
                                    label="R??le :"
                                    id="role"
                                    role={userRole}
                                    register={register}
                                    options={["USER", "MODERATOR", "ADMIN"]}
                                    onModifyHandler={modifyRole}
                                />
                            </>
                            :
                            <div className={classNames(cn.personnal_info)} >
                                <div className={classNames(cn.name)}>
                                    <p className={classNames(cn.userName)} >{userFirstName}</p>
                                    <p className={classNames(cn.userName)} >{userLastName}</p>
                                </div>
                                <div className={classNames(cn.mail)} >{userEmail}</div>
                                <div className={classNames(cn.role)} >Role : {userRole}</div>
                            </div>
                        }
                        <div className={classNames(cn.newPassword_container)} >
                            <div className={classNames(cn.newPassword)} >
                                <LabeledInput
                                    tabIndex={0}
                                    type="password"
                                    id="newPassword"
                                    name="newPassword"
                                    label={"Nouveau mot de passe :"}
                                    placeHolder={"Nouveau mot de passe"}
                                    register={register}
                                    required={false}
                                />
                                <PasswordCheck control={control} name='newPassword'/>
                                <LabeledInput
                                    tabIndex={0}
                                    type="password"
                                    id="confirmNewPassword"
                                    name="confirmNewPassword"
                                    label={"Confirmer mot de passe :"}
                                    placeHolder={"Confirmer mot de passe"}
                                    register={register}
                                    required={false}
                                />
                                <PasswordConfirm control={control}  name='newPassword' nameConfirm='confirmNewPassword' />
                            </div>
                        </div>
                    </div>
                </div>
                <div className={classNames(cn.validation_container)} >
                    <div className={classNames(cn.current_password)} >
                        <LabeledInput
                            tabIndex={0}
                            type="password"
                            id="password"
                            name="password"
                            label={"Votre mot de passe :"}
                            placeHolder={"Votre mot de passe"}
                            register={register}
                            required
                        />
                    </div>
                    <p>{errors.password?.message && "Veuillez saisir votre mot de passe"}</p>
                    <div className={classNames(cn.validation)} >
                        <Button 
                            tabIndex={0}
                            type='button'
                            label="Supprimer mon compte"
                            onClickHandler={handleSubmit(deleteAccount)}
                            isLoading={isLoading}
                            color="red"
                        />
                        <Button 
                            tabIndex={0}
                            type='submit'
                            label="Enregistrer"
                            color="green"
                            isLoading={isLoading}
                        />
                    </div>
                </div>
            </form>
            {textError && <Modal text={textError} onCloseModal={() => {dispatchModal({type: "hide"});}} />}
        </>
    );
};

export default MyProfile;