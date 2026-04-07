const solicitacaoemprestimo = require('../models/solicitacaoEmprestimoModel');
const prisma = require('../config/prisma');
const emprestimoModel = require('../models/emprestimoModel');
const livroModel = require('../models/livroModel');


const criarErro = (mensagem, status) => {
    const error = new Error(mensagem);
    error.status = status;
    return error;
}

exports.criarSolicitacaoEmprestimo = async (id_usuario, id_livro, status) => {
    if (!id_usuario || !id_livro) {
        throw criarErro('Todos os campos são obrigatórios', 400);
    }
    const solicitacao = await solicitacaoemprestimo.criarSolicitacaoEmprestimo(id_usuario, id_livro, status);
    return solicitacao;
}

exports.listarSolicitacaoEmprestimo = async () => {
    const solicitacoes = await solicitacaoemprestimo.listarSolicitacaoEmprestimo();

    if(!solicitacoes || solicitacoes.length === 0) {
        throw criarErro('Nenhuma solicitação de empréstimo encontrada', 404);
    }

    else{
        return solicitacoes;
    }
}

exports.listarSolicitacaoEmprestimoCliente = async (userId) => {
    const solicitacoes = await solicitacaoemprestimo.listarSolicitacaoEmprestimoCliente(userId);
    if(!solicitacoes || solicitacoes.length === 0) {
        throw criarErro('Nenhuma solicitação de empréstimo encontrada', 404);
    }

    else{
        return solicitacoes;
    }
}

exports.deletarSolicitacaoEmprestimo = async (id) => {
    if (!id || isNaN(id) || id <= 0) {
        throw criarErro('ID inválido', 400);
    }

    await solicitacaoemprestimo.deletarSolicitacaoEmprestimo(id);
}

exports.atualizarSolicitacaoEmprestimo = async (id, status) => {
    return await prisma.$transaction(async (tx) => {
        const solicitacao = await solicitacaoemprestimo.buscarSolicitacaoEmprestimoPorId(tx, id);

        if (!solicitacao) {
            throw criarErro('Solicitação de empréstimo não encontrada', 404);
        }

        if (solicitacao.status !== 'pendente') {
            throw criarErro('Apenas solicitações pendentes podem ser atualizadas', 400);
        }

        if (status === 'rejeitado') {
            await solicitacaoemprestimo.deletarSolicitacaoEmprestimo(tx, id);
            return await solicitacaoemprestimo.atualizarSolicitacaoEmprestimo(tx, id, {
                status: 'rejeitado'
            });
        }

        if (status === 'aprovado') {
            const livro = await livroModel.buscarLivroPorId(tx, solicitacao.id_livro);

            if (!livro) {
                throw criarErro('Livro não encontrado', 404);
            }

            if (livro.quantidade <= 0) {
                throw criarErro('Livro indisponível para empréstimo', 400);
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

            await solicitacaoemprestimo.atualizarSolicitacaoEmprestimo(tx, id, {
                status: 'aprovado'
            });


            await livroModel.atualizarLivroQuantidade(tx, solicitacao.id_livro, {
                quantidade: livro.quantidade - 1,
                disponivel: livro.disponivel ? 'indisponível' : 'disponível'
            });

            await solicitacaoemprestimo.deletarSolicitacaoEmprestimo(tx, id);

            return {message: 'Solicitação de empréstimo aprovada e empréstimo criado com sucesso' };
        }
        throw criarErro('Status inválido. O status deve ser "aprovado" ou "rejeitado".', 400);
    });
};