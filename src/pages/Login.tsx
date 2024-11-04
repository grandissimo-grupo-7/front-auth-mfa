import { getAuth, MultiFactorResolver, TotpSecret } from "firebase/auth";
import { MutableRefObject, useRef, useState } from "react";
import { app } from "../helpers/firebaseSettings";
import { TotpInfoType, UserLoginType } from "../helpers/interfaces";
import StageLoginEmail from "../components/login/StageLoginEmail";
import StageRegisterTotp from "../components/login/StageRegisterTotp";
import StageLoginTotp from "../components/login/StageLoginTotp";

export default function Login() {
    const auth = getAuth(app);

    const [userLogin, setUserLogin] = useState<UserLoginType>({
        "email": "",
        "password": "",
        "token": ""
    });

    const [stage, setStage] = useState<"email" | "registerTotp" | "loginTotp">("email");
    const [message, setMessage] = useState("");

    const [totpInfo, setTotpInfo] = useState<TotpInfoType>({totpToken: "", totpUri: "", user: null});

    const totpSecret: MutableRefObject<TotpSecret | null> = useRef<TotpSecret | null>(null);
    const resolver = useRef<MultiFactorResolver>();

    const stages = {
        "email": (
            <StageLoginEmail
                userLogin={userLogin}
                setUserLogin={setUserLogin}
                setTotpInfo={setTotpInfo}
                setStage={setStage}
                setMessage={setMessage}
                auth={auth}
                totpSecret={totpSecret}
                resolver={resolver}
            />
        ),
        "registerTotp": (
            <StageRegisterTotp
                userLogin={userLogin}
                setUserLogin={setUserLogin}
                setMessage={setMessage}
                totpInfo={totpInfo}
                totpSecret={totpSecret}
            />
        ),
        "loginTotp": (
            <StageLoginTotp
                userLogin={userLogin}
                setUserLogin={setUserLogin}
                setMessage={setMessage}
                error={totpInfo.error}
            />
        )
    }

    return (
        <section>
            <div className="banner">
                <img src="./railvision-logo.png" alt="Logo do railvision" />
                <span>Railvision</span>
            </div>
            
            {stages[stage]}

            <div className="form">
                {
                    message != "" &&
                    <div className="message">{message}</div>
                }
            </div>
        </section>
    );
}