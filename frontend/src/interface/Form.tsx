export interface IFormValues {
    email: string,
    password: string,
    confirmPassword: string,
    content: string,
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