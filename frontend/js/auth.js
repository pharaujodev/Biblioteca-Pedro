const API_URL = window.location.origin;

function obterMensagemErro(data, mensagemPadrao) {
    return data?.error?.message || data?.message || mensagemPadrao;
}

function mostrarFeedback(tipo, mensagem) {
    const feedbackArea = document.getElementById('feedbackArea');
    if (!feedbackArea) return;

    feedbackArea.className = `alert alert-${tipo} mb-3`;
    feedbackArea.textContent = mensagem;
}

function limparFeedback() {
    const feedbackArea = document.getElementById('feedbackArea');
    if (!feedbackArea) return;

    feedbackArea.className = 'd-none';
    feedbackArea.textContent = '';
}

function limparValidacao(form) {
    if (!form) return;
    form.querySelectorAll('.is-invalid').forEach(campo => {
        campo.classList.remove('is-invalid');
        campo.removeAttribute('aria-invalid');
    });
}

function validarFormulario(form) {
    if (!form) return true;

    let valido = true;
    let primeiroInvalido = null;

    limparValidacao(form);

    form.querySelectorAll('[required]').forEach(campo => {
        const valor = campo.value.trim();

        if (!valor) {
            campo.classList.add('is-invalid');
            campo.setAttribute('aria-invalid', 'true');
            if (!primeiroInvalido) primeiroInvalido = campo;
            valido = false;
            return;
        }

        if (campo.type === 'email' && !campo.checkValidity()) {
            campo.classList.add('is-invalid');
            campo.setAttribute('aria-invalid', 'true');
            if (!primeiroInvalido) primeiroInvalido = campo;
            valido = false;
        }
    });

    if (primeiroInvalido) primeiroInvalido.focus();

    return valido;
}

function setBotaoLoading(botao, textoCarregando) {
    if (!botao) return;

    if (!botao.dataset.originalText) {
        botao.dataset.originalText = botao.textContent;
    }

    botao.disabled = true;
    botao.textContent = textoCarregando;
}

function resetBotaoLoading(botao) {
    if (!botao) return;

    botao.disabled = false;

    if (botao.dataset.originalText) {
        botao.textContent = botao.dataset.originalText;
    }
}

const loginBtn = document.getElementById('login-btn');
const cadastrarBtn = document.getElementById('cadastrar-btn');

if (loginBtn) {
    const loginForm = document.getElementById('login-form');

    loginBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        limparFeedback();

        if (!validarFormulario(loginForm)) {
            mostrarFeedback('warning', 'Preencha os campos obrigatórios corretamente.');
            return;
        }

        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('password').value.trim();

        try {
            setBotaoLoading(loginBtn, 'Entrando...');

            const response = await fetch(`${API_URL}/api/auth`, {
                method: 'POST',
                body: JSON.stringify({ email, senha }),
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data.usuario.id);

                mostrarFeedback('success', 'Login realizado com sucesso!');

                if (data.usuario.role === 'admin') {
                    setTimeout(() => {
                        window.location.href = 'admin.html';
                    }, 1200);
                } else {
                    setTimeout(() => {
                        window.location.href = 'usuario.html';
                    }, 1200);
                }
            } else {
                mostrarFeedback('danger', obterMensagemErro(data, 'Erro no login.'));
            }
        } catch (error) {
            console.error('Erro no login:', error);
            mostrarFeedback('danger', 'Erro de conexão ao realizar login.');
        } finally {
            resetBotaoLoading(loginBtn);
        }
    });
}

if (cadastrarBtn) {
    const cadastroForm = document.getElementById('cadastro-form');

    cadastrarBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        limparFeedback();

        if (!validarFormulario(cadastroForm)) {
            mostrarFeedback('warning', 'Preencha os campos obrigatórios corretamente.');
            return;
        }

        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value.trim();

        try {
            setBotaoLoading(cadastrarBtn, 'Cadastrando...');

            const response = await fetch(`${API_URL}/api/usuarios`, {
                method: 'POST',
                body: JSON.stringify({ nome, email, senha }),
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.json();

            if (response.ok) {
                mostrarFeedback('success', 'Cadastro realizado com sucesso!');
                cadastroForm.reset();
                limparValidacao(cadastroForm);

                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1200);
            } else {
                mostrarFeedback('danger', obterMensagemErro(data, 'Erro no cadastro.'));
            }
        } catch (error) {
            console.error('Erro no cadastro:', error);
            mostrarFeedback('danger', 'Erro de conexão ao realizar cadastro.');
        } finally {
            resetBotaoLoading(cadastrarBtn);
        }
    });
}