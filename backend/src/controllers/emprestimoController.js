const EmprestimoService = require('../services/emprestimoService'); 

exports.criarEmprestimo = async (req, res, next) => { 
    try {
        const { id_usuario, id_livro, data_emprestimo, data_devolucao, status } = req.body;
        const emprestimo = await EmprestimoService.criarEmprestimo(
            Number(id_usuario),
            Number(id_livro),
            new Date(data_emprestimo),
            new Date(data_devolucao),
            status
        );
        res.status(201).json(emprestimo);
    } catch (error) { 
        next(error); 
    }   
};

exports.listarEmprestimo = async (req, res, next) => {
    try {
        const {search} = req.query;
        const user = req.user;
        const emprestimos = await EmprestimoService.listarEmprestimo(user, search);
        res.json(emprestimos);
    } catch (error) {
        next(error);
    }
};

exports.deletarEmprestimo = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        await EmprestimoService.deletarEmprestimo(id);
        res.status(200).json({ message: 'Empréstimo deletado com sucesso' });
    } catch (error) {
        next(error);
    }
};

exports.atualizarEmprestimo = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const { id_usuario, id_livro, data_emprestimo, data_devolucao, status } = req.body;
        const emprestimo = await EmprestimoService.atualizarEmprestimo(
            id, Number(id_usuario), Number(id_livro), new Date(data_emprestimo), new Date(data_devolucao), status
        );
        res.json(emprestimo);
    } catch (error) {
        next(error);
    }
};

exports.atualizarStatusEmprestimo = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const { status } = req.body;
        const emprestimo = await EmprestimoService.atualizarStatusEmprestimo(id, status);
        res.json(emprestimo);
    } catch (error) {
        next(error);
        }
};

exports.buscarEmprestimoPorId = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const emprestimo = await EmprestimoService.buscarEmprestimoPorId(id);
        res.json(emprestimo);
    } catch (error) {
        next(error);
    }
};

exports.devolverEmprestimo = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const emprestimo = await EmprestimoService.devolverEmprestimo(id);
        res.json(emprestimo);
    } catch (error) {
        next(error);
    }
};