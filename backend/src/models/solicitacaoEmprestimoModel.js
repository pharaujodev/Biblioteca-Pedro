const prisma = require('../config/prisma');

exports.criarSolicitacaoEmprestimo = async (id_usuario, id_livro, status = 'pendente') => {
    return await prisma.solicitacaoemprestimo.create({
        data: {
            id_usuario,
            id_livro,
            status
        }
    });
};

exports.listarSolicitacaoEmprestimoCliente = async (userId) => {
    return await prisma.solicitacaoemprestimo.findMany({
        where: {
            id_usuario: Number(userId)
        },
        select: {
            data_solicitacao: true,
            status: true,
            livros: {
                select: {
                    titulo: true
                }
            }
        },
        orderBy: {
            data_solicitacao: 'desc'
        }
    });
};

exports.listarSolicitacaoEmprestimo = async () => {
    return await prisma.solicitacaoemprestimo.findMany({
        select: {
            id: true,
            data_solicitacao: true,
            status: true,
            id_usuario: true,
            id_livro: true,
            livros: {
                select: {
                    titulo: true
                }
            },
            usuarios: {
                select: {
                    nome: true
                }
            }
        },
        orderBy: {
            data_solicitacao: 'desc'
        }
    });
};

exports.deletarSolicitacaoEmprestimo = async (txOrId, maybeId) => {
    const tx = typeof maybeId === 'undefined' ? prisma : txOrId;
    const id = typeof maybeId === 'undefined' ? txOrId : maybeId;

    await tx.solicitacaoemprestimo.delete({
        where: {
            id: Number(id)
        }
    });
};

exports.atualizarSolicitacaoEmprestimo = async (txOrId, maybeId, maybeStatus) => {
    const tx = typeof maybeStatus === 'undefined' ? prisma : txOrId;
    const id = typeof maybeStatus === 'undefined' ? txOrId : maybeId;
    const status = typeof maybeStatus === 'undefined' ? maybeId : maybeStatus;

    return await tx.solicitacaoemprestimo.update({
        where: {
            id: Number(id)
        },
        data: status
    });
};

exports.buscarSolicitacaoEmprestimoPorId = async (txOrId, maybeId) => {
    const tx = typeof maybeId === 'undefined' ? prisma : txOrId;
    const id = typeof maybeId === 'undefined' ? txOrId : maybeId;

    return await tx.solicitacaoemprestimo.findUnique({
        where: {
            id
        }
    });
};