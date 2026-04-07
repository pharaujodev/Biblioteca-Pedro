const Emprestimo = require('../models/emprestimoModel.js');
const prisma = require('../config/prisma');
const LivroModel = require('../models/livroModel.js');
const AppError = require('../utils/appError');

exports.criarEmprestimo = async (id_usuario, id_livro, data_emprestimo, data_devolucao, status) => {
    if (!id_usuario || !id_livro || !data_emprestimo || !data_devolucao || !status) {
        throw new AppError('Todos os campos são obrigatórios', 400);
    }

    return await Emprestimo.criarEmprestimo(
        id_usuario,
        id_livro,
        data_emprestimo,
        data_devolucao,
        status
    );
};

exports.listarEmprestimo = async (user, search) => {
    const emprestimos = await Emprestimo.listarEmprestimo(search);

    if (!emprestimos || emprestimos.length === 0) {
        throw new AppError('Nenhum empréstimo encontrado', 404);
    }

    return emprestimos;
};

exports.deletarEmprestimo = async (id) => {
    if (!id || Number.isNaN(id) || id <= 0) {
        throw new AppError('ID do empréstimo inválido', 400);
    }

    await Emprestimo.deletarEmprestimo(id);
};

exports.atualizarEmprestimo = async (id, id_usuario, id_livro, data_emprestimo, data_devolucao, status) => {
    if (!id || Number.isNaN(id) || id <= 0) {
        throw new AppError('ID do empréstimo inválido', 400);
    }

    if (!id_usuario || !id_livro || !data_emprestimo || !data_devolucao || !status) {
        throw new AppError('Todos os campos são obrigatórios', 400);
    }

    return await Emprestimo.atualizarEmprestimo(
        id,
        id_usuario,
        id_livro,
        data_emprestimo,
        data_devolucao,
        status
    );
};

exports.buscarEmprestimoPorId = async (id) => {
    if (!id || Number.isNaN(id) || id <= 0) {
        throw new AppError('ID do empréstimo inválido', 400);
    }

    const emprestimo = await Emprestimo.buscarEmprestimoPorId(id);

    if (!emprestimo) {
        throw new AppError('Empréstimo não encontrado', 404);
    }

    return emprestimo;
};

exports.atualizarStatusEmprestimo = async (id, status) => {
    if (!id || Number.isNaN(id) || id <= 0) {
        throw new AppError('ID do empréstimo inválido', 400);
    }

    if (!status) {
        throw new AppError('Status do empréstimo é obrigatório', 400);
    }

    return await prisma.$transaction(async (tx) => {
        const emprestimo = await Emprestimo.buscarEmprestimoPorId(tx, id);

        if (!emprestimo) {
            throw new AppError('Empréstimo não encontrado', 404);
        }

        if (emprestimo.status !== 'ativo') {
            throw new AppError('O empréstimo precisa estar ativo para ser devolvido.', 400);
        }

        if (status !== 'devolvido') {
            throw new AppError('Status inválido', 400);
        }

        await Emprestimo.atualizarStatusEmprestimo(tx, id, {
            status: 'devolvido'
        });

        const livro = await LivroModel.buscarLivroPorId(tx, emprestimo.id_livro);

        if (!livro) {
            throw new AppError('Livro não encontrado', 404);
        }

        const novaQuantidade = livro.quantidade + 1;

        await LivroModel.atualizarLivroQuantidade(tx, emprestimo.id_livro, {
            quantidade: novaQuantidade,
            disponivel: novaQuantidade > 0 ? 'disponível' : 'indisponível'
        });

        return { message: 'Empréstimo devolvido com sucesso' };
    });
};

exports.devolverEmprestimo = async (id) => {
    return await exports.atualizarStatusEmprestimo(id, 'devolvido');
};

exports.listarEmprestimoCliente = async (user) => {
    const emprestimos = await Emprestimo.listarEmprestimo(user);

    if (!emprestimos || emprestimos.length === 0) {
        throw new AppError('Nenhum empréstimo encontrado', 404);
    }

    return emprestimos;
};