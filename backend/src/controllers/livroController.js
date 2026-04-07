const LivroService = require('../services/livroService.js');

exports.criarLivro = async (req, res, next) => { 
    try {
        const { titulo, autor, isbn, ano_publicacao, paginas, categoria, capa, disponivel, quantidade } = req.body;
        const livro = await LivroService.criarLivro(titulo, autor, isbn, Number(ano_publicacao), Number(paginas), categoria, capa, disponivel, Number(quantidade));
        res.status(201).json(livro);
    } catch (error) { 
        next(error);
    }
};

exports.listarLivro = async (req, res, next) => { 
    try {
        const { search } = req.query;
        const livros = await LivroService.listarLivros(search);
        res.status(200).json(livros);
    } catch (error) {
        next(error);
    }
};

exports.deletarLivro = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        await LivroService.deletarLivro(id);
        res.status(200).json({ message: 'Livro deletado com sucesso' });
    } catch (error) {
        next(error);
    }
};

exports.atualizarLivro = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const { titulo, autor, isbn, ano_publicacao, paginas, categoria, capa, disponivel, quantidade } = req.body;
        const livro = await LivroService.atualizarLivro(id, titulo, autor, isbn, Number(ano_publicacao), Number(paginas), categoria, capa, disponivel, Number(quantidade));
        res.status(200).json(livro);
    } catch (error) {
        next(error);
    }
};

exports.buscarLivroPorId = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const livro = await LivroService.buscarLivroPorId(id);
        if (livro) {
            res.status(200).json(livro);
        } else {
            res.status(404).json({ message: 'Livro não encontrado' });
        }
    } catch (error) {
        next(error);
    }
};

exports.atualizarLivroQuantidade = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const { quantidade } = req.body;
        const livro = await LivroService.atualizarLivroQuantidade(id, Number(quantidade));
        res.status(200).json(livro);
    } catch (error) {
        next(error);
    }
};