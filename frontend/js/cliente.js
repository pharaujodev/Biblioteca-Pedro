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

    if (valor === 'aprovado' || valor === 'disponível' || valor === 'disponivel') {
        return `<span class="badge text-bg-success" aria-label="Status: ${valorOriginal}">${valorOriginal}</span>`;
    }

    if (valor === 'rejeitado' || valor === 'indisponível' || valor === 'indisponivel') {
        return `<span class="badge text-bg-danger" aria-label="Status: ${valorOriginal}">${valorOriginal}</span>`;
    }

    if (valor === 'pendente') {
        return `<span class="badge text-bg-warning text-dark" aria-label="Status: ${valorOriginal}">${valorOriginal}</span>`;
    }

    if (valor === 'devolvido') {
        return `<span class="badge text-bg-secondary" aria-label="Status: ${valorOriginal}">${valorOriginal}</span>`;
    }

    return `<span class="badge text-bg-light text-dark" aria-label="Status: ${valorOriginal}">${valorOriginal}</span>`;
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
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.dataset.target === targetId) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });
}

function renderizarLivros(livros) {
    const tabela = document.getElementById('tabela');
    const tbody = tabela.querySelector('tbody');
    tbody.innerHTML = '';

    if (!Array.isArray(livros) || livros.length === 0) {
        preencherEstadoVazio(tbody, 10, 'Nenhum livro encontrado.');
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
                <td>${criarBadgeStatus(livro.disponivel ? 'Disponível' : 'Indisponível')}</td>
                <td>${livro.quantidade}</td>
                <td>
                    <button type="button" class="btn btn-primary btn-sm emprestar-btn" data-id="${livro.id}">
                        Solicitar Empréstimo
                    </button>
                </td>
            </tr>
        `;
    });
}

function renderizarEmprestimos(emprestimos) {
    const tabela = document.getElementById('MeusEmprestimos');
    const tbody = tabela.querySelector('tbody');
    tbody.innerHTML = '';

    if (!Array.isArray(emprestimos) || emprestimos.length === 0) {
        preencherEstadoVazio(tbody, 3, 'Você ainda não possui empréstimos.');
        return;
    }

    emprestimos.forEach(emprestimo => {
        tbody.innerHTML += `
            <tr>
                <td>${emprestimo.livros?.titulo || '-'}</td>
                <td>${formatarData(emprestimo.data_emprestimo)}</td>
                <td>${formatarData(emprestimo.data_devolucao)}</td>
            </tr>
        `;
    });
}

function renderizarSolicitacoes(solicitacoes) {
    const tabela = document.getElementById('solicitacao');
    const tbody = tabela.querySelector('tbody');
    tbody.innerHTML = '';

    if (!Array.isArray(solicitacoes) || solicitacoes.length === 0) {
        preencherEstadoVazio(tbody, 3, 'Você ainda não possui solicitações.');
        return;
    }

    solicitacoes.forEach(solicitacao => {
        tbody.innerHTML += `
            <tr>
                <td>${solicitacao.livros?.titulo || '-'}</td>
                <td>${criarBadgeStatus(solicitacao.status)}</td>
                <td>${new Date(solicitacao.data_solicitacao).toLocaleString('pt-BR', {
                    dateStyle: 'short',
                    timeStyle: 'medium'
                })}</td>
            </tr>
        `;
    });
}

const pesquisarBotao = document.querySelector('#botaoPesquisar');

if (pesquisarBotao) {
    pesquisarBotao.addEventListener('click', async (e) => {
        e.preventDefault();

        const termoPesquisa = document.querySelector('#pesquisar').value.trim().toLowerCase();
        const secaoAtiva = document.querySelector('.conteudo-ativo');

        if (!secaoAtiva) {
            mostrarFeedback('warning', 'Selecione uma seção antes de pesquisar.');
            return;
        }

        try {
            mostrarLoading();

            if (secaoAtiva.id === 'tabela') {
                const response = await fetch(`${API_URL}/api/livros?search=${encodeURIComponent(termoPesquisa)}`);
                const livros = await response.json();

                if (!response.ok) {
                    mostrarFeedback('danger', obterMensagemErro(livros, 'Não foi possível pesquisar livros.'));
                    return;
                }

                renderizarLivros(livros);
            }
        } catch (error) {
            console.error('Erro na pesquisa:', error);
            mostrarFeedback('danger', 'Não foi possível concluir a pesquisa.');
        } finally {
            esconderLoading();
        }
    });
}

async function carregarLivros() {
    try {
        mostrarLoading();

        const response = await fetch(`${API_URL}/api/livros`);
        const livros = await response.json();

        if (!response.ok) {
            mostrarFeedback('danger', obterMensagemErro(livros, 'Não foi possível carregar os livros.'));
            return;
        }

        renderizarLivros(livros);
    } catch (error) {
        console.error('Erro ao carregar livros:', error);
        mostrarFeedback('danger', 'Não foi possível carregar os livros.');
    } finally {
        esconderLoading();
    }
}

const listarLivrosBtn = document.querySelector('#listarLivros');
if (listarLivrosBtn) {
    listarLivrosBtn.addEventListener('click', carregarLivros);
}

async function carregarEmprestimosCliente() {
    try {
        mostrarLoading();

        const response = await fetch(`${API_URL}/api/emprestimos`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const emprestimos = await response.json();

        if (!response.ok) {
            mostrarFeedback('danger', obterMensagemErro(emprestimos, 'Não foi possível carregar seus empréstimos.'));
            return;
        }

        renderizarEmprestimos(emprestimos);
    } catch (error) {
        console.error('Erro ao carregar empréstimos:', error);
        mostrarFeedback('danger', 'Não foi possível carregar seus empréstimos.');
    } finally {
        esconderLoading();
    }
}

const listarEmprestimosClienteBtn = document.querySelector('#meusEmprestimos');
if (listarEmprestimosClienteBtn) {
    listarEmprestimosClienteBtn.addEventListener('click', carregarEmprestimosCliente);
}

const tabelaLivros = document.getElementById('tabela');

if (tabelaLivros) {
    tabelaLivros.addEventListener('click', async (e) => {
        e.preventDefault();

        const emprestarBtn = e.target.closest('.emprestar-btn');
        if (!emprestarBtn) return;

        const id_usuario = localStorage.getItem('userId');
        const id_livro = emprestarBtn.dataset.id;

        try {
            setBotaoLoading(emprestarBtn, 'Enviando...');
            mostrarLoading();

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
                mostrarFeedback('success', 'Solicitação criada com sucesso!');
            } else {
                mostrarFeedback('danger', obterMensagemErro(data, 'Não foi possível criar a solicitação.'));
            }
        } catch (error) {
            console.error('Erro ao criar solicitação:', error);
            mostrarFeedback('danger', 'Erro de conexão ao criar a solicitação.');
        } finally {
            resetBotaoLoading(emprestarBtn);
            esconderLoading();
        }
    });
}

async function carregarSolicitacaoEmprestimo() {
    try {
        mostrarLoading();

        const response = await fetch(`${API_URL}/api/solicitacao-emprestimos/cliente`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const solicitacoes = await response.json();

        if (!response.ok) {
            mostrarFeedback('danger', obterMensagemErro(solicitacoes, 'Não foi possível carregar suas solicitações.'));
            return;
        }

        renderizarSolicitacoes(solicitacoes);
    } catch (error) {
        console.error('Erro ao carregar solicitações:', error);
        mostrarFeedback('danger', 'Não foi possível carregar suas solicitações.');
    } finally {
        esconderLoading();
    }
}

const listarSolicitacaoEmprestimoBtn = document.querySelector('#listarSolicitacao');
if (listarSolicitacaoEmprestimoBtn) {
    listarSolicitacaoEmprestimoBtn.addEventListener('click', carregarSolicitacaoEmprestimo);
}
