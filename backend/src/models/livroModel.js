const prisma = require ('../config/prisma');

exports.criarLivro = async (titulo, autor, isbn, ano_publicacao, paginas, categoria, capa, disponivel, quantidade) => {
    const result = await prisma.livros.create({
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
    return result;
}

exports.listarLivros = async (search) => {
    if (search) {
        const result = await prisma.livros.findMany({
            where: {
                OR: [
                    { titulo: { contains: search, mode: 'insensitive' } },
                    { autor: { contains: search, mode: 'insensitive' } },
                    { isbn: { contains: search, mode: 'insensitive' } },
                ]
            }
        });
        return result;
    } else {
        const result = await prisma.livros.findMany();
        return result;
    }
};

exports.deletarLivro = async (id) => {
    await prisma.livros.delete({
        where: {
            id
        }
    });
}

exports.atualizarLivro = async (id, titulo, autor, isbn, ano_publicacao, paginas, categoria, capa, disponivel, quantidade) => {
    const result = await prisma.livros.update({
        where: {
            id  
        },
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
    return result;
}

exports.atualizarLivroQuantidade = async (tx, id, quantidade) => {
    const result = await tx.livros.update({
        where: {
            id
        },
        data: quantidade
    });
    return result;
}

exports.buscarLivroPorId = async (tx, id) => {
    const result = await tx.livros.findUnique({
        where: {
            id
        }
    });
    return result;
}


