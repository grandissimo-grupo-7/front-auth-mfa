import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getInfoUsuario } from "../services/services";
import { UsuarioRetorno } from "../interfaces/interfaces";

export default function Dashboard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState<UsuarioRetorno | undefined>();

    const getUserInfo = async () => {
        const resp = await getInfoUsuario({ email: sessionStorage.getItem("email") || "" });
        setLoading(false);

        setUserInfo(resp);
    }

    const sheetInfo = {
        "cliente": {
            iframe: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRyBewgptd9lxC3UJmsiSCwCTWyt5T3CqU6DiMLRUMpx7RQch73KSozDL-2uqaFDRPmEscc-v5RGQKA/pubhtml?widget=true&amp;headers=false",
            btn_edit: "https://docs.google.com/spreadsheets/d/1j07tSqyRq-oPgF2T1AEnzMDr1vMW1Zg7WYvCgQVQtHE/edit?gid=665344986#gid=665344986"
        },
        "railvision": {
            iframe: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTYRT6H39JLostaBFtznPu3cqAaOrRxH8Cgt7XzTnLPWR_PMeUHNU2Gme7D34LdxXlbQQzaT07gmnql/pubhtml?widget=true&amp;headers=false",
            btn_edit: "https://docs.google.com/spreadsheets/d/1PmmmWM7a_QnmZlyfYvbQRWFXepIYjCPfGNtmGQVO6P8/edit?gid=644517001#gid=644517001"
        }
    }

    useEffect(() => {
        const tokenExpiration = localStorage.getItem("tokenExpiration");
        
        if (!sessionStorage.getItem("email") || !tokenExpiration || Date.now() > parseInt(tokenExpiration)) {
            navigate("/");
        } else {
            getUserInfo();
            console.log("Token válido, carregando conteúdo protegido...");
        }
    }, []);

    return (
        loading ?
            (
                <h1>Carregando...</h1>
            ) :
            (
                <section className="sheets-view">
                    <div className="logo-sheets">
                        <img src="./railvision-logo.png" alt="Logo do railvision" />
                        <span>Railvision</span>
                    </div>

                    <div className="head">
                        <p>Olá, {userInfo?.nome}!</p>
                        <p>Setor: {userInfo?.setor}</p>
                    </div>
                    
                    {
                        userInfo?.id_empresa === 3 ?
                        (
                            <iframe src={sheetInfo.railvision.iframe}></iframe>
                        ) :
                        (
                            <iframe src={sheetInfo.cliente.iframe}></iframe>
                        )
                    }

                    {
                        userInfo?.admin ?
                        (
                            <a className="btn-edit-sheet" href={userInfo.id_empresa === 3 ? sheetInfo.railvision.btn_edit : sheetInfo.railvision.btn_edit}>Editar dados</a>
                        ) : 
                        (
                            <div></div>
                        )
                    }
                </section>
            )

    );
}