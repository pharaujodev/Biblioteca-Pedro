function obterMensagemErro(data, mensagemPadrao) {
    return data?.error?.message || data?.message || mensagemPadrao;
}

function preencherEstadoVazio(tbody, colspan, mensagem) {
    tbody.innerHTML = `
        <tr>
            <td colspan="${colspan}" class="text-center text-muted py-4">
                ${mensagem}
            </td>
        </tr>
    `;
}

function formatarData(dataISO) {
    if (!dataISO) return '-';
    const data = dataISO.split('T')[0];
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
}

function criarBadgeStatus(status) {
    const valorOriginal = status || '-';
    const valor = String(valorOriginal).toLowerCase();

    if (valor === 'disponível' || valor === 'disponivel' || valor === 'aprovado') {
        return `<span class="badge text-bg-success" aria-label="Status: ${valorOriginal}">${valorOriginal}</span>`;
    }

    if (valor === 'indisponível' || valor === 'indisponivel' || valor === 'rejeitado') {
        return `<span class="badge text-bg-danger" aria-label="Status: ${valorOriginal}">${valorOriginal}</span>`;
    }

    if (valor === 'pendente') {
        return `<span class="badge text-bg-warning text-dark" aria-label="Status: ${valorOriginal}">${valorOriginal}</span>`;
    }

    if (valor === 'devolvido') {
        return `<span class="badge text-bg-secondary" aria-label="Status: ${valorOriginal}">${valorOriginal}</span>`;
    }

    if(valor === 'ativo') {
        return `<span class="badge text-bg-success" aria-label="Status: ${valorOriginal}">${valorOriginal}</span>`;
    }

    return `<span class="badge text-bg-light text-dark" aria-label="Status: ${valorOriginal}">${valorOriginal}</span>`;
}

function limparValidacao(form) {
    if (!form) return;
    form.querySelectorAll('.is-invalid').forEach(campo => campo.classList.remove('is-invalid'));
}

function validarFormulario(form) {
    if (!form) return true;

    let valido = true;
    limparValidacao(form);

    form.querySelectorAll('[required]').forEach(campo => {
        const valor = typeof campo.value === 'string' ? campo.value.trim() : campo.value;

        if (!valor) {
            campo.classList.add('is-invalid');
            campo.setAttribute('aria-invalid', 'true');
            valido = false;
            return;
        }

        if (campo.type === 'email' && !campo.checkValidity()) {
            campo.classList.add('is-invalid');
            campo.setAttribute('aria-invalid', 'true');
            valido = false;
            return;
        }

        campo.removeAttribute('aria-invalid');
    });

    return valido;
}

function setBotaoLoading(botao, textoCarregando) {
    if (!botao) return;
    if (!botao.dataset.originalText) {
        botao.dataset.originalText = botao.textContent;
    }
    botao.disabled = true;
    botao.setAttribute('aria-disabled', 'true');
    botao.textContent = textoCarregando;
}

function resetBotaoLoading(botao) {
    if (!botao) return;
    botao.disabled = false;
    botao.setAttribute('aria-disabled', 'false');
    if (botao.dataset.originalText) {
        botao.textContent = botao.dataset.originalText;
    }
}

function ativarLinkNavegacao(targetId) {
    document.querySelectorAll('.nav-link, .dropdown-item').forEach(link => {
        if (link.dataset.target === targetId) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });
}

document.querySelectorAll('[data-target]').forEach(link => {
    link.addEventListener('click', () => {
        const targetId = link.dataset.target;
        if (targetId) ativarLinkNavegacao(targetId);
    });
});

document.querySelectorAll('form').forEach(form => {
    form.querySelectorAll('[required]').forEach(campo => {
        campo.addEventListener('input', () => {
            if (campo.value.trim()) {
                campo.classList.remove('is-invalid');
                campo.removeAttribute('aria-invalid');
            }
        });

        campo.addEventListener('change', () => {
            if (campo.value.trim()) {
                campo.classList.remove('is-invalid');
                campo.removeAttribute('aria-invalid');
            }
        });
    });
});

function abrirModalConfirmacao(mensagem) {
    return new Promise((resolve) => {
        const modalElement = document.getElementById('confirmacaoModal');
        const modalTexto = document.getElementById('confirmacaoModalTexto');
        const confirmarBtn = document.getElementById('confirmarAcaoBtn');

        if (!modalElement || !modalTexto || !confirmarBtn || !window.bootstrap) {
            resolve(window.confirm(mensagem));
            return;
        }

        modalTexto.textContent = mensagem;
        const modal = new bootstrap.Modal(modalElement);

        const confirmarHandler = () => {
            confirmarBtn.removeEventListener('click', confirmarHandler);
            modalElement.removeEventListener('hidden.bs.modal', hiddenHandler);
            resolve(true);
        };

        const hiddenHandler = () => {
            confirmarBtn.removeEventListener('click', confirmarHandler);
            modalElement.removeEventListener('hidden.bs.modal', hiddenHandler);
            resolve(false);
        };

        confirmarBtn.addEventListener('click', confirmarHandler, { once: true });
        modalElement.addEventListener('hidden.bs.modal', hiddenHandler, { once: true });

        confirmarBtn.onclick = () => {
            modal.hide();
        };

        modal.show();
    });
}

const pesquisarBotao = document.querySelector('#botaoPesquisar');

if (pesquisarBotao) {
    pesquisarBotao.addEventListener('click', async (e) => {
        e.preventDefault();

        const termoPesquisa = document.querySelector('#pesquisar').value.toLowerCase();
        const secaoAtiva = document.querySelector('.conteudo-ativo');

        try {
            mostrarLoading();

            if (secaoAtiva.id === 'tabela') {
                const response = await fetch(`${API_URL}/api/livros?search=${encodeURIComponent(termoPesquisa)}`);
                const livros = await response.json();
                const tbody = document.getElementById('corpoTabelaLivros');
                tbody.innerHTML = '';

                if (!response.ok) {
                    mostrarFeedback('danger', obterMensagemErro(livros, 'Não foi possível pesquisar livros.'));
                    return;
                }

                if (!livros.length) {
                    preencherEstadoVazio(tbody, 10, 'Nenhum livro encontrado para a busca.');
                    return;
                }

                livros.forEach(livro => {
                    tbody.innerHTML += `
                        <tr>
                            <td><img src="${livro.capa}" width="50" alt="Capa do livro ${livro.titulo}" class="img-thumbnail"></td>
                            <td>${livro.titulo}</td>
                            <td>${livro.autor}</td>
                            <td>${livro.isbn}</td>
                            <td>${livro.ano_publicacao}</td>
                            <td>${livro.paginas}</td>
                            <td>${livro.categoria}</td>
                            <td>${criarBadgeStatus(livro.disponivel)}</td>
                            <td>${livro.quantidade}</td>
                            <td>
                                <button type="button" class="btn btn-danger btn-sm deletarLivro" data-id="${livro.id}">
                                    Deletar
                                </button>
                            </td>
                        </tr>
                    `;
                });
            } else if (secaoAtiva.id === 'usuarios') {
                const response = await fetch(`${API_URL}/api/usuarios?search=${encodeURIComponent(termoPesquisa)}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const usuarios = await response.json();
                const tbody = document.getElementById('corpoTabelaUsuarios');
                tbody.innerHTML = '';

                if (!response.ok) {
                    mostrarFeedback('danger', obterMensagemErro(usuarios, 'Não foi possível pesquisar usuários.'));
                    return;
                }

                if (!usuarios.length) {
                    preencherEstadoVazio(tbody, 4, 'Nenhum usuário encontrado para a busca.');
                    return;
                }

                usuarios.forEach(usuario => {
                    tbody.innerHTML += `
                        <tr>
                            <td>${usuario.nome}</td>
                            <td>${usuario.email}</td>
                            <td>${usuario.role}</td>
                            <td>
                                <button type="button" class="btn btn-danger btn-sm deletarUsuario" data-id="${usuario.id}">
                                    Deletar
                                </button>
                            </td>
                        </tr>
                    `;
                });
            } else if (secaoAtiva.id === 'emprestimos') {
                const response = await fetch(`${API_URL}/api/emprestimos?search=${encodeURIComponent(termoPesquisa)}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const emprestimos = await response.json();
                const tbody = document.getElementById('corpoTabelaEmprestimos');
                tbody.innerHTML = '';

                if (!response.ok) {
                    mostrarFeedback('danger', obterMensagemErro(emprestimos, 'Não foi possível pesquisar empréstimos.'));
                    return;
                }

                if (!emprestimos.length) {
                    preencherEstadoVazio(tbody, 7, 'Nenhum empréstimo encontrado para a busca.');
                    return;
                }

                emprestimos.forEach(emprestimo => {
                    tbody.innerHTML += `
                        <tr>
                            <td>${emprestimo.id}</td>
                            <td>${emprestimo.id_usuario}</td>
                            <td>${emprestimo.id_livro}</td>
                            <td>${formatarData(emprestimo.data_emprestimo)}</td>
                            <td>${formatarData(emprestimo.data_devolucao)}</td>
                            <td>${criarBadgeStatus(emprestimo.status)}</td>
                            <td>
                                <button type="button" class="btn btn-warning btn-sm" data-id="${emprestimo.id}" data-status="${emprestimo.status}">
                                    Devolver
                                </button>
                                <button type="button" class="btn btn-danger btn-sm" data-id="${emprestimo.id}">
                                    Deletar
                                </button>
                            </td>
                        </tr>
                    `;
                });
            }
        } catch (error) {
            console.error('Erro na pesquisa:', error);
            mostrarFeedback('danger', 'Não foi possível concluir a pesquisa.');
        } finally {
            esconderLoading();
        }
    });
}

const criarLivro = document.querySelector('#criarLivroBtn');

if (criarLivro) {
    criarLivro.addEventListener('click', async (e) => {
        e.preventDefault();

        const form = criarLivro.closest('form');
        if (!validarFormulario(form)) {
            mostrarFeedback('warning', 'Preencha os campos obrigatórios corretamente.');
            return;
        }

        const titulo = document.querySelector('#titulo').value;
        const autor = document.querySelector('#autor').value;
        const isbn = document.querySelector('#isbn').value;
        const ano_publicacao = document.querySelector('#ano_publicacao').value;
        const paginas = document.querySelector('#paginas').value;
        const categoria = document.querySelector('#categoria').value;
        const capa = document.querySelector('#capa').value;
        const disponivel = document.querySelector('#disponivel').value;
        const quantidade = document.querySelector('#quantidade').value;

        try {
            setBotaoLoading(criarLivro, 'Salvando...');
            mostrarLoading();

            const response = await fetch(`${API_URL}/api/livros`, {
                method: 'POST',
                body: JSON.stringify({ titulo, autor, isbn, ano_publicacao, paginas, categoria, capa, disponivel, quantidade }),
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (response.ok) {
                mostrarFeedback('success', 'Livro criado com sucesso!');
                form.reset();
                limparValidacao(form);
            } else {
                mostrarFeedback('danger', obterMensagemErro(data, 'Não foi possível criar o livro.'));
            }
        } catch (error) {
            console.error('Erro ao criar livro:', error);
            mostrarFeedback('danger', 'Erro de conexão ao criar o livro.');
        } finally {
            resetBotaoLoading(criarLivro);
            esconderLoading();
        }
    });
}

async function carregarLivros() {
    try {
        mostrarLoading();
        const response = await fetch(`${API_URL}/api/livros`);
        const livros = await response.json();
        const tbody = document.getElementById('corpoTabelaLivros');
        tbody.innerHTML = '';

        if (!response.ok) {
            const mensagem = obterMensagemErro(livros, '').toLowerCase();
            if(mensagem.includes('nenhum')){
                preencherEstadoVazio(tbody, 10, 'Nenhum livro cadastrado.');
                return;
            }
            mostrarFeedback('danger', obterMensagemErro(livros, 'Não foi possível carregar os livros.'));
            return;
        }

        if (!Array.isArray(livros)) {
            preencherEstadoVazio(tbody, 10, 'Nenhum livro cadastrado.');
        }

        if (!livros.length) {
            preencherEstadoVazio(tbody, 10, 'Nenhum livro cadastrado.');
            return;
        }

        livros.forEach((livro) => {
            tbody.innerHTML += `
                <tr>
                    <td><img src="${livro.capa}" width="50" alt="Capa do livro ${livro.titulo}" class="img-thumbnail"></td>
                    <td>${livro.titulo}</td>
                    <td>${livro.autor}</td>
                    <td>${livro.isbn}</td>
                    <td>${livro.ano_publicacao}</td>
                    <td>${livro.paginas}</td>
                    <td>${livro.categoria}</td>
                    <td>${criarBadgeStatus(livro.disponivel)}</td>
                    <td>${livro.quantidade}</td>
                    <td>
                        <button type="button" class="btn btn-danger btn-sm deletarLivro" data-id="${livro.id}">
                            Deletar
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error(error);
        mostrarFeedback('danger', 'Não foi possível carregar os livros.');
    } finally {
        esconderLoading();
    }
}

const listarLivrosBtn = document.querySelector('#listarLivros');
if (listarLivrosBtn) {
    listarLivrosBtn.addEventListener('click', carregarLivros);
}

const deletarLivroBtn = document.querySelector('#deletarLivroBtn');
if (deletarLivroBtn) {
    deletarLivroBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const confirmado = await abrirModalConfirmacao('Tem certeza que deseja excluir este livro?');
        if (!confirmado) return;

        const id = document.querySelector('#id').value;

        try {
            setBotaoLoading(deletarLivroBtn, 'Excluindo...');
            mostrarLoading();

            const response = await fetch(`${API_URL}/api/livros/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (response.ok) {
                mostrarFeedback('success', 'Livro deletado com sucesso!');
                await carregarLivros();
            } else {
                mostrarFeedback('danger', obterMensagemErro(data, 'Não foi possível deletar o livro.'));
            }
        } catch (error) {
            console.error('Erro ao deletar livro:', error);
            mostrarFeedback('danger', 'Erro de conexão ao deletar o livro.');
        } finally {
            resetBotaoLoading(deletarLivroBtn);
            esconderLoading();
        }
    });
}

const editarLivroBtn = document.querySelector('#editarLivroBtn');
if (editarLivroBtn) {
    editarLivroBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const form = editarLivroBtn.closest('form');
        if (!validarFormulario(form)) {
            mostrarFeedback('warning', 'Preencha os campos obrigatórios corretamente.');
            return;
        }

        const id = document.querySelector('#idEditar').value;
        const titulo = document.querySelector('#tituloEditar').value;
        const autor = document.querySelector('#autorEditar').value;
        const isbn = document.querySelector('#isbnEditar').value;
        const ano_publicacao = document.querySelector('#ano_publicacaoEditar').value;
        const paginas = document.querySelector('#paginasEditar').value;
        const categoria = document.querySelector('#categoriaEditar').value;
        const capa = document.querySelector('#capaEditar').value;
        const disponivel = document.querySelector('#disponivelEditar').value;
        const quantidade = document.querySelector('#quantidadeEditar').value;

        try {
            setBotaoLoading(editarLivroBtn, 'Salvando...');
            mostrarLoading();

            const response = await fetch(`${API_URL}/api/livros/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ titulo, autor, isbn, ano_publicacao, paginas, categoria, capa, disponivel, quantidade }),
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (response.ok) {
                mostrarFeedback('success', 'Livro editado com sucesso!');
                await carregarLivros();
            } else {
                mostrarFeedback('danger', obterMensagemErro(data, 'Não foi possível editar o livro.'));
            }
        } catch (error) {
            console.error('Erro ao editar livro:', error);
            mostrarFeedback('danger', 'Erro de conexão ao editar o livro.');
        } finally {
            resetBotaoLoading(editarLivroBtn);
            esconderLoading();
        }
    });
}

const criarUsuarioBtn = document.querySelector('#criarUsuarioBtn');

if (criarUsuarioBtn) {
    criarUsuarioBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const form = criarUsuarioBtn.closest('form');
        if (!validarFormulario(form)) {
            mostrarFeedback('warning', 'Preencha os campos obrigatórios corretamente.');
            return;
        }

        const nome = document.querySelector('#nomeUsuario').value;
        const email = document.querySelector('#emailUsuario').value;
        const senha = document.querySelector('#senhaUsuario').value;
        const role = document.querySelector('#tipoUsuario').value;

        try {
            setBotaoLoading(criarUsuarioBtn, 'Salvando...');
            mostrarLoading();

            const response = await fetch(`${API_URL}/api/usuarios`, {
                method: 'POST',
                body: JSON.stringify({ nome, email, senha, role }),
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (response.ok) {
                mostrarFeedback('success', 'Usuário criado com sucesso!');
                form.reset();
                limparValidacao(form);
            } else {
                mostrarFeedback('danger', obterMensagemErro(data, 'Não foi possível criar o usuário.'));
            }
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            mostrarFeedback('danger', 'Erro de conexão ao criar o usuário.');
        } finally {
            resetBotaoLoading(criarUsuarioBtn);
            esconderLoading();
        }
    });
}

async function carregarUsuarios() {
    try {
        mostrarLoading();
        const response = await fetch(`${API_URL}/api/usuarios`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const usuarios = await response.json();
        const tbody = document.getElementById('corpoTabelaUsuarios');
        tbody.innerHTML = '';

         if (!response.ok) {
            const mensagem = obterMensagemErro(usuarios, '').toLowerCase();
            if(mensagem.includes('nenhum')){
                preencherEstadoVazio(tbody, 4, 'Nenhum usuário cadastrado.');
                return;
            }
            mostrarFeedback('danger', obterMensagemErro(usuarios, 'Não foi possível carregar os usuários.'));
            return;
        }

        if(!Array.isArray(usuarios)) {
            preencherEstadoVazio(tbody, 4, 'Nenhum usuário cadastrado.');
        }

         if (!usuarios.length) {
            preencherEstadoVazio(tbody, 4, 'Nenhum usuário cadastrado.');
            return;
        }

        usuarios.forEach(usuario => {
            tbody.innerHTML += `
                <tr>
                    <td>${usuario.nome}</td>
                    <td>${usuario.email}</td>
                    <td>${usuario.role}</td>
                    <td>
                        <button type="button" class="btn btn-danger btn-sm deletarUsuario" data-id="${usuario.id}">
                            Deletar
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        mostrarFeedback('danger', 'Não foi possível carregar os usuários.');
    } finally {
        esconderLoading();
    }
}

const listarUsuariosBtn = document.querySelector('#listarUsuarios');
if (listarUsuariosBtn) {
    listarUsuariosBtn.addEventListener('click', carregarUsuarios);
}

const usuariosTabela = document.getElementById('usuarios');
if (usuariosTabela) {
    usuariosTabela.addEventListener('click', async (e) => {
        e.preventDefault();
        const deletarBtn = e.target.closest('.deletarUsuario');
        if (!deletarBtn) return;

        const confirmado = await abrirModalConfirmacao('Tem certeza que deseja excluir este usuário?');
        if (!confirmado) return;

        const id = deletarBtn.dataset.id;

        try {
            setBotaoLoading(deletarBtn, 'Excluindo...');
            mostrarLoading();

            const response = await fetch(`${API_URL}/api/usuarios/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (response.ok) {
                mostrarFeedback('success', 'Usuário deletado com sucesso!');
                await carregarUsuarios();
            } else {
                mostrarFeedback('danger', obterMensagemErro(data, 'Não foi possível deletar o usuário.'));
            }
        } catch (error) {
            console.error('Erro ao deletar usuário:', error);
            mostrarFeedback('danger', 'Erro de conexão ao deletar o usuário.');
        } finally {
            resetBotaoLoading(deletarBtn);
            esconderLoading();
        }
    });
}

const editarUsuarioBtn = document.querySelector('#editarUsuarioBtn');
if (editarUsuarioBtn) {
    editarUsuarioBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const form = editarUsuarioBtn.closest('form');
        if (!validarFormulario(form)) {
            mostrarFeedback('warning', 'Preencha os campos obrigatórios corretamente.');
            return;
        }

        const id = document.querySelector('#idUsuarioEditar').value;
        const nome = document.querySelector('#nomeUsuarioEditar').value;
        const email = document.querySelector('#emailUsuarioEditar').value;
        const role = document.querySelector('#tipoUsuarioEditar').value;
        const senha = document.querySelector('#senhaUsuarioEditar').value;

        try {
            setBotaoLoading(editarUsuarioBtn, 'Salvando...');
            mostrarLoading();

            const response = await fetch(`${API_URL}/api/usuarios/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ nome, email, senha, role }),
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (response.ok) {
                mostrarFeedback('success', 'Usuário editado com sucesso!');
                await carregarUsuarios();
            } else {
                mostrarFeedback('danger', obterMensagemErro(data, 'Não foi possível editar o usuário.'));
            }
        } catch (error) {
            console.error('Erro ao editar usuário:', error);
            mostrarFeedback('danger', 'Erro de conexão ao editar o usuário.');
        } finally {
            resetBotaoLoading(editarUsuarioBtn);
            esconderLoading();
        }
    });
}

const deletarUsuarioBtn = document.querySelector('#deletarUsuarioBtn');
if (deletarUsuarioBtn) {
    deletarUsuarioBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const confirmado = await abrirModalConfirmacao('Tem certeza que deseja excluir este usuário?');
        if (!confirmado) return;

        const id = document.querySelector('#idUsuarioDeletar').value;

        try {
            setBotaoLoading(deletarUsuarioBtn, 'Excluindo...');
            mostrarLoading();

            const response = await fetch(`${API_URL}/api/usuarios/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (response.ok) {
                mostrarFeedback('success', 'Usuário deletado com sucesso!');
                await carregarUsuarios();
            } else {
                mostrarFeedback('danger', obterMensagemErro(data, 'Não foi possível deletar o usuário.'));
            }
        } catch (error) {
            console.error('Erro ao deletar usuário:', error);
            mostrarFeedback('danger', 'Erro de conexão ao deletar o usuário.');
        } finally {
            resetBotaoLoading(deletarUsuarioBtn);
            esconderLoading();
        }
    });
}

const criarEmprestimoBtn = document.querySelector('#criarEmprestimoBtn');

if (criarEmprestimoBtn) {
    criarEmprestimoBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const form = criarEmprestimoBtn.closest('form');
        if (!validarFormulario(form)) {
            mostrarFeedback('warning', 'Preencha os campos obrigatórios corretamente.');
            return;
        }

        const id_usuario = document.querySelector('#idUsuarioEmprestimo').value;
        const id_livro = document.querySelector('#idLivroEmprestimo').value;
        const data_emprestimo = document.querySelector('#dataEmprestimo').value;
        const data_devolucao = document.querySelector('#dataDevolucaoEmprestimo').value;

        try {
            setBotaoLoading(criarEmprestimoBtn, 'Salvando...');
            mostrarLoading();

            const response = await fetch(`${API_URL}/api/emprestimos`, {
                method: 'POST',
                body: JSON.stringify({ id_usuario, id_livro, data_emprestimo, data_devolucao }),
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (response.ok) {
                mostrarFeedback('success', 'Empréstimo criado com sucesso!');
                form.reset();
                limparValidacao(form);
            } else {
                mostrarFeedback('danger', obterMensagemErro(data, 'Não foi possível criar o empréstimo.'));
            }
        } catch (error) {
            console.error('Erro ao criar empréstimo:', error);
            mostrarFeedback('danger', 'Erro de conexão ao criar o empréstimo.');
        } finally {
            resetBotaoLoading(criarEmprestimoBtn);
            esconderLoading();
        }
    });
}

async function carregarEmprestimos() {
    try {
        mostrarLoading();
        const response = await fetch(`${API_URL}/api/emprestimos`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const emprestimos = await response.json();
        const tbody = document.getElementById('corpoTabelaEmprestimos');
        tbody.innerHTML = '';

        if (!response.ok) {
            const mensagem = obterMensagemErro(emprestimos, '').toLowerCase();

            if (mensagem.includes('nenhum')) {
                preencherEstadoVazio(tbody, 7, 'Nenhum empréstimo cadastrado.');
                return;
            }

            mostrarFeedback('danger', obterMensagemErro(emprestimos, 'Erro ao carregar.'));
            return;
            
        }
        if (!Array.isArray(emprestimos)) {
            preencherEstadoVazio(tbody, 7, 'Nenhum empréstimo cadastrado.');
            return;
        }
        if (!emprestimos.length) {
            preencherEstadoVazio(tbody, 7, 'Nenhum empréstimo cadastrado.');
            return;
        }

        emprestimos.forEach(emprestimo => {
            tbody.innerHTML += `
                <tr>
                    <td>${emprestimo.id}</td>
                    <td>${emprestimo.id_usuario}</td>
                    <td>${emprestimo.id_livro}</td>
                    <td>${formatarData(emprestimo.data_emprestimo)}</td>
                    <td>${formatarData(emprestimo.data_devolucao)}</td>
                    <td>${criarBadgeStatus(emprestimo.status)}</td>
                    <td>
                        <button type="button" class="btn btn-warning btn-sm" data-id="${emprestimo.id}" data-status="${emprestimo.status}">
                            Devolver
                        </button>
                        <button type="button" class="btn btn-danger btn-sm" data-id="${emprestimo.id}">
                            Deletar
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Erro ao carregar empréstimos:', error);
        mostrarFeedback('danger', 'Não foi possível carregar os empréstimos.');
    } finally {
        esconderLoading();
    }
}

const listarEmprestimosBtn = document.querySelector('#listarEmprestimos');
if (listarEmprestimosBtn) {
    listarEmprestimosBtn.addEventListener('click', carregarEmprestimos);
}

const deletarEmprestimoBtn = document.querySelector('#deletarEmprestimoBtn');
if (deletarEmprestimoBtn) {
    deletarEmprestimoBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const confirmado = await abrirModalConfirmacao('Tem certeza que deseja excluir este empréstimo?');
        if (!confirmado) return;

        const id = document.querySelector('#idEmprestimoDeletar').value;

        try {
            setBotaoLoading(deletarEmprestimoBtn, 'Excluindo...');
            mostrarLoading();

            const response = await fetch(`${API_URL}/api/emprestimos/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

                        if (response.ok) {
                mostrarFeedback('success', 'Empréstimo deletado com sucesso!');
                await carregarEmprestimos();
            } else {
                mostrarFeedback('danger', obterMensagemErro(data, 'Não foi possível deletar o empréstimo.'));
            }
        } catch (error) {
            console.error('Erro ao deletar empréstimo:', error);
            mostrarFeedback('danger', 'Erro de conexão ao deletar o empréstimo.');
        } finally {
            resetBotaoLoading(deletarEmprestimoBtn);
            esconderLoading();
        }
    });
}

const editarEmprestimoBtn = document.querySelector('#editarEmprestimoBtn');
if (editarEmprestimoBtn) {
    editarEmprestimoBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const form = editarEmprestimoBtn.closest('form');
        if (!validarFormulario(form)) {
            mostrarFeedback('warning', 'Preencha os campos obrigatórios corretamente.');
            return;
        }

        const id = document.querySelector('#idEmprestimoEditar').value;
        const id_usuario = document.querySelector('#idUsuarioEmprestimoEditar').value;
        const id_livro = document.querySelector('#idLivroEmprestimoEditar').value;
        const data_emprestimo = document.querySelector('#dataEmprestimoEditar').value;
        const data_devolucao = document.querySelector('#dataDevolucaoEmprestimoEditar').value;
        const status = document.querySelector('#statusEmprestimoEditar').value;

        try {
            setBotaoLoading(editarEmprestimoBtn, 'Salvando...');
            mostrarLoading();

            const response = await fetch(`${API_URL}/api/emprestimos/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ id_usuario, id_livro, data_emprestimo, data_devolucao, status }),
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (response.ok) {
                mostrarFeedback('success', 'Empréstimo editado com sucesso!');
                await carregarEmprestimos();
            } else {
                mostrarFeedback('danger', obterMensagemErro(data, 'Não foi possível editar o empréstimo.'));
            }
        } catch (error) {
            console.error('Erro ao editar empréstimo:', error);
            mostrarFeedback('danger', 'Erro de conexão ao editar o empréstimo.');
        } finally {
            resetBotaoLoading(editarEmprestimoBtn);
            esconderLoading();
        }
    });
}

const listaDeLivros = document.getElementById('tabela');
if (listaDeLivros) {
    listaDeLivros.addEventListener('click', async (e) => {

        const deletarBtn = e.target.closest('.deletarLivro');
        if (deletarBtn) {
            const confirmado = await abrirModalConfirmacao('Tem certeza que deseja excluir este livro?');
            if (!confirmado) return;

            const id = deletarBtn.dataset.id;

            try {
                setBotaoLoading(deletarBtn, 'Excluindo...');
                mostrarLoading();

                const response = await fetch(`${API_URL}/api/livros/${id}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();

                if (response.ok) {
                    mostrarFeedback('success', 'Livro deletado com sucesso!');
                    await carregarLivros();
                } else {
                    mostrarFeedback('danger', obterMensagemErro(data, 'Não foi possível deletar o livro.'));
                }
            } catch (error) {
                console.error('Erro ao deletar livro:', error);
                mostrarFeedback('danger', 'Erro de conexão ao deletar o livro.');
            } finally {
                resetBotaoLoading(deletarBtn);
                esconderLoading();
            }
        }
    });
}

async function carregarSolicitacaoEmprestimoAdmin() {
    try {
        mostrarLoading();

        const response = await fetch(`${API_URL}/api/solicitacao-emprestimos`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const solicitacoes = await response.json();
        const tbody = document.getElementById('corpoTabelaSolicitacoes');
        tbody.innerHTML = '';

        const mensagem = obterMensagemErro(solicitacoes, '').toLowerCase();

        if (!response.ok) {
            if(mensagem.includes('nenhum')){
                preencherEstadoVazio(tbody, 8, 'Nenhuma solicitação pendente.');
                return;
            }
            mostrarFeedback('danger', obterMensagemErro(solicitacoes, 'Não foi possível carregar as solicitações.'));
            return;
        }

        if (!Array.isArray(solicitacoes)) {
            preencherEstadoVazio(tbody, 8, 'Nenhuma solicitação pendente.');
            return;
        }

        if(!solicitacoes.length) {
            preencherEstadoVazio(tbody, 8, 'Nenhuma solicitação pendente.');
            return;
        }

        const pendentes = solicitacoes.filter(s => s.status === 'pendente');

        if (!pendentes.length) {
            preencherEstadoVazio(tbody, 8, 'Nenhuma solicitação pendente.');
            return;
        }

        pendentes.forEach(solicitacao => {
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
                    })}</td>
                    <td>${criarBadgeStatus(solicitacao.status)}</td>
                    <td>
                        <div class="d-flex flex-column gap-2 align-items-end> ">
                            <button type="button" class="btn-status btn btn-success btn-sm" data-id="${solicitacao.id}" data-status="aprovado">
                                Aprovar
                            </button>
                            <button type="button" class="btn-status btn btn-danger btn-sm" data-id="${solicitacao.id}" data-status="rejeitado">
                                Rejeitar
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Erro ao carregar solicitações:', error);
        mostrarFeedback('danger', 'Não foi possível carregar as solicitações.');
    } finally {
        esconderLoading();
    }
}

const listarSolicitacaoAdminBtn = document.querySelector('#solicitacaoAdmin');
if (listarSolicitacaoAdminBtn) {
    listarSolicitacaoAdminBtn.addEventListener('click', carregarSolicitacaoEmprestimoAdmin);
}

async function solicitacaoEmprestimoAdmin(event) {
    const botao = event.target.closest('.btn-status');
    if (!botao) return;

    const id = botao.dataset.id;
    const status = botao.dataset.status;

    try {
        setBotaoLoading(botao, status === 'aprovado' ? 'Aprovando...' : 'Rejeitando...');
        mostrarLoading();

        const response = await fetch(`${API_URL}/api/solicitacao-emprestimos/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ status })
        });
        const data = await response.json();

        if (response.ok) {
            mostrarFeedback(
                'success',
                status === 'aprovado'
                    ? 'Solicitação aprovada e empréstimo criado com sucesso!'
                    : 'Solicitação rejeitada com sucesso!'
            );
            await carregarSolicitacaoEmprestimoAdmin();
        } else {
            mostrarFeedback('danger', obterMensagemErro(data, 'Não foi possível atualizar o status da solicitação.'));
        }
    } catch (error) {
        console.error('Erro ao atualizar solicitação:', error);
        mostrarFeedback('danger', 'Erro de conexão ao atualizar a solicitação.');
    } finally {
        resetBotaoLoading(botao);
        esconderLoading();
    }
}

const tabelaSolicitacaoAdmin = document.querySelector('#listarSolicitacaoAdmin');
if (tabelaSolicitacaoAdmin) {
    tabelaSolicitacaoAdmin.addEventListener('click', solicitacaoEmprestimoAdmin);
}

const tabelaListarEmprestimos = document.getElementById('emprestimos');
if (tabelaListarEmprestimos) {
    tabelaListarEmprestimos.addEventListener('click', async (e) => {
        e.preventDefault();
        const deletarBtn = e.target.closest('.btn-danger');
        const devolverBtn = e.target.closest('.btn-warning');

        if (deletarBtn) {
            const confirmado = await abrirModalConfirmacao('Tem certeza que deseja excluir este empréstimo?');
            if (!confirmado) return;

            const id = deletarBtn.dataset.id;

            try {
                setBotaoLoading(deletarBtn, 'Excluindo...');
                mostrarLoading();

                const response = await fetch(`${API_URL}/api/emprestimos/${id}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();

                if (response.ok) {
                    mostrarFeedback('success', 'Empréstimo deletado com sucesso!');
                    await carregarEmprestimos();
                } else {
                    mostrarFeedback('danger', obterMensagemErro(data, 'Não foi possível deletar o empréstimo.'));
                }
            } catch (error) {
                console.error('Erro ao deletar empréstimo:', error);
                mostrarFeedback('danger', 'Erro de conexão ao deletar o empréstimo.');
            } finally {
                resetBotaoLoading(deletarBtn);
                esconderLoading();
            }

            return;
        }

        if (devolverBtn) {
            if (devolverBtn.dataset.status === 'devolvido') {
                mostrarFeedback('warning', 'Este livro já foi devolvido.');
                devolverBtn.disabled = true;
                devolverBtn.setAttribute('aria-disabled', 'true');
                return;
            }

            try {
                setBotaoLoading(devolverBtn, 'Devolvendo...');
                mostrarLoading();

                const id = devolverBtn.dataset.id;
                const response = await fetch(`${API_URL}/api/emprestimos/${id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ status: 'devolvido' })
                });
                const data = await response.json();

                if (response.ok) {
                    mostrarFeedback('success', 'Livro devolvido com sucesso!');
                    await carregarEmprestimos();
                } else {
                    mostrarFeedback('danger', obterMensagemErro(data, 'Não foi possível devolver o livro.'));
                }
            } catch (error) {
                console.error('Erro ao devolver livro:', error);
                mostrarFeedback('danger', 'Erro de conexão ao devolver o livro.');
            } finally {
                resetBotaoLoading(devolverBtn);
                esconderLoading();
            }
        }
    });
}