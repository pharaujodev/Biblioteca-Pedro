const Emprestimo = require('../models/emprestimoModel.js');
const prisma = require('../config/prisma');
const LivroModel = require('../models/livroModel.js');

const criarErro = (mensagem, status) => {
    const error = new Error(mensagem);
    error.status = status;
    return error;
}

exports.criarEmprestimo = async (id_usuario, id_livro, data_emprestimo, data_devolucao, status) => {
    if (!id_usuario || !id_livro || !data_emprestimo || !data_devolucao) {
        throw criarErro('Todos os campos são obrigatórios', 400);
    }

    const emprestimo = await Emprestimo.criarEmprestimo(id_usuario, id_livro, data_emprestimo, data_devolucao, status);
    return emprestimo;
}
exports.listarEmprestimo = async (user, search) => {

    const emprestimos = await Emprestimo.listarEmprestimo(search);

    if (!emprestimos || emprestimos.length === 0) {
        throw criarErro('Nenhum empréstimo encontrado', 404);
    }
    if (user.role !== 'cliente') {
        return emprestimos
    }
    else {
        return emprestimos.filter(e => e.id_usuario === user.id);
    }
}
exports.deletarEmprestimo = async (id) => {

    if (!id || isNaN(id) || id <= 0) {
        throw criarErro('ID do empréstimo inválido', 400);
    }

    return await Emprestimo.deletarEmprestimo(id);
}

exports.atualizarEmprestimo = async (id, id_usuario, id_livro, data_emprestimo, data_devolucao, status) => {


    if (!id || isNaN(id) || id <= 0) {
        throw criarErro('ID do empréstimo inválido', 400);
    }

    if (!id_usuario || !id_livro || !data_emprestimo || !data_devolucao || !status) {
        throw criarErro('Todos os campos são obrigatórios', 400);
    }

    return await Emprestimo.atualizarEmprestimo(id, id_usuario, id_livro, data_emprestimo, data_devolucao, status);
}

exports.atualizarStatusEmprestimo = async (id, status) => {
    if (!id || isNaN(id) || id <= 0) {
        throw criarErro('ID do empréstimo inválido', 400);
    }
    if (!status) {
        throw criarErro('Status do empréstimo é obrigatório', 400);
    }

    return await Emprestimo.atualizarStatusEmprestimo(id, status);
}

exports.buscarEmprestimoPorId = async (id) => {
    if (!id) {
        throw criarErro('ID do empréstimo é obrigatório', 400);
    }
    if (isNaN(id)) {
        throw criarErro('ID do empréstimo deve ser um número', 400);
    }
    if (id <= 0) {
        throw criarErro('ID do empréstimo deve ser um número positivo', 400);
    }
    
    return emprestimo;
}

exports.atualizarStatusEmprestimo = async (id, status) => {
    const resultado = await prisma.$transaction(async (tx) => {
        const emprestimo = await Emprestimo.buscarEmprestimoPorId(tx, id);

        if (!emprestimo) {
            throw criarErro('Empréstimo não encontrado', 404);
        }

        if (emprestimo.status !== 'ativo') {
            throw criarErro('O empréstimo precisa estar ativo para ser devolvido.', 400);
        }

        if (status === 'devolvido') {
            await Emprestimo.atualizarStatusEmprestimo(tx, id, {
                status: 'devolvido'
            });

            const livro = await LivroModel.buscarLivroPorId(tx, emprestimo.id_livro);

            if (!livro) {
                throw criarErro('Livro não encontrado', 404);
            }

            const novaQuantidade = livro.quantidade + 1;

            await LivroModel.atualizarLivroQuantidade(tx, emprestimo.id_livro, {
                quantidade: novaQuantidade,
                disponivel: novaQuantidade > 0 ? 'disponível' : 'indisponível'
            });

            return { message: 'Empréstimo devolvido com sucesso' };
        }

        throw criarErro('Status inválido', 400);
    });

    return resultado;
};