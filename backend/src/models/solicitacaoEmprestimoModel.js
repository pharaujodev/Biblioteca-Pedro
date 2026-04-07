const prisma = require('../config/prisma');

exports.criarSolicitacaoEmprestimo = async (id_usuario, id_livro, status) => {
    const result = await prisma.solicitacaoemprestimo.create({
        data: {
            id_usuario,
            id_livro,
            status
        }
    });
    return result;
}

exports.listarSolicitacaoEmprestimoCliente = async (userId) => {
    const result = await prisma.solicitacaoemprestimo.findMany({

        where: {
            id_usuario: Number(userId)
        },

        select : {
            data_solicitacao: true,
            status: true,
            livros: {
                select: {
                    titulo: true
                }
            },
        },
        orderBy: {
            data_solicitacao: 'desc'
        }
    })
    return result;
}

exports.listarSolicitacaoEmprestimo = async () => {

    const result = await prisma.solicitacaoemprestimo.findMany({
        select : {
            id: true,
            data_solicitacao: true,
            status: true,
            id_usuario: true,
            id_livro: true,
            livros: {
                select: {
                    titulo: true
                }            },
            usuarios: {
                select: {
                    nome: true
                } 
            }
        },
        orderBy: {
            data_solicitacao: 'desc'
        }
    })
    return result;
}

exports.deletarSolicitacaoEmprestimo = async (tx, id) => {
    await tx.solicitacaoemprestimo.delete({
        where: {
            id: Number(id)
        }
    });
}

exports.atualizarSolicitacaoEmprestimo = async (tx, id, status) => {
    const result = await tx.solicitacaoemprestimo.update({
        where: {
            id: Number(id)
        },
        data: status
    });
    return result;
}

exports.buscarSolicitacaoEmprestimoPorId = async (tx, id) => {
    const result = await tx.solicitacaoemprestimo.findUnique({
        where: {
            id
        }
    });
    return result;
}

        



