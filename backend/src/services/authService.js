const Usuario = require('../models/usuarioModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');

exports.login = async (email, senha) => {
    if (!email || !senha) {
        throw new AppError('Email e senha são obrigatórios', 400);
    }

    const user = await Usuario.buscarUsuarioPorEmail(email);

    if (!user) {
        throw new AppError('Credenciais inválidas', 401);
    }

    const senhaValida = await bcrypt.compare(senha, user.senha);

    if (!senhaValida) {
        throw new AppError('Credenciais inválidas', 401);
    }

    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return {
        token,
        usuario: {
            id: user.id,
            nome: user.nome,
            email: user.email,
            role: user.role
        }
    };
};


