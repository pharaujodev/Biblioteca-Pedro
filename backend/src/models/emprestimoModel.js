const prisma = require('../config/prisma');

exports.criarEmprestimo = async (
    txOrIdUsuario,
    maybeIdUsuario,
    maybeIdLivro,
    maybeDataEmprestimo,
    maybeDataDevolucao,
    maybeStatus
) => {
    const usandoTransacao = typeof maybeStatus !== 'undefined';

    const tx = usandoTransacao ? txOrIdUsuario : prisma;
    const id_usuario = usandoTransacao ? maybeIdUsuario : txOrIdUsuario;
    const id_livro = usandoTransacao ? maybeIdLivro : maybeIdUsuario;
    const data_emprestimo = usandoTransacao ? maybeDataEmprestimo : maybeIdLivro;
    const data_devolucao = usandoTransacao ? maybeDataDevolucao : maybeDataEmprestimo;
    const status = usandoTransacao ? maybeStatus : maybeDataDevolucao;

    return await tx.emprestimos.create({
        data: {
            id_usuario,
            id_livro,
            data_emprestimo,
            data_devolucao,
            status
        }
    });
};

exports.listarEmprestimo = async (search) => {
    if (search && !isNaN(search)) {
        const numero = Number(search);

        return await prisma.emprestimos.findMany({
            where: {
                OR: [
                    { id_usuario: numero },
                    { id_livro: numero }
                ]
            },
            include: {
                livros: {
                    select: { titulo: true }
                }
            }
        });
    }

    return await prisma.emprestimos.findMany({
        include: {
            livros: {
                select: { titulo: true }
            }
        }
    });
}

exports.deletarEmprestimo = async (id) => {
    await prisma.emprestimos.delete({
        where: { id }
    });
};

exports.atualizarEmprestimo = async (id, id_usuario, id_livro, data_emprestimo, data_devolucao, status) => {
    return await prisma.emprestimos.update({
        where: { id },
        data: {
            id_usuario,
            id_livro,
            data_emprestimo,
            data_devolucao,
            status
        }
    });
};

exports.buscarEmprestimoPorId = async (txOrId, maybeId) => {
    const tx = typeof maybeId === 'undefined' ? prisma : txOrId;
    const id = typeof maybeId === 'undefined' ? txOrId : maybeId;

    return await tx.emprestimos.findUnique({
        where: { id }
    });
};

exports.devolverEmprestimo = async (id) => {
    return await prisma.emprestimos.update({
        where: { id },
        data: {
            data_devolucao: new Date()
        }
    });
};

exports.atualizarStatusEmprestimo = async (txOrId, maybeId, maybeStatus) => {
    const tx = typeof maybeStatus === 'undefined' ? prisma : txOrId;
    const id = typeof maybeStatus === 'undefined' ? txOrId : maybeId;
    const status = typeof maybeStatus === 'undefined' ? maybeId : maybeStatus;

    return await tx.emprestimos.update({
        where: { id },
        data: status
    });
};

exports.listarEmprestimoCliente = async (user) => {
    return await prisma.emprestimos.findMany({
        where: {
            id_usuario: Number(user.id)
        },
        include: {
            livros: {
                select: {
                    titulo: true
                }
            }
        }
    });
}
