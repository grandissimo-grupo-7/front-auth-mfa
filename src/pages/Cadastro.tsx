import { useState } from "react";
import Input from "../components/Input";
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, User } from "firebase/auth";
import { app } from "../helpers/firebaseSettings";
import { UsuarioCadastro } from "../interfaces/interfaces";
import { cadastrarUsuario } from "../services/services";

export default function Cadastro() {
    const [userRegister, setUserRegister] = useState<UsuarioCadastro>({
        "id_empresa": 3,
        "nome": "",
        "email": "",
        "sexo": "",
        "rg": "",
        "cpf": "",
        "senha": "",
        "confirmarSenha": "",
        "admin": false,
        "setor": ""
    });

    const auth = getAuth(app);

    const [message, setMessage] = useState("");

    const register = async () => {
        if(userRegister.nome === "" || userRegister.rg === "" || userRegister.cpf === "" || userRegister.email === "" || userRegister.senha === "" || userRegister.confirmarSenha === "") {
            setMessage("Por favor preencha todos os campos!");
            return;
        }

        if(userRegister.senha !== userRegister.confirmarSenha) {
            setMessage("As senhas não coincidem!");
            return;
        }

        await registerFirebase();
    }

    const registerFirebase = async () => {
        await createUserWithEmailAndPassword(auth, userRegister.email, userRegister.senha).then(() => {
            var actionCodeSettings = {
                url: `${location.origin}`
            };

            sendEmailVerification(auth.currentUser as User, actionCodeSettings).then(async () => {
                await cadastrarUsuario(userRegister)
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
                    value={userRegister.nome}
                    onChange={(e) => setUserRegister({...userRegister, nome: e.target.value})}
                />
                <div className="flex">
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
                </div>

                <Input
                    label="E-mail:"
                    type="email"
                    value={userRegister.email}
                    onChange={(e) => setUserRegister({...userRegister, email: e.target.value})}
                />

                <div className="flex">
                    <Input
                        label="Senha:"
                        type="password"
                        value={userRegister.senha}
                        onChange={(e) => setUserRegister({...userRegister, senha: e.target.value})}
                    />
                    <Input
                        label="Confirmar senha:"
                        type="password"
                        value={userRegister.confirmarSenha}
                        onChange={(e) => setUserRegister({...userRegister, confirmarSenha: e.target.value})}
                    />
                </div>

                <div className="flex">
                    <div className="input-box">
                        <label htmlFor="">Nível de permissão:</label>
                        <select 
                            value={userRegister.admin ? "1" : "0"}
                            onChange={(e) => setUserRegister({...userRegister, admin: e.target.value === "1"})}
                        >
                            <option value="1">Administrador</option>
                            <option value="0">Operador</option>
                        </select>
                    </div>
                    <Input
                        label="Setor:"
                        type="text"
                        value={userRegister.setor}
                        onChange={(e) => setUserRegister({...userRegister, setor: e.target.value})}
                    />
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