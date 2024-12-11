export type UsuarioCadastro = {
    id_empresa: number;
    nome: string;
    email: string;
    sexo: string;
    rg: string;
    cpf: string;
    admin: boolean;
    setor: string;
    senha: string;
    confirmarSenha: string;
};

export type UsuarioRetorno = {
    id_empresa: number;
    nome: string;
    admin: boolean;
    setor: string;
};