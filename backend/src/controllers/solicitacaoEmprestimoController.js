
const solicitacaoemprestimo = require('../services/solicitacaoEmprestimoService');

exports.criarSolicitacaoEmprestimo = async (req, res, next) => {
    try {
        const { id_livro } = req.body;
        const solicitacaoEmprestimo = await solicitacaoemprestimo.criarSolicitacaoEmprestimo(
            id_usuario = req.user.id,
            Number(id_livro)
        );
        res.status(201).json(solicitacaoEmprestimo);
    } catch (error) {
        next(error);
    }   
};

exports.listarSolicitacaoEmprestimo = async (req, res, next) => {

    try {
        const solicitacaoEmprestimos = await solicitacaoemprestimo.listarSolicitacaoEmprestimo();
        res.status(200).json(solicitacaoEmprestimos);
    } catch (error) {
        next(error);
    }
};

exports.listarSolicitacaoEmprestimoCliente = async (req, res, next) => {

    const userId = req.user.id;

    try {
        const solicitacaoEmprestimos = await solicitacaoemprestimo.listarSolicitacaoEmprestimoCliente(userId);
        res.status(200).json(solicitacaoEmprestimos);
    } catch (error) {
        next(error);
    }   
};

exports.deletarSolicitacaoEmprestimo = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        await solicitacaoemprestimo.deletarSolicitacaoEmprestimo(id);
        res.status(200).json({ message: 'Solicitação de empréstimo deletada com sucesso' });
    } catch (error) {
        next(error);
    }
};

exports.atualizarSolicitacaoEmprestimo = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const { status } = req.body;
        const solicitacaoEmprestimo = await solicitacaoemprestimo.atualizarSolicitacaoEmprestimo(id, status);
        res.status(200).json(solicitacaoEmprestimo);
    } catch (error) {
        next(error);
    }   
};

