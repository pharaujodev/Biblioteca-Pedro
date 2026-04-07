/**
 * SRP - Single Responsibility Principle
 * Este model é responsável apenas pelo acesso ao banco de dados.
 */

const prisma = require('../config/prisma');

exports.criarUsuario = async (nome, email, senha, role = 'cliente') => {
    return await prisma.usuarios.create({
        data: {
            nome,
            email,
            senha,
            role
        }
    });
};

exports.listarUsuario = async (search) => {
    if (search) {
        return await prisma.usuarios.findMany({
            where: {
                OR: [
                    { nome: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } }
                ]
            }
        });
    }

    return await prisma.usuarios.findMany();
};

exports.deletarUsuario = async (id) => {
    await prisma.usuarios.delete({
        where: { id }
    });
};

exports.atualizarUsuario = async (id, nome, email, senha, role = 'cliente') => {
    const data = {
        nome,
        email,
        role
    };

    if (senha) {
        data.senha = senha;
    }

    return await prisma.usuarios.update({
        where: { id },
        data
    });
};

exports.buscarUsuarioPorId = async (id) => {
    return await prisma.usuarios.findUnique({
        where: { id }
    });
};

exports.buscarUsuarioPorEmail = async (email) => {
    return await prisma.usuarios.findUnique({
        where: { email }
    });
};