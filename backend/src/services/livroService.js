const Livro = require('../models/livroModel.js');

const criarErro = (mensagem, status) => {
    const error = new Error(mensagem);
    error.status = status;
    return error;
};

exports.criarLivro = async (titulo, autor, isbn, ano_publicacao, paginas, categoria, capa, disponivel, quantidade) => {
    if (!titulo || !autor || !isbn || !ano_publicacao || !paginas || !categoria || !capa || !disponivel || !quantidade) {
        throw criarErro('Todos os campos são obrigatórios', 400);    
    }

    return await Livro.criarLivro(titulo, autor, isbn, ano_publicacao, paginas, categoria, capa, disponivel, quantidade);
};

exports.listarLivros = async (search) => {
    const livros = await Livro.listarLivros(search);
    if (!livros || livros.length === 0) {
        throw criarErro('Nenhum livro encontrado', 404);
    }
    return livros; 
};

exports.deletarLivro = async (id) => {
    if (!id || isNaN(id) || id <= 0) {
        throw criarErro('ID do livro inválido', 400);
    }

    return await Livro.deletarLivro(id);
};

exports.atualizarLivro = async (id, titulo, autor, isbn, ano_publicacao, paginas, categoria, capa, disponivel, quantidade) => {
    if (!id || isNaN(id) || id <= 0) {
        throw criarErro('ID do livro inválido', 400);
    }
    if (!titulo || !autor || !isbn || !ano_publicacao || !paginas || !categoria || !capa || !disponivel || !quantidade) {
        throw criarErro('Todos os campos são obrigatórios', 400);
    }
    
    return await Livro.atualizarLivro(id, titulo, autor, isbn, ano_publicacao, paginas, categoria, capa, disponivel, quantidade);
};

exports.atualizarLivroQuantidade = async (id, quantidade) => {

    if (!id || isNaN(id) || id <= 0) {
        throw criarErro('ID do livro inválido', 400);
    }
    if (quantidade === undefined || isNaN(quantidade) || quantidade < 0) {
        throw criarErro('Quantidade inválida', 400);
    }   

    return await Livro.atualizarLivroQuantidade(id, quantidade);
}

exports.buscarLivroPorId = async (id) => {
    if (!id || isNaN(id) || id <= 0) {
        throw criarErro('ID do livro inválido', 400);
    }

    return livro; 
};