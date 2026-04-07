const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');

exports.criarUsuario = async (nome, email, senha, role = 'cliente') => {
    const hashSenha = await bcrypt.hash(senha, 10);
    const result = await prisma.usuarios.create({
        data: {
            nome,
            email,
            senha: hashSenha,
            role
        }
    });
    return result;
}

exports.listarUsuario = async (search) => {
    if(search){
        const result = await prisma.usuarios.findMany({
            where: {
                OR: [
                    { nome: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } }
                ]
            }
        });
        return result;
    }
    else{
        const result = await prisma.usuarios.findMany();
        return result;
    }
}

exports.deletarUsuario = async (id) => {
    await prisma.usuarios.delete({
        where: {
            id
        }
    });
}

exports.atualizarUsuario = async (id, nome, email, senha, role = 'cliente') => {
    const data = {
        nome,
        email,
        role
    };

    if (senha) {
        data.senha = await bcrypt.hash(senha, 10);
    }

    const result = await prisma.usuarios.update({
        where: {
            id
        },
        data
    });

    return result;
}
exports.buscarUsuarioPorId = async (id) => {
    const result = await prisma.usuarios.findUnique({
        where: {
            id
        }
    });
    return result;
}

exports.buscarUsuarioPorEmail = async (email) => {
    const result = await prisma.usuarios.findUnique({
        where: {
            email
        }
    });
    return result;
}

