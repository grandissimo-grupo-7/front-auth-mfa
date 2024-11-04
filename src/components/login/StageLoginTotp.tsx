import { getAuth, getMultiFactorResolver, MultiFactorError, TotpMultiFactorGenerator } from "firebase/auth";
import Input from "../Input";
import { UserLoginType } from "../../helpers/interfaces";
import { Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";

type StageLoginTotpType = {
    userLogin: UserLoginType;
    setUserLogin: Dispatch<SetStateAction<UserLoginType>>;
    setMessage: Dispatch<SetStateAction<string>>;
    error: MultiFactorError | undefined;
};

export default function StageLoginTotp({
    userLogin,
    setUserLogin,
    setMessage,
    error
} : StageLoginTotpType) {
    const navigate = useNavigate();

    const handleLogin = async () => {
        if(!error) return;

        const mfaResolver = getMultiFactorResolver(getAuth(), error);

        const multiFactorAssertion = TotpMultiFactorGenerator.assertionForSignIn(
            mfaResolver.hints[0].uid,
            userLogin.token
        );
        
        try {
            const userCredential = await mfaResolver.resolveSignIn(multiFactorAssertion);
            console.log(userCredential);

            const expirationTime = Date.now() + (4 * 60 * 60 * 1000); // 4h em ms
            localStorage.setItem("tokenExpiration", expirationTime.toString());

            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            setMessage("Código inválido!");
        }
    }

    return (
        <div className="form">
            <Input
                className="spacing"
                label="Digite o código TOTP gerado pelo aplicativo de autenticação:"
                type="text"
                placeholder="XXXXXX"
                value={userLogin.token}
                onChange={(event) => {setUserLogin((prev) => ({...prev, token: event.target.value}));}}
            />
            <button id="recaptcha-container" onClick={() => {handleLogin()}}>Entrar</button>
        </div>
    );
}