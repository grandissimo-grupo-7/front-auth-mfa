import { MultiFactorError, User } from "firebase/auth";

export type UserLoginType = {
    email: string;
    password: string;
    token: string;
}

export type UserRegisterType = {
    name: string;
    rg: string;
    cpf: string;
    email: string;
    password: string;
    confirmPassword: string;
    userType: string;
}

export type TotpInfoType = {
    totpToken: string;
    totpUri: string;
    user: User | null;
    error?: MultiFactorError;
}