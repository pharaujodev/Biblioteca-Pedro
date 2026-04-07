const Usuario = require('../models/usuarioModel');
const bcrypt = require('bcryptjs');

const criarErro = (mensagem, status) => {
    const error = new Error(mensagem);
    error.status = status;
    return error;
}

exports.criarUsuario = async (nome, email, senha, role = 'cliente') => {
    if (!nome || !email || !senha) {
        throw criarErro('Nome, email e senha são obrigatórios', 400);
    }
    if (senha.length < 6) {
        throw criarErro('A senha deve conter pelo menos 6 caracteres', 400);
    }

    if (role !== 'cliente' && role !== 'admin') {
        throw criarErro('Role deve ser "cliente" ou "admin"', 400);
    }

    const exists = await Usuario.buscarUsuarioPorEmail(email);

    if (exists) {
        throw criarErro('Email já cadastrado', 409);
    }

    return await Usuario.criarUsuario(nome, email, senha, role);
};

exports.listarUsuario = async (search) => {
    const usuarios = await Usuario.listarUsuario(search);
    if (!usuarios || usuarios.length === 0) {
        throw criarErro('Nenhum usuário encontrado', 404);
    }
    return usuarios;
};

exports.deletarUsuario = async (id) => {
    if (!id || isNaN(id) || id <= 0) {
        throw criarErro('ID do usuário inválido', 400);
    }

    const usuario = await Usuario.buscarUsuarioPorId(id);
    if (!usuario) {
        throw criarErro('Usuário não encontrado', 404);
    }

    return await Usuario.deletarUsuario(id);
};

exports.atualizarUsuario = async (id, nome, email, senha, role = 'cliente') => {

    if (!id || isNaN(id) || id <= 0) {
        throw criarErro('ID do usuário inválido', 400);
    }
    if (!nome || !email || !senha) {
        throw criarErro('Nome, email e senha são obrigatórios', 400);
    }
    if (senha.length < 6) {
        throw criarErro('A senha deve conter pelo menos 6 caracteres', 400);
    }

    const usuario = await Usuario.buscarUsuarioPorId(id);

    if (!usuario) {
        throw criarErro('Usuário não encontrado', 404);
    }

    if (role !== 'cliente' && role !== 'admin') {
        throw criarErro('Role deve ser "cliente" ou "admin"', 400);
    }

    return await Usuario.atualizarUsuario(id, nome, email, senha, role);
};

exports.buscarUsuarioPorId = async (id) => {
    if (!id || isNaN(id) || id <= 0) {
        throw criarErro('ID do usuário inválido', 400);
    }

    const usuario = await Usuario.buscarUsuarioPorId(id);

    if (!usuario) {
        throw criarErro('Usuário não encontrado', 404);
    }

    return usuario;
};