const prisma = require('../config/prisma');

exports.criarLivro = async (titulo, autor, isbn, ano_publicacao, paginas, categoria, capa, disponivel, quantidade) => {
    return await prisma.livros.create({
        data: {
            titulo,
            autor,
            isbn,
            ano_publicacao,
            paginas,
            categoria,
            capa,
            disponivel,
            quantidade
        }
    });
};

exports.listarLivros = async (search) => {
    if (search) {
        return await prisma.livros.findMany({
            where: {
                OR: [
                    { titulo: { contains: search, mode: 'insensitive' } },
                    { autor: { contains: search, mode: 'insensitive' } },
                    { isbn: { contains: search, mode: 'insensitive' } }
                ]
            }
        });
    }

    return await prisma.livros.findMany();
};

exports.deletarLivro = async (id) => {
    await prisma.livros.delete({
        where: { id }
    });
};

exports.atualizarLivro = async (id, titulo, autor, isbn, ano_publicacao, paginas, categoria, capa, disponivel, quantidade) => {
    return await prisma.livros.update({
        where: { id },
        data: {
            titulo,
            autor,
            isbn,
            ano_publicacao,
            paginas,
            categoria,
            capa,
            disponivel,
            quantidade
        }
    });
};

exports.atualizarLivroQuantidade = async (txOrId, maybeId, maybeQuantidade) => {
    const tx = typeof maybeQuantidade === 'undefined' ? prisma : txOrId;
    const id = typeof maybeQuantidade === 'undefined' ? txOrId : maybeId;
    const quantidade = typeof maybeQuantidade === 'undefined' ? maybeId : maybeQuantidade;

    return await tx.livros.update({
        where: { id },
        data: quantidade
    });
};

exports.buscarLivroPorId = async (txOrId, maybeId) => {
    const tx = typeof maybeId === 'undefined' ? prisma : txOrId;
    const id = typeof maybeId === 'undefined' ? txOrId : maybeId;

    return await tx.livros.findUnique({
        where: { id }
    });
};