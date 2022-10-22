import axios, { AxiosError } from "axios";
import React, { useCallback, useContext, useEffect, useReducer, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Modal from "../../Components/Modal/Modal";
import { AuthContext } from "../../Context/AuthContext";
import { IFormValues } from "../../interface/Index";

import classNames from "classnames";
import cn from "./MyProfile.module.scss";
import FileInput from "../../Components/Form/FileInput/FileInput";
import { useForm } from "react-hook-form";
import { PencilIcon, TrashIcon } from "@heroicons/react/solid";
import Button from "../../Components/Form/Button/Button";
import LabeledInput from "../../Components/Form/LabeledInput/LabeledInput";
import PasswordCheck from "../../Components/Form/PasswordCheck/PasswordCheck";
import PasswordConfirm from "../../Components/Form/PasswordConfirm/PasswordConfirm";
import { useParams, useNavigate } from "react-router-dom";
import LabeledSelect from "../../Components/Form/LabeledSelect/LabeledSelect";

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
        state = action.payload ?? "Texte non défini";
        return state;
    case "hide":
        state = "";
        return state;
    }
    return state;
};

const MyProfile = () => {
    
    const params = useParams();
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors }, control, getValues, setValue, resetField, watch } = useForm<IFormValues>({defaultValues: { password: "", newPassword: "", confirmNewPassword: "", bgPicture: undefined, avatar: undefined }, resolver: yupResolver(schemaProfile)});
    
    
    const [textError, dispatchModal] = useReducer(reducerModal, initilTextError);
    const [userFirstName, setUserFirstName] = useState("");
    const [userLastName, setUserLastName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userBgPictureUrl, setUserBgPictureUrl] = useState<string>("");
    const [userAvatarUrl, setUserAvatarUrl] = useState<string>("");
    const [userRole, setUserRole] = useState("");

    const userId = params.userId ? params.userId : authContext?.userId;

    const recupUserData = useCallback(
        async () => {
            try {
                const option = {
                    headers: {
                        Authorization: `Bearer ${authContext?.token}`
                    }
                };
                const response = await axios.get(`${authContext?.apiUrl}/api/auth/user/${userId}`, option);
                setUserFirstName(response.data.user.firstName);
                setValue("firstName", response.data.user.firstName);
                setUserLastName(response.data.user.lastName);
                setValue("lastName", response.data.user.lastName);
                setUserEmail(response.data.user.email);
                setValue("email", response.data.user.email);
                setUserBgPictureUrl(response.data.user.background);
                setUserAvatarUrl(response.data.user.avatar);
                setUserRole(response.data.user.role);
            } catch (error: unknown) {
                if (error instanceof AxiosError) {
                    if(error.response?.data.message){
                        dispatchModal({type: "display", payload: `Une erreur est survenue :\n${error.response.data.message}`});
                    } else if (error.response?.data) {
                        dispatchModal({type: "display", payload: `Une erreur est survenue :\n${error.response.data}`});
                    }
                }
            }
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
            try {
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
                const option = {
                    headers: {
                        "Content-Type":"multipart/form-data",
                        Authorization: `Bearer ${authContext?.token}`
                    }
                };
                await axios.put(`${authContext?.apiUrl}/api/auth/${userId}`, myFormData, option);
                resetUserForm();
                alert("Modifications enregistrées");
            } catch (error: unknown) {
                if (error instanceof AxiosError) {
                    if(error.response?.data.error){
                        dispatchModal({type: "display", payload: `Une erreur est survenue :\n${error.response.data.error}`});
                    } else if (error.response?.data) {
                        dispatchModal({type: "display", payload: `Une erreur est survenue :\n${error.response.data}`});
                    }
                }
            }
        }, [userId, userBgPictureUrl, userAvatarUrl]
    );

    const deleteAccount = useCallback(
        async (data: IFormValues): Promise<void> => {
            const deleteAccount = confirm("Êtes-vous sûr de vouloir supprimer votre compte ??\nToutes vos données et messages seront supprimés");
            if (deleteAccount) {
                try {
                    const option = {
                        headers: {
                            Authorization: `Bearer ${authContext?.token}`
                        },
                        data: {password: data.password}
                    };
                    await axios.delete(`${authContext?.apiUrl}/api/auth/${userId}`, option);
                    if(!params.userId) {
                        localStorage.removeItem("token");
                        authContext?.setConnectHandle(false);
                    }
                    navigate("/home");
                } catch (error: unknown) {
                    if (error instanceof AxiosError) {
                        if(error.response?.data.error){
                            dispatchModal({type: "display", payload: `Une erreur est survenue :\n${error.response.data.error}`});
                        } else if (error.response?.data) {
                            dispatchModal({type: "display", payload: `Une erreur est survenue :\n${error.response.data}`});
                        }
                    }
                }
            }
        }, [userId]
    );

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
    }, [params.userId]);

    return (
        <>
            <form className={classNames(cn.form)} onSubmit={handleSubmit(onFormSubmit)}>
                <div className={classNames(cn.bg_container)} tabIndex={0}>
                    {userBgPictureUrl && <img src={userBgPictureUrl} alt="Image utilisateur" />}
                    <div className={classNames(cn.menuImg, cn["menuImg--bg"])}>
                        <FileInput id={"picture"} name='bgPicture' accept={"image/jpeg, image/png, image/gif, image/webp"} multiple={false} register={register}>
                            <PencilIcon className={classNames(cn.icon, cn["icon--pencil"])} />
                        </FileInput>
                        <TrashIcon className={classNames(cn.icon, cn["icon--trash"])} onClick={onDeleteBgPicture}/>
                    </div>
                </div>
                <div className={classNames(cn.profil_container)} >
                    <div className={classNames(cn.avatar_container)}>
                        {userAvatarUrl && <img src={userAvatarUrl} alt="Image utilisateur" />}
                        <div className={classNames(cn.menuImg, cn["menuImg--avatar"])}>
                            <FileInput id={"avatar"} name='avatar' accept={"image/jpeg, image/png, image/gif, image/webp"} multiple={false} register={register}>
                                <PencilIcon className={classNames(cn.icon, cn["icon--pencil"])} />
                            </FileInput>
                            <TrashIcon className={classNames(cn.icon, cn["icon--trash"])} onClick={onDeleteAvatarPicture}/>
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
                                    label={"Prénom :"}
                                    placeHolder={"Prénom"}
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
                                    label="Rôle :"
                                    id="role"
                                    role={userRole}
                                    register={register}
                                    options={["USER", "MODERATOR", "ADMIN"]} />
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
                            color="red"
                        />
                        <Button 
                            tabIndex={0}
                            type='submit'
                            label="Enregistrer"
                            color="green"
                        />
                    </div>
                </div>
            </form>
            {textError !== "" && <Modal text={textError} onCloseModal={() => {dispatchModal({type: "hide"});}} />}
        </>
    );
};

export default MyProfile;