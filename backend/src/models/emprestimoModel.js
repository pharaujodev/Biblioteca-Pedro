const prisma = require ('../config/prisma');
exports.criarEmprestimo = async (tx, id_usuario, id_livro, data_emprestimo, data_devolucao, status) => {
    const result = await tx.emprestimos.create({
        data: {
            id_usuario,
            id_livro,
            data_emprestimo,
            data_devolucao,
            status
        }
    });
    return result;
}
exports.listarEmprestimo = async (search) => {
    if(search){
        const result = await prisma.emprestimos.findMany({
            where: {
                OR: [
                    { id_usuario : { equals: Number(search) } },
                    { id_livro : { equals: Number(search) } },
                ]
            }
        });
        return result;
    }
    else{
        const result = await prisma.emprestimos.findMany({
            include: {
                livros: {
                    select: {
                        titulo: true
                    }
                }
            }
        });
        return result;
    }
}
exports.deletarEmprestimo = async (id) => {
    await prisma.emprestimos.delete({
        where: {
            id 
        }
    });
}
exports.atualizarEmprestimo = async (id, id_usuario, id_livro, data_emprestimo, data_devolucao, status) => {
    const result = await prisma.emprestimos.update({
        where: {
            id 
        },
        data: {
            id_usuario,
            id_livro,
            data_emprestimo,
            data_devolucao,
            status
        }
    });
    return result;

}
exports.buscarEmprestimoPorId = async (tx, id) => {
    const result = await tx.emprestimos.findUnique({
        where: {
            id
        }
    });
    return result;
}

exports.devolverEmprestimo = async (id) => {
    const emprestimo = await prisma.emprestimos.update({
        where: {
            id
        },
        data: {
            data_devolucao: new Date()
        }
    });
    return emprestimo;
}

exports.atualizarStatusEmprestimo = async (tx ,id, status) => {
    const emprestimo = await tx.emprestimos.update({
        where: {
            id
        },
        data: status
    });
    return emprestimo;
}
    