import { Dispatch, RefObject, SetStateAction, useState } from "react";
import { TotpInfoType, UserLoginType } from "../../helpers/interfaces";
import Input from "../Input";
import QRCode from "react-qr-code";
import { multiFactor, TotpMultiFactorGenerator, TotpSecret } from "firebase/auth";
import { useNavigate } from "react-router-dom";

type StageRegisterTotpType = {
    userLogin: UserLoginType;
    setUserLogin: Dispatch<SetStateAction<UserLoginType>>;
    setMessage: Dispatch<SetStateAction<string>>;
    totpInfo: TotpInfoType;
    totpSecret: RefObject<TotpSecret | null>;
}

export default function StageRegisterTotp({userLogin, setUserLogin, setMessage, totpInfo, totpSecret} : StageRegisterTotpType) {
    const [showCode, setShowCode] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async () => {
        if(!totpInfo.user || totpSecret.current === null) {
            setMessage("Não foi possível registrar o multifator, por favor recarregue a página!");
            return;
        }

        try {
            const multiFactorAssertion = TotpMultiFactorGenerator.assertionForEnrollment(totpSecret.current, userLogin.token);
            const resp = await multiFactor(totpInfo.user).enroll(multiFactorAssertion, "railvision");
            console.log(multiFactorAssertion);
            console.log(resp);

            const expirationTime = Date.now() + (4 * 60 * 60 * 1000); // 4h em ms
            localStorage.setItem("tokenExpiration", expirationTime.toString());

            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            setMessage("Código inválido!");
            return;
        }
    }

    return (
        <div className="form register-totp">
            <p>Por favor, se registre no seu aplicativo de autenticação:</p>
            <div className="box">
                {
                    (totpInfo.totpUri !== "" && totpInfo.totpToken !== "") ?
                    <>
                        <QRCode className="qrcode-totp" value={totpInfo.totpUri}></QRCode>
                        <div className="text">
                            <p>Não é possível escanear o QRCode?</p>
                            <p>Insira manualmente:</p>
                            <span className="hide" onClick={() => {setShowCode((prev) => !prev)}}>{showCode ? totpInfo.totpToken : "Clique aqui para revelar o código" }</span>
                        </div>
                    </> :
                    <p>Problema em registrar o multifator, por favor recarregue a página!</p>
                }
            </div>
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