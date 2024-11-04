import { useState } from "react";
import Input from "../components/Input";
import { UserRegisterType } from "../helpers/interfaces";
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, User } from "firebase/auth";
import { app } from "../helpers/firebaseSettings";

export default function Cadastro() {
    const [userRegister, setUserRegister] = useState<UserRegisterType>({
        "name": "",
        "rg": "",
        "cpf": "",
        "email": "",
        "password": "",
        "confirmPassword": "",
        "userType": ""
    });

    const auth = getAuth(app);

    const [message, setMessage] = useState("");

    const register = () => {
        if(userRegister.name === "" || userRegister.rg === "" || userRegister.cpf === "" || userRegister.email === "" || userRegister.password === "" || userRegister.confirmPassword === "") {
            setMessage("Por favor preencha todos os campos!");
            return;
        }

        if(userRegister.password !== userRegister.confirmPassword) {
            setMessage("As senhas não coincidem!");
            return;
        }

        createUserWithEmailAndPassword(auth, userRegister.email, userRegister.password).then(() => {
            var actionCodeSettings = {
                url: `${import.meta.env.VITE_URL_FRONTEND}`
            };

            sendEmailVerification(auth.currentUser as User, actionCodeSettings).then(() => {
                setMessage("Cadastro realizado com sucesso! Por favor, verifique seu e-mail para confirmar o cadastro antes de entrar pela primeira vez.");
            }).catch((err) => {
                console.error(err);
            });

        }).catch((error) => {
            setMessage("Não foi possível cadastrar, tente novamente mais tarde!");
            console.error(error);
        });
    }

    return (
        <section>
            <div className="banner">
                <img src="./railvision-logo.png" alt="Logo do railvision" />
                <span>Railvision</span>
            </div>

            <div className="form">
                <Input
                    label="Nome completo:"
                    type="text"
                    value={userRegister.name}
                    onChange={(e) => setUserRegister({...userRegister, name: e.target.value})}
                />
                <Input
                    label="RG:"
                    type="text"
                    value={userRegister.rg}
                    onChange={(e) => setUserRegister({...userRegister, rg: e.target.value})}
                />
                <Input
                    label="CPF:"
                    type="text"
                    value={userRegister.cpf}
                    onChange={(e) => setUserRegister({...userRegister, cpf: e.target.value})}
                />

                <Input
                    label="E-mail:"
                    type="email"
                    value={userRegister.email}
                    onChange={(e) => setUserRegister({...userRegister, email: e.target.value})}
                />
                <Input
                    label="Senha:"
                    type="password"
                    value={userRegister.password}
                    onChange={(e) => setUserRegister({...userRegister, password: e.target.value})}
                />
                <Input
                    label="Confirmar senha:"
                    type="password"
                    value={userRegister.confirmPassword}
                    onChange={(e) => setUserRegister({...userRegister, confirmPassword: e.target.value})}
                />
                
                <div className="input-box">
                    <label htmlFor="">Nível de permissão:</label>
                    <select 
                        value={userRegister.userType}
                        onChange={(e) => setUserRegister({...userRegister, userType: e.target.value})}
                    >
                        <option value="">Administrador</option>
                        <option value="">Operador</option>
                    </select>
                </div>
                <button onClick={() => {register()}}>Continuar</button>
                {
                    message &&
                    <div className="message">
                        {message}
                    </div>
                }
            </div>
        </section>
    );
}