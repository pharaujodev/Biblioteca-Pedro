const Livro = require('../models/livroModel.js');
const AppError = require('../utils/appError');

exports.criarLivro = async (titulo, autor, isbn, ano_publicacao, paginas, categoria, capa, disponivel, quantidade) => {
    if (!titulo || !autor || !isbn || !ano_publicacao || !paginas || !categoria || !capa) {
        throw new AppError('Todos os campos obrigatórios devem ser preenchidos', 400);
    }

    if (disponivel === undefined || quantidade === undefined) {
        throw new AppError('Disponibilidade e quantidade são obrigatórias', 400);
    }

    return await Livro.criarLivro(
        titulo,
        autor,
        isbn,
        ano_publicacao,
        paginas,
        categoria,
        capa,
        disponivel,
        quantidade
    );
};

exports.listarLivros = async (search) => {
    const livros = await Livro.listarLivros(search);

    if (!livros || livros.length === 0) {
        throw new AppError('Nenhum livro encontrado', 404);
    }

    return livros;
};

exports.deletarLivro = async (id) => {
    if (!id || Number.isNaN(id) || id <= 0) {
        throw new AppError('ID do livro inválido', 400);
    }

    await Livro.deletarLivro(id);
};

exports.atualizarLivro = async (id, titulo, autor, isbn, ano_publicacao, paginas, categoria, capa, disponivel, quantidade) => {
    if (!id || Number.isNaN(id) || id <= 0) {
        throw new AppError('ID do livro inválido', 400);
    }

    if (!titulo || !autor || !isbn || !ano_publicacao || !paginas || !categoria || !capa) {
        throw new AppError('Todos os campos obrigatórios devem ser preenchidos', 400);
    }

    if (disponivel === undefined || quantidade === undefined) {
        throw new AppError('Disponibilidade e quantidade são obrigatórias', 400);
    }

    return await Livro.atualizarLivro(
        id,
        titulo,
        autor,
        isbn,
        ano_publicacao,
        paginas,
        categoria,
        capa,
        disponivel,
        quantidade
    );
};

exports.atualizarLivroQuantidade = async (id, quantidade) => {
    if (!id || Number.isNaN(id) || id <= 0) {
        throw new AppError('ID do livro inválido', 400);
    }

    if (quantidade === undefined || Number.isNaN(quantidade) || quantidade < 0) {
        throw new AppError('Quantidade inválida', 400);
    }

    return await Livro.atualizarLivroQuantidade(id, {
        quantidade,
        disponivel: quantidade > 0
    });
};

exports.buscarLivroPorId = async (id) => {
    if (!id || Number.isNaN(id) || id <= 0) {
        throw new AppError('ID do livro inválido', 400);
    }

    const livro = await Livro.buscarLivroPorId(id);

    if (!livro) {
        throw new AppError('Livro não encontrado', 404);
    }

    return livro;
};