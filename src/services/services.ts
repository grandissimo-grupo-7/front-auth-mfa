import { UsuarioCadastro, UsuarioRetorno } from "../interfaces/interfaces";

const url = `${window.location.origin}`;

export const getInfoUsuario = async ({email} : {email: string}) : Promise<UsuarioRetorno> => {
    const resp = await fetch(`${url}/api/funcionario_info?email=${email}`);
    const json = await resp.json();
    return json;
};

export const cadastrarUsuario = async (dados: UsuarioCadastro) => {
    const resp = await fetch(`${url}/api/cadastrar_usuario`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "id_empresa": dados.id_empresa,
            "nome": dados.nome,
            "email": dados.email,
            "sexo": dados.sexo,
            "rg": dados.rg,
            "cpf": dados.cpf,
            "admin": dados.admin,
            "setor": dados.setor,
        })
    });

    const json = await resp.json();
    return json;
};