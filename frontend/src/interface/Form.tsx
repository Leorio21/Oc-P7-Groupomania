export interface IFormValues {
    email: string,
    password: string,
    confirmPassword: string,
    newPassword: string,
    confirmNewPassword: string,
    firstName: string,
    lastName: string,
    role: string,
    content: string,
    bgPicture: Array<File>,
    avatar: Array<File>,
    photo: Array<File>
}

export interface passwordVerif {
    min: boolean,
    maj: boolean,
    number: boolean,
    symbol: boolean,
    length: boolean,
    change: boolean,
}