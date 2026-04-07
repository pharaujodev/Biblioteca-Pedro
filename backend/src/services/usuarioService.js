/**
 * SRP - Single Responsibility Principle
 * Este service é responsável apenas pela regra de negócio
 * (validação e hash de senha), sem lidar com persistência direta.
 */

const Usuario = require('../models/usuarioModel');
const bcrypt = require('bcryptjs');
const AppError = require('../utils/appError');

exports.criarUsuario = async (nome, email, senha, role = 'cliente') => {
    if (!nome || !email || !senha) {
        throw new AppError('Nome, email e senha são obrigatórios', 400);
    }

    if (senha.length < 6) {
        throw new AppError('A senha deve conter pelo menos 6 caracteres', 400);
    }

    if (role !== 'cliente' && role !== 'admin') {
        throw new AppError('Role deve ser "cliente" ou "admin"', 400);
    }

    const exists = await Usuario.buscarUsuarioPorEmail(email);

    if (exists) {
        throw new AppError('Email já cadastrado', 409);
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    return await Usuario.criarUsuario(nome, email, senhaHash, role);
};

exports.listarUsuario = async (search) => {
    const usuarios = await Usuario.listarUsuario(search);

    if (!usuarios || usuarios.length === 0) {
        throw new AppError('Nenhum usuário encontrado', 404);
    }

    return usuarios;
};

exports.deletarUsuario = async (id) => {
    if (!id || Number.isNaN(id) || id <= 0) {
        throw new AppError('ID do usuário inválido', 400);
    }

    const usuario = await Usuario.buscarUsuarioPorId(id);

    if (!usuario) {
        throw new AppError('Usuário não encontrado', 404);
    }

    await Usuario.deletarUsuario(id);
};

exports.atualizarUsuario = async (id, nome, email, senha, role = 'cliente') => {
    if (!id || Number.isNaN(id) || id <= 0) {
        throw new AppError('ID do usuário inválido', 400);
    }

    if (!nome || !email || !senha) {
        throw new AppError('Nome, email e senha são obrigatórios', 400);
    }

    if (senha.length < 6) {
        throw new AppError('A senha deve conter pelo menos 6 caracteres', 400);
    }

    if (role !== 'cliente' && role !== 'admin') {
        throw new AppError('Role deve ser "cliente" ou "admin"', 400);
    }

    const usuario = await Usuario.buscarUsuarioPorId(id);

    if (!usuario) {
        throw new AppError('Usuário não encontrado', 404);
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    return await Usuario.atualizarUsuario(id, nome, email, senhaHash, role);
};

exports.buscarUsuarioPorId = async (id) => {
    if (!id || Number.isNaN(id) || id <= 0) {
        throw new AppError('ID do usuário inválido', 400);
    }

    const usuario = await Usuario.buscarUsuarioPorId(id);

    if (!usuario) {
        throw new AppError('Usuário não encontrado', 404);
    }

    return usuario;
};