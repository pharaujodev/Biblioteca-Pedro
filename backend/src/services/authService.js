const Usuario = require('../models/usuarioModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const criarErro = (mensagem, status) => {
    const error = new Error(mensagem);
    error.status = status;
    return error;
}

exports.login = async (email, senha) => {
    if (!email || !senha) {
        throw criarErro('Email e senha são obrigatórios', 400);
    }
    const user = await Usuario.buscarUsuarioPorEmail(email);
    if (!user) {
        throw criarErro('Credenciais inválidas', 401);
    }

    const senhaValida = await bcrypt.compare(senha, user.senha);

    if (!senhaValida) {
        throw criarErro('Credenciais inválidas', 401);
    }
    const token = jwt.sign({ id: user.id, role: user.role }, 
        process.env.JWT_SECRET, { 
        expiresIn: process.env.JWT_EXPIRES_IN 
        }
    );
    return { token, usuario: { id: user.id, nome: user.nome, email: user.email, role: user.role } };
}




