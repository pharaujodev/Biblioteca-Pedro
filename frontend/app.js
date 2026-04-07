
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.querySelector('#login-btn');

const links = document.querySelectorAll('[data-target]');
const sections = document.querySelectorAll('main section');
const token = localStorage.getItem('token');
const API_URL = window.location.origin;

links.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const target = link.getAttribute('data-target');

        sections.forEach(sec => {
            if (sec.id === target) {
                sec.classList.add('conteudo-ativo');
            } else {
                sec.classList.remove('conteudo-ativo');
            }
        });
    });
});

if (loginBtn) {
    loginBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const email = emailInput.value;
        const senha = passwordInput.value;

        try {
            const response = await fetch(`${API_URL}/api/auth`, {
                method: 'POST',
                body: JSON.stringify({ email, senha }),
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data.usuario.id);
                alert('Login bem-sucedido!');
                if (data.usuario.role === 'admin') {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'usuario.html';
                }
            } else {
                alert(data.error.message || 'Erro no login');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
}

const cadastrarBtn = document.querySelector('#cadastrar-btn');

if (cadastrarBtn) {
    cadastrarBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('emails').value;
        const senha = document.getElementById('senha').value;

        try {
            const response = await fetch(`${API_URL}/api/usuarios`, {
                method: 'POST',
                body: JSON.stringify({ nome, email, senha }),
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            if (response.ok) {
                alert('Cadastro bem-sucedido!');
                window.location.href = 'login.html';
            } else {
                alert(data.error.message || 'Erro no cadastro');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

}
async function carregarLivros() {
    try {
        const response = await fetch(`${API_URL}/api/livros`);
        const livros = await response.json();
        const tabela = document.getElementById('tabela');

        const tbody = tabela.querySelector('tbody');
        tbody.innerHTML = '';

        livros.forEach((livro) => {
            tbody.innerHTML += `
                <tr>
                    <td><img src="${livro.capa}" width="50"></td>
                    <td>${livro.titulo}</td>
                    <td>${livro.autor}</td>
                    <td>${livro.isbn}</td>
                    <td>${livro.ano_publicacao}</td>
                    <td>${livro.paginas}</td>
                    <td>${livro.categoria}</td>
                    <td>${livro.disponivel ? 'Disponível' : 'Indisponível'}</td>
                    <td>
                        <button type="button" class="emprestar-btn" data-id="${livro.id}">
                            Solicitar Empréstimo
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error(error);
    }
}

const corpoTabela = document.querySelector('#corpoTabela');

const listarLivrosBtn = document.querySelector('#listarLivros');
if (listarLivrosBtn) {
    listarLivrosBtn.addEventListener('click', carregarLivros);
}

const pesquisarBotao = document.querySelector('#botaoPesquisar');

pesquisarBotao.addEventListener('click', async (e) => {
    e.preventDefault();

    const tabela = document.getElementById('tabela');

    const response = await fetch(`${API_URL}/api/livros`);
    const livros = await response.json();

    const usuariosResponse = await fetch(`${API_URL}/api/usuarios`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const usuarios = await usuariosResponse.json();

    const emprestimosResponse = await fetch(`${API_URL}/api/emprestimos`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const emprestimos = await emprestimosResponse.json();

    if (response.ok) {
        const termoPesquisa = document.querySelector('#pesquisar').value.toLowerCase();
        const tbody = tabela.querySelector('tbody');
        tbody.innerHTML = '';
        let encontradoLivro = false;

        livros.forEach(livro => {
            if (livro.titulo.toLowerCase().includes(termoPesquisa) ||
                livro.autor.toLowerCase().includes(termoPesquisa) ||
                livro.isbn.includes(termoPesquisa)) {
                tbody.innerHTML += `
                    <tr>
                        <td><img src="${livro.capa}" alt="Capa do livro" width="50"></td>
                        <td>${livro.titulo}</td>
                        <td>${livro.autor}</td>
                        <td>${livro.isbn}</td>
                        <td>${livro.ano_publicacao}</td>
                        <td>${livro.paginas}</td>
                        <td>${livro.categoria}</td>
                        <td>${livro.disponivel ? 'Disponível' : 'Indisponível'}</td>
                    </tr>
                `;

                encontradoLivro = true;

            }
        });

        if (!encontradoLivro) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center">Nenhum livro encontrado</td></tr>';
        }
    }

    if (usuariosResponse.ok) {
        const tabela = document.getElementById('usuarios');
        const termoPesquisa = document.querySelector('#pesquisar').value.toLowerCase();
        const tbody = tabela.querySelector('tbody');
        tbody.innerHTML = '';
        let encontradoUsuario = false;
        usuarios.forEach(usuario => {
            if (usuario.nome.toLowerCase().includes(termoPesquisa) ||
                usuario.email.toLowerCase().includes(termoPesquisa) ||
                usuario.role.toLowerCase().includes(termoPesquisa)) {
                tbody.innerHTML += `
                    <tr>
                        <td>${usuario.nome}</td>
                        <td>${usuario.email}</td>
                        <td>${usuario.role}</td>
                    </tr>
                `;
                encontradoUsuario = true;
            }
        });

        if (!encontradoUsuario) {
            tbody.innerHTML = '<tr><td colspan="3" class="text-center">Nenhum usuário encontrado</td></tr>';
        }
    }

    if (emprestimosResponse.ok) {
        const tabela = document.getElementById('emprestimos');
        const termoPesquisa = document.querySelector('#pesquisar').value.toLowerCase();
        const tbody = tabela.querySelector('tbody');
        tbody.innerHTML = '';
        let encontradoEmprestimo = false;
        emprestimos.forEach(emprestimo => {
            if (emprestimo.id.toString().includes(termoPesquisa)) {
                tbody.innerHTML += `
                    <tr>
                        <td>${emprestimo.id_usuario}</td>
                        <td>${emprestimo.id_livro}</td>
                        <td>${new Date(emprestimo.data_emprestimo).toLocaleDateString()}</td>
                        <td>${new Date(emprestimo.data_devolucao).toLocaleDateString()}</td>
                    </tr>
                `;
                encontradoEmprestimo = true;
            }
        });

        if (!encontradoEmprestimo) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center">Nenhum empréstimo encontrado</td></tr>';
        }
    }
});



const criarLivro = document.querySelector('#criarLivroBtn');

if (criarLivro) {

    criarLivro.addEventListener('click', async (e) => {

        const titulo = document.querySelector('#titulo').value;
        const autor = document.querySelector('#autor').value;
        const isbn = document.querySelector('#isbn').value;
        const ano_publicacao = document.querySelector('#ano_publicacao').value;
        const paginas = document.querySelector('#paginas').value;
        const categoria = document.querySelector('#categoria').value;
        const capa = document.querySelector('#capa').value;
        const disponivel = document.querySelector('#disponivel').value;

        e.preventDefault();
        const response = await fetch(`${API_URL}/api/livros`, {
            method: 'POST',
            body: JSON.stringify({ titulo, autor, isbn, ano_publicacao, paginas, categoria, capa, disponivel }),
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
            alert('Livro criado com sucesso!');
        } else {
            alert(data.error.message || 'Erro ao criar livro');
        }
    });
}

const deletarLivroBtn = document.querySelector('#deletarLivroBtn');
if (deletarLivroBtn) {
    deletarLivroBtn.addEventListener('click', async (e) => {
        const id = document.querySelector('#id').value;
        e.preventDefault();
        const response = await fetch(`${API_URL}/api/livros/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
            alert('Livro deletado com sucesso!');
        } else {
            alert(data.error.message || 'Erro ao deletar livro');
        }
    });
}

const editarLivroBtn = document.querySelector('#editarLivroBtn');
if (editarLivroBtn) {
    editarLivroBtn.addEventListener('click', async (e) => {

        const id = document.querySelector('#idEditar').value;
        const titulo = document.querySelector('#tituloEditar').value;
        const autor = document.querySelector('#autorEditar').value;
        const isbn = document.querySelector('#isbnEditar').value;
        const ano_publicacao = document.querySelector('#ano_publicacaoEditar').value;
        const paginas = document.querySelector('#paginasEditar').value;
        const categoria = document.querySelector('#categoriaEditar').value;
        const capa = document.querySelector('#capaEditar').value;
        const disponivel = document.querySelector('#disponivelEditar').value;

        e.preventDefault();
        const response = await fetch(`${API_URL}/api/livros/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ titulo, autor, isbn, ano_publicacao, paginas, categoria, capa, disponivel }),
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
            alert('Livro editado com sucesso!');
        } else {
            alert(data.error.message || 'Erro ao editar livro');
        }
    });
}
const logout = document.querySelector('#logout');

if (!token) {
    logout.style.display = 'none';
}

const logoutBtn = document.querySelector('#logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });
}

const criarUsuarioBtn = document.querySelector('#criarUsuarioBtn');

if (criarUsuarioBtn) {
    criarUsuarioBtn.addEventListener('click', async (e) => {
        const nome = document.querySelector('#nomeUsuario').value;
        const email = document.querySelector('#emailUsuario').value;
        const senha = document.querySelector('#senhaUsuario').value;
        const role = document.querySelector('#tipoUsuario').value;
        e.preventDefault();
        const response = await fetch(`${API_URL}/api/usuarios`, {
            method: 'POST',
            body: JSON.stringify({ nome, email, senha, role }),
            headers: { 'Content-Type': 'application/json ', 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
            alert('Usuário criado com sucesso!');
        } else {
            alert(data.error.message || 'Erro ao criar usuário');
        }
    });
}

async function carregarUsuarios() {

    const tabela = document.getElementById('usuarios');
    try {
        const response = await fetch(`${API_URL}/api/usuarios`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const usuarios = await response.json();
        const tbody = tabela.querySelector('tbody');
        tbody.innerHTML = '';
        if (response.ok) {
            usuarios.map(usuario => {
                tbody.innerHTML += `
                    <tr>
                        <td>${usuario.nome}</td>
                        <td>${usuario.email}</td>
                        <td>${usuario.role}</td>
                    </tr>
                `;
            });
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

const listarUsuariosBtn = document.querySelector('#listarUsuarios');

if (listarUsuariosBtn) {
    listarUsuariosBtn.addEventListener('click', carregarUsuarios);
}

const editarUsuarioBtn = document.querySelector('#editarUsuarioBtn');
if (editarUsuarioBtn) {
    editarUsuarioBtn.addEventListener('click', async (e) => {
        const id = document.querySelector('#idUsuarioEditar').value;
        const nome = document.querySelector('#nomeUsuarioEditar').value;
        const email = document.querySelector('#emailUsuarioEditar').value;
        const role = document.querySelector('#tipoUsuarioEditar').value;
        const senha = document.querySelector('#senhaUsuarioEditar').value;
        e.preventDefault();
        const response = await fetch(`${API_URL}/api/usuarios/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ nome, email, senha, role }),
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
            alert('Usuário editado com sucesso!');
        } else {
            alert(data.error.message || 'Erro ao editar usuário');
        }
    });
}

const deletarUsuarioBtn = document.querySelector('#deletarUsuarioBtn');
if (deletarUsuarioBtn) {
    deletarUsuarioBtn.addEventListener('click', async (e) => {
        const id = document.querySelector('#idUsuarioDeletar').value;
        e.preventDefault();
        const response = await fetch(`${API_URL}/api/usuarios/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
            alert('Usuário deletado com sucesso!');
        } else {
            alert(data.error.message || 'Erro ao deletar usuário');
        }
    });
}

const criarEmprestimoBtn = document.querySelector('#criarEmprestimoBtn');

if (criarEmprestimoBtn) {
    criarEmprestimoBtn.addEventListener('click', async (e) => {
        const id_usuario = document.querySelector('#idUsuarioEmprestimo').value;
        const id_livro = document.querySelector('#idLivroEmprestimo').value;
        const data_emprestimo = document.querySelector('#dataEmprestimo').value;
        const data_devolucao = document.querySelector('#dataDevolucaoEmprestimo').value;
        e.preventDefault();
        const response = await fetch(`${API_URL}/api/emprestimos`, {
            method: 'POST',
            body: JSON.stringify({ id_usuario, id_livro, data_emprestimo, data_devolucao }),
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
            alert('Empréstimo criado com sucesso!');
        } else {
            alert(data.error.message || 'Erro ao criar empréstimo');
        }
    });
}

async function carregarEmprestimos() {

    const tabela = document.getElementById('emprestimos');
    try {
        const response = await fetch(`${API_URL}/api/emprestimos`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const emprestimos = await response.json();
        const tbody = tabela.querySelector('tbody');
        tbody.innerHTML = '';
        if (response.ok) {
            emprestimos.map(emprestimo => {
                tbody.innerHTML += `
                    <tr>
                        <td>${emprestimo.id}</td>
                        <td>${emprestimo.id_usuario}</td>
                        <td>${emprestimo.id_livro}</td>
                        <td>${new Date(emprestimo.data_emprestimo).toLocaleDateString()}</td>
                        <td>${new Date(emprestimo.data_devolucao).toLocaleDateString()}</td>
                    </tr>
                `;
            });
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

const listarEmprestimosBtn = document.querySelector('#listarEmprestimos');

if (listarEmprestimosBtn) {
    listarEmprestimosBtn.addEventListener('click', carregarEmprestimos);
}

async function carregarEmprestimosCliente() {
    const tabela = document.getElementById('MeusEmprestimos');
    try {
        const response = await fetch(`${API_URL}/api/emprestimos`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const emprestimos = await response.json();
        const tbody = tabela.querySelector('tbody');
        tbody.innerHTML = '';   
        if (response.ok) {
            emprestimos.forEach(emprestimos => {
                tbody.innerHTML += `
                    <tr>
                        <td>${emprestimos.livros.titulo}</td>
                        <td>${new Date(emprestimos.data_emprestimo).toLocaleDateString()}</td>
                        <td>${new Date(emprestimos.data_devolucao).toLocaleDateString()}</td>
                    </tr>
                `;
            });
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

const listarEmprestimosClienteBtn = document.querySelector('#meusEmprestimos');
if (listarEmprestimosClienteBtn) {
    listarEmprestimosClienteBtn.addEventListener('click', carregarEmprestimosCliente);
}

const deletarEmprestimoBtn = document.querySelector('#deletarEmprestimoBtn');
if (deletarEmprestimoBtn) {
    deletarEmprestimoBtn.addEventListener('click', async (e) => {
        const id = document.querySelector('#idEmprestimoDeletar').value;
        e.preventDefault();
        const response = await fetch(`${API_URL}/api/emprestimos/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
            alert('Empréstimo deletado com sucesso!');
        }
        else {
            alert(data.error.message || 'Erro ao deletar empréstimo');
        }
    });
}

const editarEmprestimoBtn = document.querySelector('#editarEmprestimoBtn');
if (editarEmprestimoBtn) {
    editarEmprestimoBtn.addEventListener('click', async (e) => {
        const id = document.querySelector('#idEmprestimoEditar').value;
        const id_usuario = document.querySelector('#idUsuarioEmprestimoEditar').value;
        const id_livro = document.querySelector('#idLivroEmprestimoEditar').value;
        const data_emprestimo = document.querySelector('#dataEmprestimoEditar').value;
        const data_devolucao = document.querySelector('#dataDevolucaoEmprestimoEditar').value;
        e.preventDefault();
        const response = await fetch(`${API_URL}/api/emprestimos/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ id_usuario, id_livro, data_emprestimo, data_devolucao }),
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
            alert('Empréstimo editado com sucesso!');
        }
        else {
            alert(data.error.message || 'Erro ao editar empréstimo');
        }
    });
}

const tabela = document.getElementById('tabela');

tabela.addEventListener('click', async (e) => {
    e.preventDefault();

    const emprestarBtn = e.target.closest('.emprestar-btn');
    if (!emprestarBtn) return;

        const id_usuario = localStorage.getItem('userId');
        const id_livro = emprestarBtn.dataset.id;

        try {
            const response = await fetch(`${API_URL}/api/solicitacao-emprestimos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id_usuario: Number(id_usuario),
                    id_livro: Number(id_livro),
                    status: 'pendente'
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Solicitação criada com sucesso!');
            } else {
                alert(data?.error?.message || data?.message || 'Erro ao criar solicitação');
            }
        } catch (error) {
            console.error(error);
        }

        return;

});

async function carregarSolicitacaoEmprestimo() {

    const solicitacaoTabela = document.getElementById('solicitacao');
    try {
        const response = await fetch(`${API_URL}/api/solicitacao-emprestimos/cliente`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const solicitacaoEmprestimos = await response.json();
        const tbody = solicitacaoTabela.querySelector('tbody');
        tbody.innerHTML = '';
        if (response.ok) {
            solicitacaoEmprestimos.map(solicitacao => {
                tbody.innerHTML += `
                    <tr>
                        <td>${solicitacao.livros.titulo}</td>
                        <td>${solicitacao.status}</td>
                        <td>${new Date(solicitacao.data_solicitacao).toLocaleString('pt-BR', {
                            dateStyle: 'short',
                            timeStyle: 'medium'
                        })}
                        </td>
                    </tr>
                `;
            });
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

const listarSolicitacaoEmprestimoBtn = document.querySelector('#listarSolicitacao');
if (listarSolicitacaoEmprestimoBtn) {
    listarSolicitacaoEmprestimoBtn.addEventListener('click', carregarSolicitacaoEmprestimo);
}

async function carregarSolicitacaoEmprestimoAdmin() {

    const tabela = document.getElementById('listarSolicitacaoAdmin');
    try {
        const response = await fetch(`${API_URL}/api/solicitacao-emprestimos`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const solicitacoes = await response.json();
        const tbody = tabela.querySelector('tbody');
        tbody.innerHTML = '';
        if (response.ok) {
            solicitacoes.forEach(solicitacao => {
                tbody.innerHTML += `
                    <tr>
                        <td>${solicitacao.id}</td>
                        <td>${solicitacao.id_usuario}</td>
                        <td>${solicitacao.id_livro}</td>
                        <td>${solicitacao.usuarios.nome}</td>
                        <td>${solicitacao.livros.titulo}</td>
                        <td>${new Date(solicitacao.data_solicitacao).toLocaleString('pt-BR', {
                            dateStyle: 'short',
                            timeStyle: 'medium'
                        })}
                        </td>
                        <td>${solicitacao.status}</td>
                        <td>
                            <button type="button" class="btn-status btn btn-success" data-id="${solicitacao.id}" data-status="aprovado">Aprovar</button>
                            <button type="button" class="btn-status btn btn-danger " data-id="${solicitacao.id}" data-status="rejeitado">Rejeitar</button>
                        </td>
                    </tr>
                `;
            });
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

const listarSolicitacaoAdminBtn = document.querySelector('#solicitacaoAdmin');

if (listarSolicitacaoAdminBtn) {
    listarSolicitacaoAdminBtn.addEventListener('click', carregarSolicitacaoEmprestimoAdmin);
}

const solicitacaoAdmin = document.getElementById('solicitacaoAdmin');


solicitacaoAdmin.addEventListener('click', async (e) => {

    e.preventDefault();

   const botao = e.target.closest('.btn-status');
   if (!botao) return;
   const id = botao.dataset.id;
   const status = botao.dataset.status;

    try {
        console.log({ id, status });
        const response = await fetch(`${API_URL}/api/solicitacao-emprestimos/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`  },
            body: JSON.stringify({ status })
        });
        const data = await response.json();
        if (response.ok) {
            alert('Status atualizado com sucesso!');
            
            location.reload();
        }
        else {
            alert(data.error.message || 'Erro ao atualizar status');
        }
    } catch (error) {
        console.error(error);
    }
});





