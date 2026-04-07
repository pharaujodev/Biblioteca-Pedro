const solicitacaoemprestimo = require('../models/solicitacaoEmprestimoModel');
const prisma = require('../config/prisma');
const emprestimoModel = require('../models/emprestimoModel');
const livroModel = require('../models/livroModel');
const AppError = require('../utils/appError');

exports.criarSolicitacaoEmprestimo = async (id_usuario, id_livro, status = 'pendente') => {
    if (!id_usuario || !id_livro) {
        throw new AppError('Todos os campos são obrigatórios', 400);
    }

    return await solicitacaoemprestimo.criarSolicitacaoEmprestimo(id_usuario, id_livro, status);
};

exports.listarSolicitacaoEmprestimo = async () => {
    const solicitacoes = await solicitacaoemprestimo.listarSolicitacaoEmprestimo();

    if (!solicitacoes || solicitacoes.length === 0) {
        throw new AppError('Nenhuma solicitação de empréstimo encontrada', 404);
    }

    return solicitacoes;
};

exports.listarSolicitacaoEmprestimoCliente = async (userId) => {
    const solicitacoes = await solicitacaoemprestimo.listarSolicitacaoEmprestimoCliente(userId);

    if (!solicitacoes || solicitacoes.length === 0) {
        throw new AppError('Nenhuma solicitação de empréstimo encontrada', 404);
    }

    return solicitacoes;
};

exports.deletarSolicitacaoEmprestimo = async (id) => {
    if (!id || Number.isNaN(id) || id <= 0) {
        throw new AppError('ID inválido', 400);
    }

    await solicitacaoemprestimo.deletarSolicitacaoEmprestimo(id);
};

exports.atualizarSolicitacaoEmprestimo = async (id, status) => {
    if (!id || Number.isNaN(id) || id <= 0) {
        throw new AppError('ID inválido', 400);
    }

    if (!status) {
        throw new AppError('Status é obrigatório', 400);
    }

    return await prisma.$transaction(async (tx) => {
        const solicitacao = await solicitacaoemprestimo.buscarSolicitacaoEmprestimoPorId(tx, id);

        if (!solicitacao) {
            throw new AppError('Solicitação de empréstimo não encontrada', 404);
        }

        if (solicitacao.status !== 'pendente') {
            throw new AppError('Apenas solicitações pendentes podem ser atualizadas', 400);
        }

        if (status === 'rejeitado') {
            await this.deletarSolicitacaoEmprestimo(tx, id);
            return {
                message: 'Solicitação de empréstimo rejeitada e removida com sucesso'
            };
        }

        if (status === 'aprovado') {
            const livro = await livroModel.buscarLivroPorId(tx, solicitacao.id_livro);

            if (!livro) {
                throw new AppError('Livro não encontrado', 404);
            }

            if (livro.quantidade <= 0) {
                throw new AppError('Livro indisponível para empréstimo', 400);
            }

            const hoje = new Date();
            const dataDevolucao = new Date();
            dataDevolucao.setDate(hoje.getDate() + 7);

            await emprestimoModel.criarEmprestimo(
                tx,
                solicitacao.id_usuario,
                solicitacao.id_livro,
                hoje,
                dataDevolucao,
                'ativo'
            );

            const novaQuantidade = livro.quantidade - 1;

            await livroModel.atualizarLivroQuantidade(tx, solicitacao.id_livro, {
                quantidade: novaQuantidade,
                disponivel: novaQuantidade > 0 ? 'disponível' : 'indisponível'
            });

            await solicitacaoemprestimo.deletarSolicitacaoEmprestimo(tx, id);

            return {
                message: 'Solicitação aprovada, empréstimo criado e solicitação removida com sucesso'
            };
        }

        throw new AppError('Status inválido. O status deve ser "aprovado" ou "rejeitado".', 400);
    });
};