import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        const tokenExpiration = localStorage.getItem("tokenExpiration");
        
        if (!tokenExpiration || Date.now() > parseInt(tokenExpiration)) {
            navigate("/");
        } else {
            console.log("Token válido, carregando conteúdo protegido...");
        }        
    }, []);

    return (
        <section className="sheets-view">
            <div className="logo-sheets">
                <img src="./railvision-logo.png" alt="Logo do railvision" />
                <span>Railvision</span>
            </div>
            
            <iframe src="https://docs.google.com/spreadsheets/d/e/2PACX-1vT4nZpxptk6FUP5oIWfvLEdhAiPi9-l1TFiSZSxGTDHOT6PID8T8fh6mxCqPGFOvsvOpnlE7SJ4NOKn/pubhtml?widget=true&amp;headers=false"></iframe>
            <a className="btn-edit-sheet" href="https://docs.google.com/spreadsheets/d/1N7Kc3wga8H-Hv_PKxgu8hVTxsPwhxHVcEQytwHEKyQ8/edit?gid=2106211476#gid=2106211476">Editar dados</a>
        </section>
    );
}