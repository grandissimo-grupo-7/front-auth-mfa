import { Dispatch, MutableRefObject, SetStateAction } from "react";
import { TotpInfoType, UserLoginType } from "../../helpers/interfaces";
import Input from "../Input";
import { Auth, MultiFactorResolver, TotpMultiFactorGenerator, TotpSecret, getMultiFactorResolver, multiFactor, signInWithEmailAndPassword } from "firebase/auth";

type StageLoginEmailType = {
    userLogin: UserLoginType;
    setUserLogin: Dispatch<SetStateAction<UserLoginType>>;
    setTotpInfo: Dispatch<SetStateAction<TotpInfoType>>;
    setStage: Dispatch<SetStateAction<"email" | "registerTotp" | "loginTotp">>;
    setMessage: Dispatch<SetStateAction<string>>;
    auth: Auth;
    totpSecret: MutableRefObject<TotpSecret | null>;
    resolver: MutableRefObject<MultiFactorResolver | undefined>;
}

export default function StageLoginEmail({
    userLogin,
    setUserLogin,
    setTotpInfo,
    setStage,
    setMessage,
    auth,
    totpSecret,
    resolver
}: StageLoginEmailType) {
    
    const verifyEmailAndPassword = () => {
        if(userLogin.email == "" || userLogin.password == "") {
            setMessage("Por favor, preencha todos os campos!");
            return;
        }

        signInWithEmailAndPassword(auth, userLogin.email, userLogin.password).then(async (userCredential) => {
            const user = userCredential.user;

            const multiFactorSession = await multiFactor(user).getSession();
            const totpSecretUser = await TotpMultiFactorGenerator.generateSecret(multiFactorSession);

            totpSecret.current = totpSecretUser;

            const totpUri = totpSecretUser.generateQrCodeUrl(userLogin.email, "railvision");
            const secret = totpSecretUser.secretKey;

            setTotpInfo({
                totpToken: secret,
                totpUri: totpUri,
                user: user,
            });
            setMessage("");
            setStage("registerTotp");
        }).catch((error) => {            
            switch(error.code) {
                case "auth/multi-factor-auth-required":
                    console.log("MFA ativado!");
                    setMessage("");
                    setStage("loginTotp");
                    setTotpInfo((prev) => ({...prev, error: error}));
                    break;
                case "auth/invalid-email":
                    setMessage("E-mail e/ou senha inválidos");
                    return;
                case "auth/invalid-credential":
                    setMessage("E-mail e/ou senha inválidos");
                    return;
                case "auth/unverified-email":
                    setMessage("Verifique seu e-mail antes de entrar");
                    return;
                case "auth/too-many-requests":
                    setMessage("O acesso a essa conta foi temporariamente desativada devido ao alto número de tentativas!");
                    return;
                default:
                    console.error("Erro ao autenticar.")
                    console.log(error);
            }

            resolver.current = getMultiFactorResolver(auth, error);
        });
    }

    return (
        <div className="form">
            <Input
                label="Digite seu e-mail:"
                type="email"
                placeholder="email@dominio.com"
                value={userLogin.email}
                onChange={(event) => {setUserLogin((prev) => ({...prev, email: event.target.value}));}}
            />
            <Input
                label="Digite sua senha:"
                type="password"
                placeholder="******"
                value={userLogin.password}
                onChange={(event) => {setUserLogin((prev) => ({...prev, password: event.target.value}));}}
            />
            <button id="recaptcha-container" onClick={() => {verifyEmailAndPassword();}}>Continuar</button>
        </div>
    );
}