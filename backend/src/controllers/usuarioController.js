const UsuarioService = require('../services/usuarioService');

exports.criarUsuario = async (req, res, next) => {
    try {
        const { nome, email, senha, role } = req.body;
        const usuario = await UsuarioService.criarUsuario(nome, email, senha, role);
        res.status(201).json(usuario);
    } catch (error) {
        next(error);
    }   
}

exports.listarUsuario = async (req, res, next) => {
    const { search } = req.query;
    try {
        const usuarios = await UsuarioService.listarUsuario(search);
        res.json(usuarios);
    } catch (error) {
        next(error);
    }
}

exports.deletarUsuario = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        await UsuarioService.deletarUsuario(id);
        res.status(200).json({ message: 'Usuário deletado com sucesso!' });
    }   catch (error) {
        next(error);
    }
}

exports.atualizarUsuario = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const { nome, email, senha, role } = req.body;
        const usuario = await UsuarioService.atualizarUsuario(id, nome, email, senha, role);
        res.json(usuario);
    } catch (error) {
        next(error);
    }
}

exports.buscarUsuarioPorId = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const usuario = await UsuarioService.buscarUsuarioPorId(id);
        if (usuario) {
            res.json(usuario);
        } else {
            res.status(404).json({ message: 'Usuário não encontrado' });
        }
    } catch (error) {
        next(error);
    }
}