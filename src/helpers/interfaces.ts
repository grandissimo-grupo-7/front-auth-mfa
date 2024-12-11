import { MultiFactorError, User } from "firebase/auth";

export type UserLoginType = {
    email: string;
    password: string;
    token: string;
}

export type TotpInfoType = {
    totpToken: string;
    totpUri: string;
    user: User | null;
    error?: MultiFactorError;
}